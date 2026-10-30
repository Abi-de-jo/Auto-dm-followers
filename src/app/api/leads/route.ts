import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userSession = await getAppUser();
    if (!userSession?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's connections
    const connections = await prisma.instagramConnection.findMany({
      where: { userId: userSession.id },
      select: { id: true, username: true },
    });

    const connectionIds = connections.map((c) => c.id);

    // Fetch all events where capturedEmail is not null
    const events = await prisma.event.findMany({
      where: {
        connectionId: { in: connectionIds },
        capturedEmail: { not: null },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        commenterUsername: true,
        capturedEmail: true,
        createdAt: true,
        automation: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalLeads = await prisma.event.count({
      where: {
        connectionId: { in: connectionIds },
        capturedEmail: { not: null },
      },
    });

    return NextResponse.json({
      total: totalLeads,
      leads: events.map((ev) => ({
        id: ev.id,
        email: ev.capturedEmail,
        username: ev.commenterUsername,
        source: ev.automation?.name || "Direct Message / Lead Magnet",
        capturedAt: ev.createdAt,
      })),
    });
  } catch (error: unknown) {
    console.error("[Leads API Error]:", error);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}
