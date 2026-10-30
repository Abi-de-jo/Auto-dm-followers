"use client";

import { PageSkeleton } from "@/components/PageSkeleton";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  ExternalLink,
  Instagram,
  Loader2,
  Lock,
  MessageSquare,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Video,
  X,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { authClient } from "@/lib/neon";
import { showDeleteConfirmToast, showSuccessToast } from "@/lib/toast";
import {
  EmptySignal,
  LiveDot,
  MetaItem,
  SectionHeader,
  Segmented,
  SignalCell,
  SignalHeader,
  SignalPage,
  SignalPanel,
  StatusChip,
} from "@/components/workspace/signal-ui";

interface InstagramAccount {
  id: string;
  username: string;
  avatar: string | null;
  status: string;
}

interface AutomationItem {
  id: string;
  name: string;
  mediaId: string | null;
  mediaThumbnail: string | null;
  mediaCaption: string | null;
  keywords: string[];
  matchMode: string;
  dmText: string;
  dmVariantB?: string | null;
  captureEmail?: boolean;
  linkUrl: string | null;
  linkLabel: string | null;
  publicReply: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { events: number };
}

type ViewMode = "ledger" | "grid";
type StatusFilter = "all" | "active" | "paused";

function triggerCategory(automation: AutomationItem) {
  return automation.publicReply ? "Message + public reply" : "Private message";
}

