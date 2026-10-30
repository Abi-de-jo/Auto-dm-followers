import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 1. Look up event by trackingSlug
  const event = await prisma.event.findUnique({
    where: { trackingSlug: slug },
    include: { automation: true },
  });

  if (!event || !event.automation?.linkUrl) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Identify client device type
  const userAgent = req.headers.get("user-agent") || "";
  const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(userAgent);
  const deviceType = isMobile ? "mobile" : "desktop";

  // 3. Atomically increment link click metric & record timestamp asynchronously
  prisma.event
    .update({
      where: { id: event.id },
      data: {
        linkClicks: { increment: 1 },
        firstClickedAt: event.firstClickedAt || new Date(),
        deviceType,
      },
    })
    .catch((err) => {
      console.error("[Click Tracker] Error recording click:", err);
    });

  // 4. Perform instant HTTP 302 redirect to original target link
  return NextResponse.redirect(new URL(event.automation.linkUrl), 302);
}
