"use client";

import { PageSkeleton } from "@/components/PageSkeleton";
import { PageLoadError } from "@/components/PageLoadError";
import { SessionExpired } from "@/components/SessionExpired";
import React, { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  MessageSquare,
  MousePointerClick,
  RefreshCw,
  Search,
  Send,
  SlidersHorizontal,
  Timer,
  TrendingUp,
  Video,
  Zap,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AnimatedNumber,
  EmptySignal,
  LiveDot,
  MetaItem,
  SectionHeader,
  Segmented,
  SignalCell,
  SignalHeader,
  SignalMeter,
  SignalPage,
  SignalPanel,
  SignalMountains,
  StatusChip,
} from "@/components/workspace/signal-ui";
import { CHART_COLORS } from "@/lib/chart-colors";

interface EventActivity {
  id: string;
  commentId: string;
  commenterUsername: string | null;
  commentText: string | null;
  matchedKeyword?: string | null;
  status: string;
  error: string | null;
  responseTimeMs?: number | null;
  linkClicks?: number;
  deviceType?: string | null;
  createdAt: string;
  automation: {
    id: string;
    name: string;
    keywords: string[];
    mediaId?: string | null;
    mediaThumbnail?: string | null;
    mediaCaption?: string | null;
  } | null;
}

interface AnalyticsData {
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
  chartData: Array<{
    date: string;
    comments: number;
    sent: number;
    clicks: number;
    failed: number;
  }>;
  activity: EventActivity[];
  connections: Array<{
    id: string;
    username: string;
    avatar: string | null;
  }>;
  automations?: Array<{
    id: string;
    name: string;
    mediaId: string | null;
    mediaThumbnail: string | null;
    mediaCaption: string | null;
    keywords: string[];
    isActive: boolean;
    _count?: { events: number };
  }>;
}

type ChartMode = "flow" | "clicks";

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

