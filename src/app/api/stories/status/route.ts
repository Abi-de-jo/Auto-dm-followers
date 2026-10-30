import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userSession = await getAppUser();
    if (!userSession?.id) {
      return NextResponse.json({ hasStoryActive: false });
    }

    const connections = await prisma.instagramConnection.findMany({
      where: { userId: userSession.id },
      select: { id: true },
    });
    const connectionIds = connections.map((c) => c.id);

    const storyAutomation = await prisma.automation.findFirst({
      where: {
        connectionId: { in: connectionIds },
        listenOnStories: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      hasStoryActive: Boolean(storyAutomation),
      automationId: storyAutomation?.id || null,
      storyDmText: storyAutomation?.storyDmText || null,
    });
  } catch {
    return NextResponse.json({ hasStoryActive: false });
  }
}
