"use client";

import { PageSkeleton } from "@/components/PageSkeleton";
import { PageLoadError } from "@/components/PageLoadError";
import { SessionExpired } from "@/components/SessionExpired";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import {
  Zap,
  Plus,
  ArrowUpRight,
  MessageCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptySignal,
  LiveDot,
  MetaItem,
  SectionHeader,
  SignalCell,
  SignalHeader,
  SignalPage,
  SignalPanel,
  StatusChip,
} from "@/components/workspace/signal-ui";

interface StoryAutomation {
  id: string;
  name: string;
  mediaId: string | null;
  mediaThumbnail: string | null;
  mediaCaption: string | null;
  storyDmText: string;
  linkUrl: string | null;
  linkLabel: string | null;
  isActive: boolean;
  createdAt: string;
  dmsSentCount: number;
}

interface StoryStats {
  totalRules: number;
  activeRules: number;
  totalDmsSent: number;
}

interface RecentTrigger {
  id: string;
  commenterUsername: string | null;
  commentText: string | null;
  status: string;
  createdAt: string;
}

function statusTone(status: string) {
  if (status === "sent") return "success" as const;
  if (status === "failed") return "danger" as const;
  if (status === "matched") return "violet" as const;
  return "neutral" as const;
}

export default function StoriesPage() {
  const [automations, setAutomations] = useState<StoryAutomation[]>([]);
  const [stats, setStats] = useState<StoryStats>({ totalRules: 0, activeRules: 0, totalDmsSent: 0 });
  const [recentTriggers, setRecentTriggers] = useState<RecentTrigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [authExpired, setAuthExpired] = useState(false);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => {
        if (res.status === 401) {
          setAuthExpired(true);
          throw new Error("Session expired");
        }
        if (!res.ok) throw new Error("Could not load stories");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data?.automations)) {
          setAutomations(data.automations);
          setStats(data.stats || { totalRules: 0, activeRules: 0, totalDmsSent: 0 });
          setRecentTriggers(data.recentTriggers || []);
        }
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div className="signal-page"><PageSkeleton kind="stories" /></div></AppLayout>;
  if (authExpired) return <AppLayout><div className="signal-page"><SessionExpired /></div></AppLayout>;
  if (loadError) return <AppLayout><div className="signal-page"><PageLoadError onRetry={() => window.location.reload()} /></div></AppLayout>;

  return (
    <AppLayout>
      <SignalPage>
        <SignalHeader
          title="Story replies"
          description="Send a thank-you message when someone mentions you in their Instagram story."
          badge={
            <StatusChip tone={stats.activeRules > 0 ? "success" : "neutral"}>
              <LiveDot tone={stats.activeRules > 0 ? "success" : "muted"} size="sm" />
              {stats.activeRules > 0 ? "Replies on" : "No active replies"}
            </StatusChip>
          }
          actions={
            <Link href="/instagram">
              <Button size="sm" className="h-9 gap-2 px-3.5">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Set up a story reply
              </Button>
            </Link>
          }
          meta={
            <>
              <MetaItem label="Active" value={`${stats.activeRules} replies`} />
              <MetaItem label="Sent" value={`${stats.totalDmsSent} messages`} tone="success" />
              <MetaItem label="Trigger" value="Story mention" tone="violet" />
              <MetaItem label="Access" value="Official Graph API" tone="violet" />
            </>
          }
        />

        <div className="signal-panel signal-strip signal-strip--three" role="group" aria-label="Story reply metrics">
          <SignalCell label="Active replies" value={stats.activeRules} hint="listening for story mentions" tone="violet" />
          <SignalCell label="Story messages" value={stats.totalDmsSent} hint="thank-you DMs sent" tone="success" />
          <SignalCell label="Total rules" value={stats.totalRules} hint="story reply setups" tone="white" />
        </div>

        <SignalPanel>
          <SectionHeader
            icon={Zap}
            title="Your story replies"
            description="Each rule watches for story mentions and sends the message you wrote."
            action={
              <StatusChip tone={automations.length > 0 ? "violet" : "neutral"}>
                {automations.length} {automations.length === 1 ? "rule" : "rules"}
              </StatusChip>
            }
          />

          {automations.length === 0 ? (
            <EmptySignal
              icon={Zap}
              title="No story replies yet"
              description="Create or edit a reply, then turn on “Also Reply to Instagram Stories” in step 2. Your message and its results will appear here."
              action={
                <Link href="/instagram">
                  <Button size="sm" className="gap-2">
                    Enable on a post
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 xl:grid-cols-2">
              {automations.map((rule) => (
                <SignalPanel key={rule.id} className="signal-panel--flush">
                  <div className="signal-rule-card-head">
                    <div className="signal-thumb h-14 w-14">
                      {rule.mediaThumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          loading="lazy"
                          decoding="async"
                          src={rule.mediaThumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="signal-thumb-placeholder">
                          <ImageIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-[#F4EFF6]">{rule.name}</h3>
                        <StatusChip tone={rule.isActive ? "success" : "neutral"}>
                          {rule.isActive ? "Active" : "Paused"}
                        </StatusChip>
                      </div>
                      <p className="mt-1 line-clamp-1 text-[11px] text-[#A49AAE]">
                        {rule.mediaCaption || (rule.mediaId ? "Specific Reel / Post" : "All story mentions")}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="signal-code">{rule.dmsSentCount} sent</span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#8F8797]">
                          {new Date(rule.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="signal-rule-card-body">
                    <div className="signal-insight">
                      <p className="signal-label">Thank-you message</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#E7E1EA]">
                        {rule.storyDmText}
                      </p>
                      {rule.linkUrl && (
                        <p className="mt-2 truncate text-[10.5px] text-[#059669]">
                          {rule.linkLabel ? `${rule.linkLabel}: ` : ""}{rule.linkUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="signal-rule-card-foot">
                    <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#8F8797]">
                      Story mention
                    </span>
                    <Link
                      href={`/instagram/create/${rule.id}?step=2`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669] transition-colors hover:underline"
                    >
                      Edit reply
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </SignalPanel>
              ))}
            </div>
          )}
        </SignalPanel>

        {recentTriggers.length > 0 && (
          <SignalPanel>
            <SectionHeader
              icon={MessageCircle}
              title="Recent story mentions"
              description="The latest followers who triggered a story reply."
              action={<StatusChip tone="violet">{recentTriggers.length} recent</StatusChip>}
            />
            <div className="signal-table-shell">
              <table className="signal-table">
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Action</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTriggers.map((event) => (
                    <tr key={event.id}>
                      <td className="font-mono text-[#F4EFF6]">
                        @{event.commenterUsername || "follower"}
                      </td>
                      <td className="text-[#059669]">
                        {event.commentText || "Tagged you in Story"}
                      </td>
                      <td>
                        <StatusChip tone={statusTone(event.status)}>{event.status}</StatusChip>
                      </td>
                      <td className="text-right font-mono text-[11px]">
                        {new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SignalPanel>
        )}
      </SignalPage>
    </AppLayout>
  );
}
