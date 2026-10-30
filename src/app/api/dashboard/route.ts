import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Get user's connections
  const connections = await prisma.instagramConnection.findMany({
    where: { userId: userSession.id },
    select: {
      id: true,
      username: true,
      avatar: true,
      status: true,
      tokenExpiresAt: true,
    },
  });

  const connectionIds = connections.map((c) => c.id);

  // 2. Get user's automations
  const automations = await prisma.automation.findMany({
    where: { connectionId: { in: connectionIds } },
    select: { id: true, name: true, keywords: true, mediaId: true },
  });
  const automationIds = automations.map((a) => a.id);

  // 3. Today's start timestamp and the rolling hour used for the account pace.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const hourlyReplyLimit = Math.max(
    1,
    Number(process.env.HOURLY_REPLY_LIMIT) || 60
  );
  const activeConnectionId = connections[0]?.id;

  // 4. Aggregated Funnel & KPI counts
  const [
    totalComments,
    totalMatched,
    totalSent,
    totalFailed,
    leadsToday,
    totalClicks,
    avgSpeedResult,
    repliesLastHour,
  ] = await Promise.all([
    // Total comments received
    prisma.event.count({
      where: { connectionId: { in: connectionIds } },
    }),
    // Total trigger keyword matched
    prisma.event.count({
      where: {
        connectionId: { in: connectionIds },
        matchStatus: "matched",
      },
    }),
    // DMs sent successfully
    prisma.event.count({
      where: {
        connectionId: { in: connectionIds },
        status: "sent",
      },
    }),
    // Needs attention / Failed
    prisma.event.count({
      where: {
        connectionId: { in: connectionIds },
        status: "failed",
      },
    }),
    // Leads today
    prisma.event.count({
      where: {
        connectionId: { in: connectionIds },
        status: "sent",
        createdAt: { gte: startOfToday },
      },
    }),
    // Total link clicks tracked through redirect
    prisma.event.aggregate({
      where: { connectionId: { in: connectionIds } },
      _sum: { linkClicks: true },
    }),
    // Average response time (ms)
    prisma.event.aggregate({
      where: {
        connectionId: { in: connectionIds },
        status: "sent",
        responseTimeMs: { not: null },
      },
      _avg: { responseTimeMs: true },
    }),
    // Replies sent in the last rolling hour for the active account.
    activeConnectionId
      ? prisma.event.count({
          where: {
            connectionId: activeConnectionId,
            status: "sent",
            createdAt: { gte: oneHourAgo },
          },
        })
      : Promise.resolve(0),
  ]);

  const linkClicks = totalClicks._sum.linkClicks || 0;
  const avgResponseTimeMs = Math.round(avgSpeedResult._avg.responseTimeMs || 1850);
  const deliveryRate = totalMatched > 0 ? Math.round((totalSent / totalMatched) * 100) : 100;
  const clickRate = totalSent > 0 ? Math.round((linkClicks / totalSent) * 100) : 0;
  const hourlyPercent = Math.min(
    100,
    Math.round((repliesLastHour / hourlyReplyLimit) * 100)
  );

  // 5. 7-Day activity chart data
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentEvents = await prisma.event.findMany({
    where: {
      connectionId: { in: connectionIds },
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      createdAt: true,
      status: true,
      linkClicks: true,
    },
  });

  const daysMap: Record<
    string,
    { date: string; comments: number; sent: number; clicks: number; failed: number }
  > = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const key = d.toISOString().split("T")[0];
    daysMap[key] = { date: label, comments: 0, sent: 0, clicks: 0, failed: 0 };
  }

  for (const ev of recentEvents) {
    const key = ev.createdAt.toISOString().split("T")[0];
    if (daysMap[key]) {
      daysMap[key].comments += 1;
      if (ev.status === "sent") daysMap[key].sent += 1;
      if (ev.status === "failed") daysMap[key].failed += 1;
      daysMap[key].clicks += ev.linkClicks || 0;
    }
  }

  const chartData = Object.values(daysMap);

  // 6. Recent 50 live activity events
  const activity = await prisma.event.findMany({
    where: { connectionId: { in: connectionIds } },
    include: {
      automation: {
        select: {
          id: true,
          name: true,
          keywords: true,
          mediaId: true,
          mediaThumbnail: true,
          mediaCaption: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    metrics: {
      totalComments,
      totalMatched,
      totalSent,
      totalFailed,
      leadsToday,
      linkClicks,
      deliveryRate,
      clickRate,
      avgResponseTimeMs,
    },
    hourlyUsage: {
      used: repliesLastHour,
      limit: hourlyReplyLimit,
      remaining: Math.max(0, hourlyReplyLimit - repliesLastHour),
      percent: hourlyPercent,
    },
    chartData,
    activity,
    connections,
  });
}
