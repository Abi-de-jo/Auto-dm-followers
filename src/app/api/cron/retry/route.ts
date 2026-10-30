import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPrivateReply, refreshExpiringTokens } from "@/lib/instagram";

function isAuthorizedCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = req.headers.get("authorization");
  if (!header) return false;

  const expected = `Bearer ${secret}`;
  const providedBuffer = Buffer.from(header);
  const expectedBuffer = Buffer.from(expected);

  return (
    providedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: "Cron secret is not configured" },
      { status: 503 }
    );
  }

  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Refresh expiring tokens
  const tokenRefreshResult = await refreshExpiringTokens();

  // 2. Retry transient failed events (retryCount < 3)
  const failedEvents = await prisma.event.findMany({
    where: {
      status: "failed",
      retryCount: { lt: 3 },
      automation: { isActive: true },
      // Exclude permanent failures
      NOT: [
        { error: { contains: "invalid token", mode: "insensitive" } },
        { error: { contains: "too old", mode: "insensitive" } },
        { error: { contains: "personal account", mode: "insensitive" } },
      ],
    },
    include: {
      automation: {
        include: { connection: true },
      },
    },
    take: 20,
  });

  let retriedSuccess = 0;
  let retriedFail = 0;

  for (const ev of failedEvents) {
    if (!ev.automation || !ev.automation.connection) continue;

    try {
      const { messageId } = await sendPrivateReply({
        connectionId: ev.automation.connection.id,
        commentId: ev.commentId,
        text: ev.automation.dmText,
        linkUrl: ev.automation.linkUrl,
        linkLabel: ev.automation.linkLabel,
      });

      await prisma.event.update({
        where: { id: ev.id },
        data: {
          status: "sent",
          apiResponseId: messageId,
          error: null,
        },
      });
      retriedSuccess++;
    } catch (err: unknown) {
      retriedFail++;
      const errorMessage = err instanceof Error ? err.message : String(err);
      await prisma.event.update({
        where: { id: ev.id },
        data: {
          retryCount: { increment: 1 },
          error: errorMessage,
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    tokens: tokenRefreshResult,
    events: {
      attempted: failedEvents.length,
      retriedSuccess,
      retriedFail,
    },
  });
}
