"use client";

import { PageSkeleton } from "@/components/PageSkeleton";
import { PageLoadError } from "@/components/PageLoadError";
import { SessionExpired } from "@/components/SessionExpired";
import React, { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Instagram,
  MessageSquare,
  MousePointerClick,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Video,
} from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import {
  AnimatedNumber,
  EmptySignal,
  LiveDot,
  MetaItem,
  SectionHeader,
  Segmented,
  SignalCell,
  SignalHeader,
  SignalPage,
  SignalPanel,
  SignalMountains,
  StatusChip,
} from "@/components/workspace/signal-ui";
import { CHART_COLORS } from "@/lib/chart-colors";

interface DashboardData {
  metrics: {
    totalComments: number;
    totalMatched: number;
    totalSent: number;
    totalFailed: number;
    leadsToday: number;
    linkClicks: number;
    deliveryRate: number;
    clickRate: number;
    avgResponseTimeMs: number;
  };
  hourlyUsage: {
    used: number;
    limit: number;
    remaining: number;
    percent: number;
  };
  chartData: Array<{
    date: string;
    comments: number;
    sent: number;
    clicks: number;
    failed: number;
  }>;
  activity: Array<{
    id: string;
    commentId: string;
    commenterUsername: string | null;
    commentText: string | null;
    matchedKeyword: string | null;
    matchStatus: string;
    publicReplyStatus: string | null;
    status: string;
    error: string | null;
    responseTimeMs: number | null;
    linkClicks: number;
    deviceType: string | null;
    createdAt: string;
    automation: {
      id: string;
      name: string;
      keywords: string[];
      mediaThumbnail: string | null;
    } | null;
  }>;
  connections: Array<{
    id: string;
    username: string;
    avatar: string | null;
    status: string;
    tokenExpiresAt: string | null;
  }>;
}

type FilterMode = "all" | "sent" | "clicked" | "failed";