function relativeTime(value: string) {
  const date = new Date(value);
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [authExpired, setAuthExpired] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [chartMode, setChartMode] = useState<ChartMode>("flow");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const reducedMotion = useReducedMotion();

  const fetchData = async (manual = false) => {
    if (manual) setRefreshing(true);
    setLoadError(false);
    setAuthExpired(false);
    try {
      const [dashRes, autoRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/automations"),
      ]);
      if (dashRes.ok) {
        const dashJson = await dashRes.json();
        let automations = [];
        if (autoRes.ok) {
          const autoJson = await autoRes.json();
          automations = autoJson.automations || [];
        }
        setData({ ...dashJson, automations });
        setLastUpdated(new Date());
        if (!autoRes.ok) setLoadError(true);
      } else {
        if (dashRes.status === 401) setAuthExpired(true);
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
    fetchData();
    const interval = setInterval(() => fetchData(), 12000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const chartData = data?.chartData ?? [];
  const totals = useMemo(
    () =>
      chartData.reduce(
        (acc, day) => ({
          comments: acc.comments + day.comments,
          sent: acc.sent + day.sent,
          clicks: acc.clicks + day.clicks,
          failed: acc.failed + day.failed,
        }),
        { comments: 0, sent: 0, clicks: 0, failed: 0 }
      ),
    [chartData]
  );

  const hasSignal = totals.comments > 0;
  const activeConnection = data?.connections?.[0];
  const filteredActivity = (data?.activity || []).filter((item) => {
    const matchesSearch = [
      item.commenterUsername,
      item.commentText,
      item.automation?.name,
      item.matchedKeyword,
    ].some((value) => value?.toLowerCase().includes(searchTerm.trim().toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredActivity.length / itemsPerPage));
  const paginatedActivity = filteredActivity.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeAutomationsCount = data?.automations?.filter((automation) => automation.isActive).length || 0;
  const sortedAutomations = [...(data?.automations || [])].sort(
    (a, b) => (b._count?.events || 0) - (a._count?.events || 0)
  );
  const maxAutomationEvents = Math.max(1, ...sortedAutomations.map((automation) => automation._count?.events || 0));

  const flow = [
    {
      label: "Comments received",
      value: data?.metrics.totalComments ?? 0,
      note: "every comment received",
      icon: MessageSquare,
    },
    {
      label: "Matched a keyword",
      value: data?.metrics.totalMatched ?? 0,
      note: "eligible for a reply",
      icon: Zap,
    },
    {
      label: "Messages delivered",
      value: data?.metrics.totalSent ?? 0,
      note: `${data?.metrics.deliveryRate ?? 0}% delivery rate`,
      icon: Send,
    },
  ];
  const linkClicks = data?.metrics.linkClicks ?? 0;
  const clicksPerDelivered = (data?.metrics.totalSent ?? 0) > 0 ? linkClicks / (data?.metrics.totalSent ?? 1) : 0;

  const statusOptions = [
    { label: "All statuses", val: "all" },
    { label: "Sent", val: "sent" },
    { label: "Matched", val: "matched" },
    { label: "Failed", val: "failed" },
    { label: "Skipped", val: "skipped" },
  ];

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
          <PageLoadError onRetry={() => fetchData(true)} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SignalPage>
        <SignalHeader
          title="Signal report"
          description="The full path from comment to delivery to click, with the rules behind it."
          badge={
            <StatusChip tone="violet">
              <BarChart3 className="h-3 w-3" aria-hidden="true" />
              Seven-day window
            </StatusChip>
          }
          actions={
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fetchData(true)}
                className="h-9 gap-2 px-3.5"
                aria-label="Refresh analytics"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#D8B4FE]" : ""}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Link href="/instagram">
                <Button size="sm" variant="outline" className="h-9 gap-2 px-3.5">
                  Manage rules
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
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
              <MetaItem label="Active rules" value={`${activeAutomationsCount} listening`} />
              <MetaItem label="Updated" value={lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Loading"} />
              <MetaItem label="Leads today" value={String(data?.metrics.leadsToday ?? 0)} tone="violet" />
            </>
          }
        />

        {authExpired && <SessionExpired />}
        {loadError && !authExpired && <PageLoadError onRetry={() => fetchData(true)} />}

        <SignalPanel className="signal-hero">
          <div className="signal-hero-main">
            <div className="signal-hero-wash" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="signal-label">This week&apos;s signal</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#D8B4FE]">
                  <LiveDot tone={hasSignal ? "violet" : "muted"} size="sm" />
                  {chartData.length > 0
                    ? `${chartData.length} day window`
                    : "Waiting for the first comment"}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
                <AnimatedNumber value={totals.sent} className="signal-hero-number" />
                <div className="pb-2">
                  <p className="signal-hero-unit">messages delivered</p>
                  <p className="mt-1 text-[11px] text-[#A49AAE]">
                    from {totals.comments} comments and {totals.clicks} clicks
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                <span className="text-xs text-[#B8B1C0]">
                  <span className="font-semibold tabular-nums text-[#F4EFF6]">{totals.comments}</span> comments
                </span>
                <span className="text-xs text-[#B8B1C0]">
                  <span className="font-semibold tabular-nums text-[#F4EFF6]">{totals.clicks}</span> clicks
                </span>
                <span className="text-xs text-[#B8B1C0]">
                  <span className="font-semibold tabular-nums text-[#F4EFF6]">{totals.failed}</span> failed
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
              <h2 className="signal-section-title">Signal quality</h2>
              <StatusChip tone={!hasSignal ? "neutral" : totals.failed > 0 ? "warning" : "success"}>
                <LiveDot tone={!hasSignal ? "muted" : totals.failed > 0 ? "warning" : "success"} size="sm" />
                {!hasSignal ? "No signal yet" : totals.failed > 0 ? `${totals.failed} failed` : "Healthy"}
              </StatusChip>
            </div>
            <div className="space-y-4">
              <SignalMeter
                value={data?.metrics.deliveryRate ?? 0}
                label="Delivery rate"
                caption="Share of matched comments that received a message."
              />
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="signal-label">Clicks / delivered</span>
                  <span className="text-[0.8125rem] font-semibold tabular-nums text-[#FDE68A]">
                    {clicksPerDelivered.toFixed(1)}×
                  </span>
                </div>
                <div className="signal-track">
                  <div
                    className="signal-track-fill"
                    style={{
                      width: `${Math.min(100, Math.max(2, (clicksPerDelivered / 5) * 100))}%`,
                      background: "linear-gradient(90deg, #B45309, #FBBF24)",
                    }}
                  />
                </div>
                <p className="signal-meter-caption">
                  Total tracked clicks divided by delivered messages. One message can be clicked more than once.
                </p>
              </div>
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
              <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#A49AAE]">
                <Timer className="h-3 w-3" aria-hidden="true" />
                average
              </span>
            </div>
          </aside>
        </SignalPanel>

        <div className="signal-panel signal-strip" role="group" aria-label="Analytics summary metrics">
          <SignalCell label="Comments" value={data?.metrics.totalComments ?? 0} hint="all time" tone="white" />
          <SignalCell label="Matched" value={data?.metrics.totalMatched ?? 0} hint="trigger keywords" tone="pale" />
          <SignalCell label="Delivered" value={data?.metrics.totalSent ?? 0} hint="private messages" tone="violet" />
          <SignalCell label="Failed" value={data?.metrics.totalFailed ?? 0} hint="needs review" tone="danger" />
          <SignalCell label="Link clicks" value={data?.metrics.linkClicks ?? 0} hint="tracked" tone="pale" />
          <SignalCell label="Leads today" value={data?.metrics.leadsToday ?? 0} hint="captured emails" tone="violet" />
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <SignalPanel className="lg:col-span-8">
            <SectionHeader
              icon={TrendingUp}
              title="Signal over time"
              description="Compare the shape of engagement and delivery across the window."
              action={
                <Segmented<ChartMode>
                  ariaLabel="Choose chart series"
                  value={chartMode}
                  onChange={setChartMode}
                  options={[
                    { value: "flow", label: "Flow" },
                    { value: "clicks", label: "Clicks" },
                  ]}
                />
              }
            />
            <div className="signal-chart-shell">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div className="signal-chart-legend">
                  {chartMode === "flow" ? (
                    <>
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.comments }} />
                        Comments {totals.comments}
                      </span>
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.delivered }} />
                        Delivered {totals.sent}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.clicks }} />
                        Clicks {totals.clicks}
                      </span>
                      <span className="signal-chart-legend-item">
                        <span className="signal-chart-legend-mark" style={{ backgroundColor: CHART_COLORS.delivered }} />
                        Delivered {totals.sent}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[11px] text-[#A49AAE]">
                  {chartData.length > 0 ? `${chartData[0]?.date} — ${chartData[chartData.length - 1]?.date}` : "No window yet"}
                </span>
              </div>
              <div className="h-[17rem] w-full sm:h-[19rem]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="analytics-delivered" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={CHART_COLORS.delivered} stopOpacity={0.34} />
                          <stop offset="100%" stopColor={CHART_COLORS.delivered} stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="analytics-comments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={CHART_COLORS.comments} stopOpacity={0.2} />
                          <stop offset="100%" stopColor={CHART_COLORS.comments} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.055)" vertical={false} />
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
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(216,180,254,0.16)", strokeWidth: 1 }} />
                      {chartMode === "flow"
                        ? [
                            <Area
                              key="comments"
                              type="monotone"
                              dataKey="comments"
                              name="Comments"
                              stroke={CHART_COLORS.comments}
                              strokeWidth={1.7}
                              fill="url(#analytics-comments)"
                              isAnimationActive={!reducedMotion}
                              animationDuration={750}
                            />,
                            <Area
                              key="sent"
                              type="monotone"
                              dataKey="sent"
                              name="Delivered"
                              stroke={CHART_COLORS.delivered}
                              strokeWidth={2.4}
                              fill="url(#analytics-delivered)"
                              isAnimationActive={!reducedMotion}
                              animationDuration={850}
                            />,
                          ]
                        : [
                            <Bar
                              key="clicks"
                              dataKey="clicks"
                              name="Clicks"
                              fill={CHART_COLORS.clicks}
                              opacity={0.82}
                              barSize={18}
                              radius={[4, 4, 0, 0]}
                              isAnimationActive={!reducedMotion}
                              animationDuration={700}
                            />,
                            <Area
                              key="sent"
                              type="monotone"
                              dataKey="sent"
                              name="Delivered"
                              stroke={CHART_COLORS.delivered}
                              strokeWidth={2}
                              fill="url(#analytics-delivered)"
                              isAnimationActive={!reducedMotion}
                              animationDuration={850}
                            />,
                          ]}
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/[0.08] text-xs text-[#A49AAE]">
                    The signal will appear once comments start arriving.
                  </div>
                )}
              </div>
            </div>
          </SignalPanel>

          <SignalPanel className="flex flex-col lg:col-span-4" as="aside">
            <SectionHeader
              icon={Layers}
              title="Signal flow"
              description="Where comments leave the path."
            />
            <div className="flex flex-1 flex-col gap-4 p-5">
              {flow.map((stage, index) => {
                const Icon = stage.icon;
                const previous = index === 0 ? stage.value : flow[index - 1].value;
                const conversion = previous > 0 ? Math.round((stage.value / previous) * 100) : 0;
                return (
                  <div key={stage.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="signal-icon-chip h-7 w-7 rounded-lg">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      {index < flow.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-white/[0.08]" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xs font-medium text-[#E7E1EA]">{stage.label}</span>
                        <span className="text-sm font-semibold tabular-nums text-[#F4EFF6]">{stage.value}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-[#A49AAE]">{stage.note}</span>
                        <span className="text-[10px] tabular-nums text-[#C084FC]">
                          {index === 0 ? "entry" : `${conversion}% step`}
                        </span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.055]">
                        <div
                          className={`h-full rounded-full transition-[width] duration-700 ease-out ${index === flow.length - 1 ? "bg-gradient-to-r from-[#047857] via-[#10B981] to-[#34D399]" : "bg-gradient-to-r from-[#5A1688] via-[#7A22B0] to-[#C084FC]"}`}
                          style={{ width: `${Math.max(stage.value > 0 ? 3 : 0, index === 0 ? 100 : Math.min(100, conversion))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="signal-click-stat">
                <div className="flex items-center gap-2.5">
                  <span className="signal-icon-chip h-7 w-7 rounded-lg">
                    <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="signal-label">Link clicks</p>
                    <p className="signal-click-value">{linkClicks}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="signal-label">Clicks / delivered</p>
                  <p className="mt-1 text-xs font-semibold text-[#FDE68A]">{clicksPerDelivered.toFixed(1)}×</p>
                  <p className="mt-0.5 text-[10px] text-[#A49AAE]">{linkClicks} tracked clicks</p>
                </div>
              </div>

              <div className="signal-insight mt-auto">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="signal-insight-title">
                      {totals.failed > 0
                        ? `${totals.failed} deliveries need attention`
                        : !hasSignal
                          ? "No delivery signal yet"
                          : "All deliveries are healthy"}
                    </p>
                    <p className="signal-insight-copy">
                      {totals.failed > 0
                        ? "Open the ledger below and filter by failed to inspect the comments that missed a message."
                        : !hasSignal
                          ? "Connect Instagram and create a reply rule. The first matched comment will start this report."
                          : "No failed deliveries in this window. Keep your keywords specific to protect relevance."}
                    </p>
                  </div>
                  {hasSignal ? (
                    <Check className="h-4 w-4 shrink-0 text-[#C084FC]" aria-hidden="true" />
                  ) : (
                    <Zap className="h-4 w-4 shrink-0 text-[#A49AAE]" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
          </SignalPanel>
        </div>

        <SignalPanel>
          <SectionHeader
            icon={SlidersHorizontal}
            title="Rule performance"
            description="The reply rules producing the signal, ranked by comments received."
            action={
              <Link href="/instagram">
                <Button size="sm" variant="secondary" className="h-9 gap-1.5 px-3.5">
                  Manage rules
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Button>
              </Link>
            }
          />

          {sortedAutomations.length === 0 ? (
            <EmptySignal
              icon={Zap}
              title="No reply rules yet"
              description="Create a rule to start the signal. Each rule can target a post, a keyword, and its own private message."
              action={
                <Link href="/instagram/create/new?step=1">
                  <Button size="sm" className="gap-2">
                    Create a rule
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-white/[0.055]">
              {sortedAutomations.map((automation, index) => {
                const events = automation._count?.events || 0;
                const share = (events / maxAutomationEvents) * 100;
                return (
                  <div
                    key={automation.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#7A22B0]/[0.035] sm:grid-cols-[auto_minmax(0,1fr)_minmax(9rem,0.35fr)_auto]"
                  >
                    <span className="w-6 text-[11px] font-semibold tabular-nums text-[#8F8797]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="signal-thumb h-11 w-10">
                        {automation.mediaThumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img loading="lazy" decoding="async" src={automation.mediaThumbnail} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="signal-thumb-placeholder">
                            <Video className="h-4 w-4" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[12.5px] font-semibold text-[#F4EFF6]">{automation.name}</span>
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${automation.isActive ? "bg-emerald-400" : "bg-zinc-600"}`} />
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {automation.keywords.slice(0, 4).map((keyword) => (
                            <span key={keyword} className="signal-code">{keyword}</span>
                          ))}
                          {automation.keywords.length > 4 && (
                            <span className="text-[10px] text-[#8F8797]">+{automation.keywords.length - 4}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <div className="flex items-center justify-between gap-3 text-[11px]">
                        <span className="text-[#A49AAE]">share</span>
                        <span className="tabular-nums text-[#F4EFF6]">{Math.round(share)}%</span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.055]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#5A1688] to-[#C084FC]"
                          style={{ width: `${Math.max(events > 0 ? 3 : 0, share)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-semibold tabular-nums text-[#F4EFF6]">{events}</span>
                      <span className="text-[10.5px] text-[#A49AAE]">comments</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SignalPanel>

        <SignalPanel>
          <SectionHeader
            icon={MessageSquare}
            title="Reply history"
            description="Search the full ledger by creator, comment, keyword, or rule."
            action={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="signal-segment is-active h-9 px-3">
                    <span className="relative z-10 capitalize">
                      {statusFilter === "all" ? "All statuses" : statusFilter}
                    </span>
                    <ChevronDown className="relative z-10 h-3.5 w-3.5 text-[#D8B4FE]" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 rounded-xl border-white/[0.09] bg-[#0E0C12] p-1.5 text-[#E6E3E8]">
                  {statusOptions.map((item) => (
                    <DropdownMenuItem
                      key={item.val}
                      onClick={() => setStatusFilter(item.val)}
                      className={`flex items-center justify-between rounded-lg text-xs ${
                        statusFilter === item.val
                          ? "bg-[#7A22B0]/24 text-white"
                          : "text-[#B8B1C0] hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {item.label}
                      {statusFilter === item.val && <Check className="h-3.5 w-3.5 text-[#D8B4FE]" aria-hidden="true" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />

          <div className="signal-filter-bar">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A49AAE]" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search comments and replies"
                aria-label="Search reply history"
                className="signal-input"
              />
            </div>
            <span className="text-[11px] text-[#A49AAE]">
              {filteredActivity.length} event{filteredActivity.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="signal-table-shell">
            <table className="signal-table" aria-label="Reply history">
              <thead>
                <tr>
                  <th scope="col">Creator</th>
                  <th scope="col">Comment</th>
                  <th scope="col">Keyword</th>
                  <th scope="col">Speed</th>
                  <th scope="col">Clicks</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedActivity.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptySignal
                        icon={MessageSquare}
                        title={searchTerm ? "No matching events" : "No replies in this window"}
                        description={
                          searchTerm
                            ? `No event matches “${searchTerm}”. Try another creator, keyword, or status.`
                            : "Once a follower comments on a connected post, their path will be recorded here."
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
                            <span className="signal-strong block truncate">@{event.commenterUsername || "unknown"}</span>
                            <span className="text-[10.5px] text-[#A49AAE]">{event.automation?.name || "Unassigned"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[20rem]">
                        <p className="truncate text-[12.5px] text-[#F4EFF6]">&ldquo;{event.commentText || "No text"}&rdquo;</p>
                        {event.error && <p className="mt-0.5 truncate text-[10.5px] text-rose-300">{event.error}</p>}
                      </td>
                      <td>
                        {event.matchedKeyword ? (
                          <span className="signal-code">{event.matchedKeyword}</span>
                        ) : (
                          <span className="text-[11px] text-[#8F8797]">—</span>
                        )}
                      </td>
                      <td>
                        {event.responseTimeMs ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums text-emerald-300">
                            <Timer className="h-3 w-3" aria-hidden="true" />
                            {(event.responseTimeMs / 1000).toFixed(1)}s
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#8F8797]">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${(event.linkClicks || 0) > 0 ? "text-emerald-300" : "text-[#8F8797]"}`}>
                          <MousePointerClick className="h-3 w-3" aria-hidden="true" />
                          {event.linkClicks || 0}
                        </span>
                      </td>
                      <td>
                        {event.status === "sent" ? (
                          <StatusChip tone="success">
                            <LiveDot tone="success" size="sm" />
                            Sent
                          </StatusChip>
                        ) : event.status === "failed" ? (
                          <StatusChip tone="danger">Failed</StatusChip>
                        ) : (
                          <StatusChip tone="neutral">{event.status}</StatusChip>
                        )}
                      </td>
                      <td className="text-right">
                        <span className="text-[11px] text-[#A49AAE]" title={new Date(event.createdAt).toLocaleString()}>
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
      </SignalPage>
    </AppLayout>
  );
}
