import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userSession = await getAppUser();
    if (!userSession?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connections = await prisma.instagramConnection.findMany({
      where: { userId: userSession.id },
      select: { id: true, username: true, avatar: true },
    });
    const connectionIds = connections.map((c) => c.id);

    // Fetch automations that have Story Mentions enabled
    const storyAutomations = await prisma.automation.findMany({
      where: {
        connectionId: { in: connectionIds },
        listenOnStories: true,
      },
      include: {
        connection: {
          select: { username: true, avatar: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Count story events triggered
    const storyEvents = await prisma.event.findMany({
      where: {
        connectionId: { in: connectionIds },
        OR: [
          { commentText: { contains: "Story" } },
          { commentText: { contains: "Tagged you" } },
          { matchedKeyword: "story" },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        commenterUsername: true,
        commentText: true,
        status: true,
        createdAt: true,
        automationId: true,
      },
    });

    const totalSent = storyEvents.filter((e) => e.status === "sent").length;

    return NextResponse.json({
      automations: storyAutomations.map((a) => {
        const eventsForThis = storyEvents.filter((e) => e.automationId === a.id);
        return {
          id: a.id,
          name: a.name,
          mediaId: a.mediaId,
          mediaThumbnail: a.mediaThumbnail,
          mediaCaption: a.mediaCaption,
          storyDmText: a.storyDmText || a.dmText,
          linkUrl: a.linkUrl,
          linkLabel: a.linkLabel,
          isActive: a.isActive,
          createdAt: a.createdAt,
          dmsSentCount: eventsForThis.filter((e) => e.status === "sent").length,
          recentEvents: eventsForThis.slice(0, 5),
        };
      }),
      stats: {
        totalRules: storyAutomations.length,
        activeRules: storyAutomations.filter((a) => a.isActive).length,
        totalDmsSent: totalSent,
      },
      recentTriggers: storyEvents,
    });
  } catch (error) {
    console.error("[Story API Error]:", error);
    return NextResponse.json({ error: "Failed to load stories data" }, { status: 500 });
  }
}