function matchModeLabel(matchMode: string) {
  if (matchMode === "exact") return "Exact word";
  if (matchMode === "any_comment") return "Any comment";
  return "Contains word";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function InstagramContent() {
  const { isAuthenticated, user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [connection, setConnection] = useState<InstagramAccount | null>(null);
  const [automations, setAutomations] = useState<AutomationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("ledger");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const [simulatorAutomation, setSimulatorAutomation] = useState<AutomationItem | null>(null);
  const [simulatorComment, setSimulatorComment] = useState("");
  const [simulatorStatus, setSimulatorStatus] = useState<"idle" | "running" | "matched" | "skipped">("idle");
  const [simulatorResult, setSimulatorResult] = useState<{
    matched: boolean;
    dmWillSend: boolean;
    publicReplyWillSend: boolean;
    keyword?: string;
  } | null>(null);

  const fetchData = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const [connRes, autoRes] = await Promise.all([
        fetch("/api/instagram/connection"),
        fetch("/api/automations"),
      ]);

      if (connRes.ok) {
        const connData = (await connRes.json()) as { connection?: InstagramAccount };
        setConnection(connData.connection || null);
      }
      if (autoRes.ok) {
        const autoData = (await autoRes.json()) as { automations?: AutomationItem[] };
        setAutomations(autoData.automations || []);
      }
      if (!connRes.ok || !autoRes.ok) {
        setError("We couldn’t load your replies. Refresh the page to try again.");
      } else {
        setError(null);
        setLastUpdated(new Date());
      }
    } catch {
      setError("We couldn’t load your replies. Check your connection and refresh the page.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      const urlSuccess = params.get("success");
      if (urlError) {
        setError(decodeURIComponent(urlError));
      }
      if (urlSuccess === "connected") {
        showSuccessToast("Instagram connected successfully!");
      }
      if (urlError || urlSuccess) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated || user) {
      setShowLoginModal(false);
      setSessionExpired(false);
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const handleConnectInstagram = async () => {
    if (!isAuthenticated && !user) {
      setShowLoginModal(true);
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/instagram/auth?format=json", {
        headers: { Accept: "application/json" },
      });
      if (res.status === 401) {
        setSessionExpired(true);
        setShowLoginModal(true);
        setConnecting(false);
        return;
      }
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      if (data?.error) {
        setError(data.error);
        setConnecting(false);
        return;
      }
      window.location.href = "/api/instagram/auth";
    } catch {
      window.location.href = "/api/instagram/auth";
    }
  };

  const handleGoogleSignInFromModal = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/instagram`,
      });
    } catch {
      setGoogleLoading(false);
    }
  };

  const handleToggleActive = async (automation: AutomationItem) => {
    try {
      await fetch(`/api/automations/${automation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !automation.isActive }),
      });
      setAutomations((current) =>
        current.map((item) =>
          item.id === automation.id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } catch {
      // The next refresh reflects the server's truth.
    }
  };

  const handleDeleteAutomation = (automationId: string) => {
    showDeleteConfirmToast(
      "Confirm automation deletion",
      async () => {
        try {
          await fetch(`/api/automations/${automationId}`, { method: "DELETE" });
          setAutomations((current) => current.filter((item) => item.id !== automationId));
          showSuccessToast("Automation deleted", "The auto-reply flow has been removed.");
        } catch {
          // The confirmation toast already names the failure.
        }
      },
      "This will stop automatic replies on this post or story."
    );
  };

  const openSimulator = (automation: AutomationItem) => {
    setSimulatorAutomation(automation);
    setSimulatorComment(automation.keywords[0] || "access");
    setSimulatorStatus("idle");
    setSimulatorResult(null);
  };

  const runSimulator = () => {
    if (!simulatorAutomation) return;
    setSimulatorStatus("running");
    window.setTimeout(() => {
      const lower = simulatorComment.toLowerCase().trim();
      const matchedKeyword = simulatorAutomation.keywords.find((keyword) =>
        lower.includes(keyword.toLowerCase())
      );
      const matched = Boolean(matchedKeyword);
      setSimulatorResult({
        matched,
        dmWillSend: matched && simulatorAutomation.isActive,
        publicReplyWillSend: Boolean(
          matched && simulatorAutomation.isActive && simulatorAutomation.publicReply
        ),
        keyword: matchedKeyword,
      });
      setSimulatorStatus(matched ? "matched" : "skipped");
    }, 340);
  };

  const filteredAutomations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return automations.filter((automation) => {
      const matchesSearch =
        !query ||
        automation.name.toLowerCase().includes(query) ||
        automation.keywords.some((keyword) => keyword.toLowerCase().includes(query)) ||
        automation.dmText.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && automation.isActive) ||
        (statusFilter === "paused" && !automation.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [automations, searchQuery, statusFilter]);

  const selectedAutomation =
    filteredAutomations.find((automation) => automation.id === selectedId) ||
    filteredAutomations[0] ||
    null;

  useEffect(() => {
    if (filteredAutomations.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!filteredAutomations.some((automation) => automation.id === selectedId)) {
      setSelectedId(filteredAutomations[0].id);
    }
  }, [filteredAutomations, selectedId]);

  const totalEvents = automations.reduce(
    (total, automation) => total + (automation._count?.events || 0),
    0
  );
  const activeCount = automations.filter((automation) => automation.isActive).length;
  const pausedCount = automations.length - activeCount;
  const uniqueKeywords = new Set(automations.flatMap((automation) => automation.keywords)).size;

  const selectAutomation = (automationId: string) => {
    setSelectedId(automationId);
    if (window.matchMedia("(max-width: 980px)").matches) {
      window.requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="signal-page">
          <PageSkeleton kind="replies" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SignalPage>
        <SignalHeader
          title="Auto-replies"
          description="The rules listening to your comments, with the message each one sends."
          badge={
            <StatusChip tone={connection ? "success" : "warning"}>
              <LiveDot tone={connection ? "success" : "warning"} size="sm" />
              {connection ? `@${connection.username}` : "Connect required"}
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
                aria-label="Refresh automations"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#D8B4FE]" : ""}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              {connection && (
                <Link href="/instagram/create/new?step=1">
                  <Button size="sm" className="h-9 gap-2 px-3.5">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    New reply
                  </Button>
                </Link>
              )}
            </>
          }
          meta={
            <>
              <MetaItem label="Account" value={connection ? `@${connection.username}` : "Not connected"} />
              <MetaItem label="Rules" value={`${automations.length} total`} />
              <MetaItem label="Captured" value={`${totalEvents} comments`} />
              <MetaItem
                label="Updated"
                value={lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Loading"}
                tone="violet"
              />
            </>
          }
        />

        {error && (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl border border-rose-400/25 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-100">
            <MessageSquare className="h-4 w-4 shrink-0 text-rose-300" aria-hidden="true" />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={() => fetchData(true)}
              className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-rose-300/20"
            >
              Try again
            </button>
          </div>
        )}

        {!connection ? (
          <SignalPanel className="signal-connect-grid">
            <div className="flex flex-col justify-center gap-5 p-6 sm:p-9 lg:p-10">
              <div className="space-y-3">
                <h2 className="signal-display text-[clamp(2.4rem,5vw,3.6rem)] text-[#F4EFF6]">
                  Connect your Instagram
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-[#B8B1C0]">
                  FreshDM listens for comments on your posts and reels, then sends the private reply you wrote. No password sharing, no browser automation.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleConnectInstagram} disabled={connecting} className="gap-2">
                  {connecting ? "Connecting…" : "Connect Instagram"}
                  {!connecting && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                </Button>
                <StatusChip tone="neutral">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Official Graph API
                </StatusChip>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-[#A49AAE]">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Your access token is encrypted before it reaches the database.
              </p>
            </div>
            <div className="signal-connect-visual">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="signal-connect-caption">
                  <span className="signal-connect-node">
                    <MessageSquare className="h-6 w-6" aria-hidden="true" />
                  </span>
                  Comment
                </div>
                <span className="signal-connect-line" />
                <motion.div
                  className="signal-connect-caption"
                  animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="signal-connect-node border-[#A24BE0]/40 bg-[#7A22B0]/20">
                    <Instagram className="h-7 w-7 text-[#D8B4FE]" aria-hidden="true" />
                  </span>
                  FreshDM
                </motion.div>
                <span className="signal-connect-line" />
                <div className="signal-connect-caption">
                  <span className="signal-connect-node">
                    <Send className="h-6 w-6" aria-hidden="true" />
                  </span>
                  Private DM
                </div>
              </div>
            </div>
          </SignalPanel>
        ) : (
          <>
            <div className="signal-panel signal-strip signal-strip--four" role="group" aria-label="Automation summary">
              <SignalCell label="Active rules" value={activeCount} hint="listening now" tone="violet" />
              <SignalCell label="Paused" value={pausedCount} hint="not responding" tone="white" />
              <SignalCell label="Comments captured" value={totalEvents} hint="across all rules" tone="pale" />
              <SignalCell label="Trigger words" value={uniqueKeywords} hint="unique across rules" tone="white" />
            </div>

            <SignalPanel>
              <SectionHeader
                icon={Instagram}
                title="Rule library"
                description="Select a rule to inspect its words, message, and current state."
                action={
                  <Segmented<ViewMode>
                    ariaLabel="Choose rule view"
                    value={viewMode}
                    onChange={setViewMode}
                    options={[
                      { value: "ledger", label: "Ledger" },
                      { value: "grid", label: "Grid" },
                    ]}
                  />
                }
              />
              <div className="signal-filter-bar">
                <div className="relative w-full max-w-md">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A49AAE]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search name, keyword, or message"
                    aria-label="Search auto-reply rules"
                    className="signal-input"
                  />
                </div>
                <div className="signal-toolbar">
                  <Segmented<StatusFilter>
                    ariaLabel="Filter rules by status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "all", label: "All" },
                      { value: "active", label: "Active" },
                      { value: "paused", label: "Paused" },
                    ]}
                  />
                  <span className="text-[11px] text-[#A49AAE]">
                    {filteredAutomations.length} of {automations.length}
                  </span>
                </div>
              </div>
            </SignalPanel>

            {automations.length === 0 ? (
              <SignalPanel>
                <EmptySignal
                  icon={Zap}
                  title="Create your first automatic reply"
                  description="Choose a post, add the words to look for, and write the message you want to send. It will run without you."
                  action={
                    <Link href="/instagram/create/new?step=1">
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Create your first reply
                      </Button>
                    </Link>
                  }
                />
              </SignalPanel>
            ) : filteredAutomations.length === 0 ? (
              <SignalPanel>
                <EmptySignal
                  icon={Search}
                  title="No rules match this view"
                  description="Try a different keyword, clear the search, or switch the status filter back to all."
                  action={
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  }
                />
              </SignalPanel>
            ) : viewMode === "ledger" ? (
              <SignalPanel>
                <div className="signal-rule-layout">
                  <div className="signal-rule-list signal-fade border-b border-white/[0.06] lg:border-b-0 lg:border-r" aria-label="Automation rules">
                    {filteredAutomations.map((automation) => {
                      const isSelected = selectedAutomation?.id === automation.id;
                      return (
                        <button
                          key={automation.id}
                          type="button"
                          onClick={() => selectAutomation(automation.id)}
                          aria-pressed={isSelected}
                          className={`signal-rule-button ${isSelected ? "is-active" : ""}`}
                        >
                          <span className="signal-thumb">
                            {automation.mediaThumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img loading="lazy" decoding="async" src={automation.mediaThumbnail} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="signal-thumb-placeholder">
                                <Instagram className="h-4 w-4" aria-hidden="true" />
                              </span>
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="truncate text-[12.5px] font-semibold text-[#F4EFF6]">{automation.name}</span>
                              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${automation.isActive ? "bg-emerald-400" : "bg-zinc-600"}`} />
                            </span>
                            <span className="mt-1 flex flex-wrap gap-1">
                              {automation.keywords.slice(0, 3).map((keyword) => (
                                <span key={keyword} className="signal-code">{keyword}</span>
                              ))}
                              {automation.keywords.length > 3 && (
                                <span className="self-center text-[10px] text-[#8F8797]">+{automation.keywords.length - 3}</span>
                              )}
                            </span>
                            <span className="mt-1.5 flex items-center justify-between gap-2 text-[10.5px] text-[#A49AAE]">
                              <span className="truncate">{triggerCategory(automation)}</span>
                              <span className="shrink-0 tabular-nums">{automation._count?.events || 0} comments</span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div ref={detailRef} className="signal-detail-body">
                    {selectedAutomation ? (
                      <>
                        <div className="signal-detail-hero">
                          <div className="signal-thumb h-16 w-14">
                            {selectedAutomation.mediaThumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img loading="lazy" decoding="async" src={selectedAutomation.mediaThumbnail} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="signal-thumb-placeholder">
                                <Video className="h-5 w-5" aria-hidden="true" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h2 className="signal-detail-title truncate">{selectedAutomation.name}</h2>
                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                  <StatusChip tone={selectedAutomation.isActive ? "success" : "neutral"}>
                                    <LiveDot tone={selectedAutomation.isActive ? "success" : "muted"} size="sm" />
                                    {selectedAutomation.isActive ? "Listening" : "Paused"}
                                  </StatusChip>
                                  <StatusChip tone="violet">{triggerCategory(selectedAutomation)}</StatusChip>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleActive(selectedAutomation)}
                                className={`signal-switch ${selectedAutomation.isActive ? "is-on" : "is-off"}`}
                                role="switch"
                                aria-checked={selectedAutomation.isActive}
                                aria-label={`${selectedAutomation.isActive ? "Pause" : "Activate"} ${selectedAutomation.name}`}
                              >
                                <span className="signal-switch-knob" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button type="button" onClick={() => openSimulator(selectedAutomation)} className="signal-action-link border-[#A24BE0]/30 bg-[#7A22B0]/14 text-[#D8B4FE]">
                            <Play className="h-3 w-3" aria-hidden="true" />
                            Preview reply
                          </button>
                          <Link href={`/instagram/create/${selectedAutomation.id}?step=1`} className="signal-action-link">
                            <Pencil className="h-3 w-3" aria-hidden="true" />
                            Edit rule
                          </Link>
                          <button type="button" onClick={() => handleDeleteAutomation(selectedAutomation.id)} className="signal-action-link is-danger">
                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                            Delete
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="signal-kv">
                            <span className="signal-label">Comments received</span>
                            <span className="text-lg font-semibold tabular-nums text-[#F4EFF6]">
                              {selectedAutomation._count?.events || 0}
                            </span>
                          </div>
                          <div className="signal-kv">
                            <span className="signal-label">Matching</span>
                            <span className="text-lg font-semibold text-[#F4EFF6]">
                              {matchModeLabel(selectedAutomation.matchMode)}
                            </span>
                          </div>
                        </div>

                        <div className="signal-kv">
                          <span className="signal-label">Words to look for</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedAutomation.keywords.map((keyword) => (
                              <span key={keyword} className="signal-code">{keyword}</span>
                            ))}
                          </div>
                        </div>

                        <div className="signal-kv">
                          <span className="signal-label">Private message</span>
                          <div className="signal-bubble">
                            {selectedAutomation.dmText}
                            {selectedAutomation.linkUrl && (
                              <div className="signal-bubble-link">
                                <span className="truncate">{selectedAutomation.linkLabel || "Tap to open"}</span>
                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedAutomation.publicReply && (
                          <div className="signal-kv">
                            <span className="signal-label">Public reply</span>
                            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-[12.5px] leading-relaxed text-[#D6CFDC]">
                              {selectedAutomation.publicReply}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-3 text-[10.5px] text-[#8F8797]">
                          <span>Created {formatDate(selectedAutomation.createdAt)}</span>
                          {selectedAutomation.captureEmail && (
                            <StatusChip tone="violet" className="normal-case">
                              Captures email
                            </StatusChip>
                          )}
                          {selectedAutomation.mediaCaption && (
                            <span className="truncate normal-case">· {selectedAutomation.mediaCaption}</span>
                          )}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </SignalPanel>
            ) : (
              <div className="signal-rule-grid">
                {filteredAutomations.map((automation) => (
                  <SignalPanel key={automation.id} className="flex flex-col">
                    <div className="signal-rule-card-head">
                      <div className="signal-thumb h-14 w-12">
                        {automation.mediaThumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img loading="lazy" decoding="async" src={automation.mediaThumbnail} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="signal-thumb-placeholder">
                            <Instagram className="h-4 w-4" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-[13px] font-semibold text-[#F4EFF6]">{automation.name}</h3>
                            <p className="mt-0.5 truncate text-[10.5px] text-[#A49AAE]">{triggerCategory(automation)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(automation)}
                            className={`signal-switch ${automation.isActive ? "is-on" : "is-off"}`}
                            role="switch"
                            aria-checked={automation.isActive}
                            aria-label={`${automation.isActive ? "Pause" : "Activate"} ${automation.name}`}
                          >
                            <span className="signal-switch-knob" />
                          </button>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {automation.keywords.slice(0, 3).map((keyword) => (
                            <span key={keyword} className="signal-code">{keyword}</span>
                          ))}
                          {automation.keywords.length > 3 && (
                            <span className="self-center text-[10px] text-[#8F8797]">+{automation.keywords.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="signal-rule-card-body flex-1">
                      <div className="flex items-center justify-between gap-3 text-[11px]">
                        <span className="text-[#A49AAE]">Comments received</span>
                        <span className="font-semibold tabular-nums text-[#F4EFF6]">{automation._count?.events || 0}</span>
                      </div>
                      <div className="signal-bubble line-clamp-3 text-[12px]">
                        {automation.dmText}
                      </div>
                      {automation.linkUrl && (
                        <div className="flex items-center gap-1.5 text-[10.5px] text-[#C084FC]">
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                          <span className="truncate">{automation.linkUrl}</span>
                        </div>
                      )}
                    </div>

                    <div className="signal-rule-card-foot">
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => openSimulator(automation)} className="signal-action-link" title="Preview reply">
                          <Play className="h-3 w-3" aria-hidden="true" />
                          Preview
                        </button>
                        <Link href={`/instagram/create/${automation.id}?step=1`} className="signal-action-link" title="Edit rule">
                          <Pencil className="h-3 w-3" aria-hidden="true" />
                        </Link>
                        <button type="button" onClick={() => handleDeleteAutomation(automation.id)} className="signal-action-link is-danger" title="Delete rule">
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(automation.id);
                          setViewMode("ledger");
                        }}
                        className="signal-action-link"
                      >
                        Details
                        <ChevronRight className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                  </SignalPanel>
                ))}
              </div>
            )}
          </>
        )}

        {showLoginModal && (
          <div className="signal-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="signal-modal"
              style={{ maxWidth: "28rem" }}
            >
              <div className="signal-modal-header">
                <div className="flex items-center gap-3">
                  <span className="signal-icon-chip">
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="login-modal-title" className="text-sm font-semibold text-[#F4EFF6]">
                      {sessionExpired ? "Your session has expired" : "Log in to connect Instagram"}
                    </h2>
                    <p className="text-[11px] text-[#A49AAE]">
                      {sessionExpired ? "Log in again to continue where you left off." : "One secure step before the official connect flow."}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowLoginModal(false)} className="signal-icon-button" aria-label="Close login dialog">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="signal-modal-body space-y-4">
                <p className="text-xs leading-relaxed text-[#B8B1C0]">
                  {sessionExpired
                    ? "Your session has ended. Sign in with Google again so FreshDM can continue with your Instagram connection."
                    : "Sign in with Google first so FreshDM can associate the Instagram connection with your creator account."}
                </p>
                <Button
                  onClick={handleGoogleSignInFromModal}
                  disabled={googleLoading}
                  className="h-11 w-full gap-2.5 bg-white text-black hover:bg-zinc-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  {googleLoading ? "Connecting with Google…" : "Continue with Google"}
                </Button>
                <p className="text-[10.5px] leading-relaxed text-[#8F8797]">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {simulatorAutomation && (
          <div className="signal-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="simulator-title">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="signal-modal"
            >
              <div className="signal-modal-header">
                <div className="flex items-center gap-3">
                  <span className="signal-icon-chip">
                    <Play className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="simulator-title" className="text-sm font-semibold text-[#F4EFF6]">
                      Try your reply
                    </h2>
                    <p className="text-[11px] text-[#A49AAE]">A safe preview for “{simulatorAutomation.name}”.</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSimulatorAutomation(null)} className="signal-icon-chip border-white/[0.08] bg-white/[0.03] text-[#B8B1C0]" aria-label="Close preview">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="signal-modal-body space-y-5">
                <div className="space-y-2">
                  <label htmlFor="simulator-comment" className="signal-label">
                    Test a follower comment
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="simulator-comment"
                      type="text"
                      value={simulatorComment}
                      onChange={(event) => setSimulatorComment(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") runSimulator();
                      }}
                      placeholder="e.g. please send me the link"
                      className="signal-input signal-input--plain sm:flex-1"
                    />
                    <Button type="button" onClick={runSimulator} className="h-10 shrink-0 gap-2 px-4">
                      {simulatorStatus === "running" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      Test comment
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10.5px] text-[#8F8797]">Try a trigger word:</span>
                    {simulatorAutomation.keywords.map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => setSimulatorComment(keyword)}
                        className="signal-code transition-colors hover:border-[#A24BE0]/45 hover:text-white"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="signal-phone-pair">
                  <div className="signal-phone">
                    <div className="signal-phone-bar">
                      <span className="font-semibold text-white">Comments</span>
                      <span>@{connection?.username || "creator"}</span>
                    </div>
                    <div className="signal-phone-comment">
                      <div className="flex items-start gap-2">
                        <span className="signal-avatar h-6 w-6 text-[9px]">F</span>
                        <div className="min-w-0 text-[11px] leading-relaxed">
                          <p className="font-semibold text-white">follower_user</p>
                          <p className="mt-0.5 text-zinc-300">{simulatorComment || simulatorAutomation.keywords[0] || "access"}</p>
                        </div>
                      </div>
                      {simulatorResult?.publicReplyWillSend && (
                        <motion.div
                          initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-start gap-2 pl-8"
                        >
                          <span className="signal-avatar h-5 w-5 text-[8px]">{(connection?.username || "Y")[0]}</span>
                          <div className="text-[10.5px] leading-relaxed">
                            <p className="flex items-center gap-1 font-semibold text-white">
                              @{connection?.username || "you"}
                              <span className="rounded bg-[#7A22B0]/30 px-1 text-[8px] text-[#D8B4FE]">Author</span>
                            </p>
                            <p className="mt-0.5 text-zinc-300">{simulatorAutomation.publicReply}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <div className="mt-auto p-2">
                      <div className="signal-phone-status">
                        <span>Comment status</span>
                        <span className={simulatorResult?.matched ? "font-semibold text-emerald-400" : "text-zinc-400"}>
                          {simulatorStatus === "running"
                            ? "Evaluating…"
                            : simulatorResult?.matched
                            ? "Matching word found"
                            : "No matching word"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="signal-phone">
                    <div className="signal-phone-bar">
                      <span className="flex items-center gap-1.5 font-semibold text-white">
                        <span className="signal-avatar h-4 w-4 text-[7px]">{(connection?.username || "Y")[0]}</span>
                        @{connection?.username || "creator"}
                      </span>
                      <span className="text-emerald-400">Active now</span>
                    </div>
                    <div className="signal-phone-chat">
                      {simulatorStatus === "running" ? (
                        <div className="signal-msg signal-msg-in flex items-center gap-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#A24BE0]" aria-hidden="true" />
                          Delivering private DM…
                        </div>
                      ) : simulatorResult?.dmWillSend ? (
                        <motion.div
                          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="signal-msg signal-msg-out"
                        >
                          <p className="whitespace-pre-wrap">{simulatorAutomation.dmText}</p>
                          {simulatorAutomation.linkUrl && (
                            <div className="signal-bubble-link mt-2 border-white/15 bg-white/10 text-white">
                              <span className="truncate">{simulatorAutomation.linkLabel || "Tap to open"}</span>
                              <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="mt-auto rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 text-center text-[11px] text-zinc-500">
                          {simulatorStatus === "idle"
                            ? "Run a test comment to preview the message."
                            : !simulatorAutomation.isActive
                            ? "This rule is paused. No message would be sent."
                            : "No trigger word found. No message would be sent."}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto p-2">
                      <div className="signal-phone-status">
                        <span>Message preview</span>
                        <span className={simulatorResult?.dmWillSend ? "font-semibold text-emerald-400" : "text-zinc-500"}>
                          {simulatorResult?.dmWillSend ? "Would send" : "Idle"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                  <p className="text-[10.5px] text-[#8F8797]">
                    This preview does not send a real message or touch your Instagram account.
                  </p>
                  <Button type="button" variant="secondary" onClick={() => setSimulatorAutomation(null)} className="h-9 gap-2">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </SignalPage>
    </AppLayout>
  );
}

export default function InstagramPage() {
  return (
    <React.Suspense fallback={<AppLayout><div className="signal-page"><PageSkeleton kind="replies" /></div></AppLayout>}>
      <InstagramContent />
    </React.Suspense>
  );
}
