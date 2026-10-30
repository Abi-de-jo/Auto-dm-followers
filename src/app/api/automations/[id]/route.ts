import { NextRequest, NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateAutomationSchema = z.object({
  name: z.string().optional(),
  mediaId: z.string().nullable().optional(),
  mediaThumbnail: z.string().nullable().optional(),
  mediaCaption: z.string().nullable().optional(),
  keywords: z.array(z.string()).optional(),
  matchMode: z.enum(["contains", "exact", "any_comment"]).optional(),
  dmText: z.string().min(1).max(1000).optional(),
  dmVariantB: z.string().max(1000).optional().nullable(),
  captureEmail: z.boolean().optional(),
  linkUrl: z.string().url().optional().nullable().or(z.literal("")),
  linkLabel: z.string().max(40).optional().nullable(),
  publicReply: z.string().max(300).optional().nullable(),
  listenOnStories: z.boolean().optional(),
  storyDmText: z.string().max(1000).optional().nullable(),
  replyToReelShares: z.boolean().optional(),
  reelShareDmText: z.string().max(1000).optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await Promise.resolve(params);

  if (id === "new") {
    return NextResponse.json({ automation: null });
  }

  const automation = await prisma.automation.findUnique({
    where: { id },
    include: {
      connection: true,
      _count: { select: { events: true } },
    },
  });

  if (!automation || automation.connection.userId !== userSession.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ automation });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await Promise.resolve(params);

  // Verify ownership
  const automation = await prisma.automation.findUnique({
    where: { id },
    include: { connection: true },
  });

  if (!automation || automation.connection.userId !== userSession.id) {
    return NextResponse.json({ error: "Automation not found" }, { status: 404 });
  }

  const body = (await req.json()) as unknown;
  const parseResult = updateAutomationSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.format() },
      { status: 400 }
    );
  }

  const updated = await prisma.automation.update({
    where: { id },
    data: parseResult.data,
  });

  return NextResponse.json({ automation: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await Promise.resolve(params);

  // Verify ownership
  const automation = await prisma.automation.findUnique({
    where: { id },
    include: { connection: true },
  });

  if (!automation || automation.connection.userId !== userSession.id) {
    return NextResponse.json({ error: "Automation not found" }, { status: 404 });
  }

  await prisma.automation.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