function percentChange(current: number, previous: number) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function relativeTime(value: string) {
  const date = new Date(value);
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="signal-tooltip">
      <div className="signal-tooltip-label">{label}</div>
      {payload.map((item: any) => (
        <div key={item.dataKey} className="signal-tooltip-row">
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: item.color || item.fill }}
            />
            {item.name}
          </span>
          <span className="font-semibold tabular-nums text-[#F4EFF6]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [authExpired, setAuthExpired] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { user: authUser, isAuthenticated } = useAuthStore();
  const reducedMotion = useReducedMotion();

  const fetchDashboard = async (manual = false) => {
    if (manual) setRefreshing(true);
    setLoadError(false);
    setAuthExpired(false);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = (await res.json()) as DashboardData;
        setData(json);
        setLastUpdated(new Date());
      } else if (res.status === 401) {
        const synced = await useAuthStore.getState().fetchSession();
        if (synced) {
          const retryRes = await fetch("/api/dashboard");
          if (retryRes.ok) {
            const retryJson = (await retryRes.json()) as DashboardData;
            setData(retryJson);
            setLastUpdated(new Date());
          } else {
            if (retryRes.status === 401) setAuthExpired(true);
            setLoadError(true);
          }
        } else {
          setAuthExpired(true);
          setLoadError(true);
        }
      } else {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => fetchDashboard(), 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id, isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterMode, searchTerm]);

  const activeConnection = data?.connections?.[0];
  const isConnected = Boolean(activeConnection);
  const isTokenExpiringSoon = activeConnection?.tokenExpiresAt
    ? new Date(activeConnection.tokenExpiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
    : false;

  const chartData = data?.chartData ?? [];
  const totals = useMemo(
    () =>
      chartData.reduce(
        (acc, day) => ({
          comments: acc.comments + day.comments,
          sent: acc.sent + day.sent,
          clicks: acc.clicks + day.clicks,
        }),
        { comments: 0, sent: 0, clicks: 0 }
      ),
    [chartData]
  );
  const today = chartData[chartData.length - 1];
  const yesterday = chartData[chartData.length - 2];
  const sentToday = today?.sent ?? 0;
  const commentsToday = today?.comments ?? 0;
  const clicksToday = today?.clicks ?? 0;
  const sentDelta = percentChange(sentToday, yesterday?.sent ?? 0);

  const filteredActivity = (data?.activity || []).filter((item) => {
    const matchesFilter =
      filterMode === "all" ||
      (filterMode === "sent" && item.status === "sent") ||
      (filterMode === "failed" && item.status === "failed") ||
      (filterMode === "clicked" && item.linkClicks > 0);
    if (!matchesFilter) return false;
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return [
      item.commenterUsername,
      item.commentText,
      item.matchedKeyword,
      item.automation?.name,
    ].some((value) => value?.toLowerCase().includes(query));
  });

  const totalPages = Math.max(1, Math.ceil(filteredActivity.length / itemsPerPage));
  const paginatedActivity = filteredActivity.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const funnel = [
    { label: "Comments received", value: data?.metrics.totalComments ?? 0, tone: "comments" },
    { label: "Matching comments", value: data?.metrics.totalMatched ?? 0, tone: "comments" },
    { label: "Messages delivered", value: data?.metrics.totalSent ?? 0, tone: "delivered" },
  ];
  const funnelBase = Math.max(1, funnel[0].value);
  const linkClicks = data?.metrics.linkClicks ?? 0;
  const clicksPerDelivered = (data?.metrics.totalSent ?? 0) > 0 ? linkClicks / (data?.metrics.totalSent ?? 1) : 0;

  const nextAction = !isConnected
    ? {
        title: "Connect your Instagram account",
        copy: "The engine stays idle until an account is connected.",
        href: "/instagram",
        label: "Connect now",
      }
    : isTokenExpiringSoon
    ? {
        title: "Reconnect before the token expires",
        copy: "Your connection expires within seven days. Reconnect to keep replies running.",
        href: "/how-to-connect",
        label: "Reconnect",
      }
    : (data?.metrics.totalFailed ?? 0) > 0
    ? {
        title: "Review failed deliveries",
        copy: `${data?.metrics.totalFailed} comment${data?.metrics.totalFailed === 1 ? "" : "s"} matched but did not receive a message.`,
        href: "/analytics",
        label: "Open report",
      }
    : (data?.metrics.clickRate ?? 0) < 10
    ? {
        title: "Give your link a clearer next step",
        copy: "Click rate is under 10%. Tune the message or link label in your reply rules.",
        href: "/instagram",
        label: "Tune replies",
      }
    : {
        title: "Momentum is healthy",
        copy: "Delivery and click-through are both holding. Open the report to see which rule is winning.",
        href: "/analytics",
        label: "See report",
      };

  if (initialLoading && !data) {
    return (
      <AppLayout>
        <div className="signal-page">
          <PageSkeleton kind="overview" />
        </div>
      </AppLayout>
    );
  }

  if (authExpired && !data) {
    return (
      <AppLayout>
        <div className="signal-page">
          <SessionExpired />
        </div>
      </AppLayout>
    );
  }

  if (loadError && !data) {
    return (
      <AppLayout>
        <div className="signal-page">
          <PageLoadError onRetry={() => fetchDashboard(true)} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SignalPage>
        <SignalHeader
          title="Signal overview"
          description="Everything your automated replies did, and the one move worth making next."
          badge={
            <StatusChip tone={isConnected ? "success" : "warning"}>
              <LiveDot tone={isConnected ? "success" : "warning"} size="sm" />
              {isConnected ? "Engine live" : "Not connected"}
            </StatusChip>
          }
          actions={
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fetchDashboard(true)}
                className="h-9 gap-2 px-3.5"
                aria-label="Refresh dashboard data"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#059669]" : ""}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Link href="/instagram/create/new?step=1">
                <Button size="sm" className="h-9 gap-2 px-3.5">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  New auto-reply
                </Button>
              </Link>
            </>
          }
          meta={
            <>
              <MetaItem
                label="Account"
                value={
                  activeConnection ? (
                    <span className="inline-flex items-center gap-1.5">
                      <LiveDot tone="success" size="sm" />@{activeConnection.username}
                    </span>
                  ) : (
                    "Not connected"
                  )
                }
              />
              <MetaItem label="Window" value="Last 7 days" />
              <MetaItem
                label="Updated"
                value={lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Loading"}
              />
              <MetaItem label="Access" value="Official Graph API" tone="violet" />
            </>
          }
        />

        {authExpired && <SessionExpired />}
        {loadError && !authExpired && <PageLoadError onRetry={() => fetchDashboard(true)} />}

        {isTokenExpiringSoon && (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-sm text-amber-100"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            <p className="flex-1">
              Your Instagram connection for <strong>@{activeConnection?.username}</strong> expires within seven days.
              Reconnect to keep automatic replies running.
            </p>
            <Link
              href="/how-to-connect"
              className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-300/20"
            >
              Reconnect account
            </Link>
          </div>
        )}

        {!isConnected ? (
          <SignalPanel>
            <EmptySignal
              icon={Instagram}
              title="Connect Instagram to start the signal"
              description="Once your creator account is connected, FreshDM will listen for comments, send private replies, and record every click and lead here."
              action={
                <Link href="/instagram">
                  <Button className="gap-2">
                    Connect Instagram
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              }
            />
          </SignalPanel>
        ) : (
          <>
            <SignalPanel className="signal-hero">
              <div className="signal-hero-main">
                <div className="signal-hero-wash" />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="signal-label">Today&apos;s signal</span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                      <LiveDot tone="success" size="sm" />
                      Live
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
                    <AnimatedNumber
                      value={sentToday}
                      className="signal-hero-number"
                      aria-label={`${sentToday} messages sent today`}
                    />
                    <div className="pb-2">
                      <p className="signal-hero-unit">messages sent today</p>
                      <p className="mt-1 text-[11px] text-[#A49AAE]">
                        {sentDelta === null
                          ? "First day of this window"
                          : `${sentDelta >= 0 ? "+" : ""}${sentDelta}% vs yesterday`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                    <span className="text-xs text-[#B8B1C0]">
                      <span className="font-semibold tabular-nums text-[#F4EFF6]">{commentsToday}</span> comments
                    </span>
                    <span className="text-xs text-[#B8B1C0]">
                      <span className="font-semibold tabular-nums text-[#F4EFF6]">{clicksToday}</span> clicks
                    </span>
                    <span className="text-xs text-[#B8B1C0]">
                      <span className="font-semibold tabular-nums text-[#F4EFF6]">{data?.metrics.leadsToday ?? 0}</span> leads today
                    </span>
                  </div>
                </div>
                <div className="relative mt-8">
                  <div className="h-28 w-full sm:h-32">
                    <SignalMountains
                      values={chartData.map((day) => day.sent)}
                      secondary={chartData.map((day) => day.comments)}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="signal-chart-legend">
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.delivered }} />
                        Delivered
                      </span>
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.comments }} />
                        Comments
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8F8797]">
                      Seven-day shape
                    </span>
                  </div>
                </div>
              </div>

              <aside className="signal-hero-aside">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="signal-section-title">Engine health</h2>
                  <StatusChip tone="success">
                    <LiveDot tone="success" size="sm" />
                    Operational
                  </StatusChip>
                </div>

                <div className="space-y-3">
                  <div className="signal-health-row">
                    <div>
                      <p className="signal-label">Instagram</p>
                      <p className="mt-1 text-sm font-semibold text-[#F4EFF6]">@{activeConnection?.username}</p>
                    </div>
                    <span className="mt-0.5 text-[11px] font-medium text-emerald-300">Connected</span>
                  </div>
                  <div className="signal-health-row">
                    <div>
                      <p className="signal-label">Delivery rate</p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-[#F4EFF6]">
                        {data?.metrics.deliveryRate ?? 0}%
                      </p>
                    </div>
                    <span className="mt-0.5 text-[11px] text-[#A49AAE]">messages reached</span>
                  </div>
                  <div className="signal-health-row">
                    <div>
                      <p className="signal-label">Reply speed</p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-[#F4EFF6]">
                        {data?.metrics.avgResponseTimeMs
                          ? `${(data.metrics.avgResponseTimeMs / 1000).toFixed(1)}s`
                          : "—"}
                      </p>
                    </div>
                    <span className="mt-0.5 text-[11px] text-[#A49AAE]">average send time</span>
                  </div>
                </div>

                <Link
                  href={nextAction.href}
                  className="signal-insight group block transition-colors hover:border-[#059669]/35 hover:bg-[#E8F7F0]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="signal-insight-title">{nextAction.title}</p>
                      <p className="signal-insight-copy">{nextAction.copy}</p>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-[#059669] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
                    {nextAction.label}
                  </span>
                </Link>
              </aside>
            </SignalPanel>

            <div className="signal-panel signal-strip" role="group" aria-label="All-time performance metrics">
              <SignalCell
                label="Comments"
                value={data?.metrics.totalComments ?? 0}
                hint="received on your posts"
                tone="white"
              />
              <SignalCell
                label="Matched"
                value={data?.metrics.totalMatched ?? 0}
                hint="contained a trigger word"
                tone="pale"
              />
              <SignalCell
                label="Delivered"
                value={data?.metrics.totalSent ?? 0}
                hint="private messages sent"
                tone="violet"
              />
              <SignalCell
                label="Link clicks"
                value={data?.metrics.linkClicks ?? 0}
                hint="tracked in your links"
                tone="pale"
              />
              <SignalCell
                label="Clicks / msg"
                value={clicksPerDelivered}
                decimals={1}
                suffix="×"
                hint="tracked clicks per delivered message"
                tone="warning"
              />
              <SignalCell
                label="Reply time"
                value={data?.metrics.avgResponseTimeMs ? Number((data.metrics.avgResponseTimeMs / 1000).toFixed(1)) : 0}
                decimals={1}
                suffix="s"
                hint="average time to send"
                tone="violet"
              />
            </div>

            <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
              <SignalPanel className="lg:col-span-8">
                <SectionHeader
                  icon={TrendingUp}
                  title="Seven-day signal"
                  description="Comments, deliveries, and clicks across the current window."
                  action={
                    <div className="signal-chart-legend">
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.comments }} />
                        Comments {totals.comments}
                      </span>
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.delivered }} />
                        Delivered {totals.sent}
                      </span>
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.clicks }} />
                        Clicks {totals.clicks}
                      </span>
                    </div>
                  }
                />
                <div className="signal-chart-shell">
                  <div className="h-[17rem] w-full sm:h-[19rem]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                          <defs>
                            <linearGradient id="dashboard-delivered" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={CHART_COLORS.delivered} stopOpacity={0.34} />
                              <stop offset="100%" stopColor={CHART_COLORS.delivered} stopOpacity={0.01} />
                            </linearGradient>
                            <linearGradient id="dashboard-comments" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={CHART_COLORS.comments} stopOpacity={0.2} />
                              <stop offset="100%" stopColor={CHART_COLORS.comments} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="2 6"
                            stroke="rgba(255,255,255,0.055)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#8F8797"
                            fontSize={10}
                            tick={{ fill: "#8F8797", fontFamily: "var(--font-mono)" }}
                            tickLine={false}
                            axisLine={{ stroke: "rgba(255,255,255,0.075)" }}
                            dy={8}
                          />
                          <YAxis
                            stroke="#8F8797"
                            fontSize={10}
                            tick={{ fill: "#8F8797", fontFamily: "var(--font-mono)" }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            dx={-4}
                          />
                          <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ stroke: "rgba(216,180,254,0.16)", strokeWidth: 1 }}
                          />
                          <Bar
                            dataKey="clicks"
                            name="Clicks"
                            fill={CHART_COLORS.clicks}
                            opacity={0.82}
                            barSize={14}
                            radius={[4, 4, 0, 0]}
                            isAnimationActive={!reducedMotion}
                            animationDuration={650}
                          />
                          <Area
                            type="monotone"
                            dataKey="comments"
                            name="Comments"
                            stroke={CHART_COLORS.comments}
                            strokeWidth={1.7}
                            fill="url(#dashboard-comments)"
                            isAnimationActive={!reducedMotion}
                            animationDuration={750}
                          />
                          <Area
                            type="monotone"
                            dataKey="sent"
                            name="Delivered"
                            stroke={CHART_COLORS.delivered}
                            strokeWidth={2.4}
                            fill="url(#dashboard-delivered)"
                            isAnimationActive={!reducedMotion}
                            animationDuration={850}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/[0.08] text-xs text-[#A49AAE]">
                        Activity will appear here as comments arrive.
                      </div>
                    )}
                  </div>
                </div>
              </SignalPanel>

              <SignalPanel className="flex flex-col lg:col-span-4" as="aside">
                <SectionHeader
                  icon={Filter}
                  title="Conversion pulse"
                  description="How comments progress to delivery and clicks."
                />
                <div className="flex flex-1 flex-col gap-4 p-5">
                  {funnel.map((stage) => {
                    const percentage = stage.value > 0 ? (stage.value / funnelBase) * 100 : 0;
                    return (
                      <div key={stage.label} className="signal-funnel-row">
                        <div className="signal-funnel-meta">
                          <span className="signal-funnel-label">{stage.label}</span>
                          <span className="signal-funnel-value">
                            {stage.value}
                            <span className="ml-1.5 text-[10px] font-normal text-[#A49AAE]">
                              {stage.value === 0 ? "—" : `${Math.round(percentage)}%`}
                            </span>
                          </span>
                        </div>
                        <div className="signal-funnel-track">
                          <div
                            className={`signal-funnel-fill transition-[width] duration-700 ease-out ${stage.tone === "delivered" ? "is-delivered" : ""}`}
                            style={{ width: `${Math.max(stage.value > 0 ? 3 : 0, Math.min(100, percentage))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="signal-click-stat">
                    <div>
                      <p className="signal-label">Link clicks</p>
                      <p className="signal-click-value">{linkClicks}</p>
                    </div>
                    <div className="text-right">
                      <p className="signal-label">Per delivered</p>
                      <p className="mt-1 text-xs font-semibold text-[#FDE68A]">
                        {clicksPerDelivered.toFixed(1)}×
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.07] pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="signal-label">Message quality</p>
                        <p className="mt-1 text-sm font-semibold text-[#F4EFF6]">
                          {data?.metrics.deliveryRate ?? 0}% delivered
                        </p>
                      </div>
                      <ShieldCheck className="h-4 w-4 text-[#059669]" aria-hidden="true" />
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#047857] via-[#10B981] to-[#34D399] transition-[width] duration-700 ease-out"
                        style={{ width: `${Math.max(2, Math.min(100, data?.metrics.deliveryRate ?? 0))}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-[#A49AAE]">
                      Failed deliveries are counted here as soon as a matched comment misses its message.
                    </p>
                  </div>

                  <Link
                    href="/analytics"
                    className="group mt-auto flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-xs font-semibold text-[#11271D] transition-colors hover:border-[#059669]/35 hover:bg-[#E8F7F0]"
                  >
                    Open full signal report
                    <ExternalLink className="h-3.5 w-3.5 text-[#059669] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </SignalPanel>
            </div>

            <SignalPanel>
              <SectionHeader
                icon={MessageSquare}
                title="Live ledger"
                description="Every comment, matched keyword, delivery, and click in order."
                action={
                  <Segmented<FilterMode>
                    ariaLabel="Filter activity"
                    value={filterMode}
                    onChange={setFilterMode}
                    options={[
                      { value: "all", label: "All" },
                      { value: "sent", label: "Delivered" },
                      { value: "clicked", label: "Clicked" },
                      { value: "failed", label: "Failed" },
                    ]}
                  />
                }
              />

              <div className="signal-filter-bar">
                <div className="relative w-full max-w-sm">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A49AAE]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search username, comment, or keyword"
                    aria-label="Search the live ledger"
                    className="signal-input"
                  />
                </div>
                <span className="text-[11px] text-[#A49AAE]">
                  {filteredActivity.length} event{filteredActivity.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="signal-table-shell">
                <table className="signal-table" aria-label="Recent automated reply activity">
                  <thead>
                    <tr>
                      <th scope="col">Creator</th>
                      <th scope="col">Comment</th>
                      <th scope="col">Signal</th>
                      <th scope="col">Delivery</th>
                      <th scope="col">Clicks</th>
                      <th scope="col" className="text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedActivity.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <EmptySignal
                            icon={MessageSquare}
                            title={searchTerm ? "No matching events" : "The ledger is quiet"}
                            description={
                              searchTerm
                                ? "No comment matches this search. Try a username, keyword, or a different status."
                                : "When a follower comments with a trigger word, the full path from comment to delivery and click will appear here."
                            }
                          />
                        </td>
                      </tr>
                    ) : (
                      paginatedActivity.map((event, index) => (
                        <tr
                          key={event.id}
                          style={
                            reducedMotion
                              ? undefined
                              : { animation: `fadeSlideIn 340ms cubic-bezier(0.16,1,0.3,1) ${index * 24}ms both` }
                          }
                        >
                          <td>
                            <div className="flex items-center gap-2.5">
                              <span className="signal-avatar" aria-hidden="true">
                                {(event.commenterUsername || "U")[0]}
                              </span>
                              <div className="min-w-0">
                                <span className="signal-strong block truncate">
                                  @{event.commenterUsername || "unknown"}
                                </span>
                                <span className="text-[10.5px] text-[#A49AAE]">
                                  {event.automation?.name || "Unassigned rule"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="max-w-[22rem]">
                            <div className="flex items-start gap-2.5">
                              <div className="signal-thumb mt-0.5 h-9 w-8 rounded-md">
                                {event.automation?.mediaThumbnail ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    loading="lazy"
                                    decoding="async"
                                    src={event.automation.mediaThumbnail}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="signal-thumb-placeholder">
                                    <Video className="h-3.5 w-3.5" aria-hidden="true" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-[12.5px] text-[#F4EFF6]">
                                  &ldquo;{event.commentText || "No text"}&rdquo;
                                </p>
                                <span className="mt-1 inline-block text-[10.5px] text-[#A49AAE]">
                                  {event.responseTimeMs ? `${(event.responseTimeMs / 1000).toFixed(1)}s reply` : "Queued"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            {event.matchedKeyword ? (
                              <span className="signal-code">{event.matchedKeyword}</span>
                            ) : (
                              <span className="text-[11px] text-[#8F8797]">No match</span>
                            )}
                          </td>
                          <td>
                            {event.status === "sent" ? (
                              <StatusChip tone="success">
                                <LiveDot tone="success" size="sm" />
                                Delivered
                              </StatusChip>
                            ) : event.status === "failed" ? (
                              <StatusChip tone="danger" className="whitespace-nowrap">
                                Failed
                              </StatusChip>
                            ) : (
                              <StatusChip tone="neutral">{event.status}</StatusChip>
                            )}
                          </td>
                          <td>
                            {event.linkClicks > 0 ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                                <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" />
                                {event.linkClicks}
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#8F8797]">0</span>
                            )}
                          </td>
                          <td className="text-right">
                            <span
                              className="text-[11px] text-[#A49AAE]"
                              title={new Date(event.createdAt).toLocaleString()}
                            >
                              {relativeTime(event.createdAt)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {filteredActivity.length > itemsPerPage && (
                <div className="signal-pagination">
                  <span>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredActivity.length)} of {filteredActivity.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      className="signal-icon-button"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-12 text-center text-xs tabular-nums text-[#F4EFF6]">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      className="signal-icon-button"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </SignalPanel>
          </>
        )}
      </SignalPage>
    </AppLayout>
  );
}
