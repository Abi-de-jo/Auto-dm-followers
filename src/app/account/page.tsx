"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import { PageSkeleton } from "@/components/PageSkeleton";
import { PageLoadError } from "@/components/PageLoadError";
import { SessionExpired } from "@/components/SessionExpired";
import { useAuthStore, logoutAndRedirect } from "@/lib/auth-store";
import {
  User as UserIcon,
  Instagram,
  LogOut,
  Trash2,
  ShieldCheck,
  Unlink,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptySignal,
  LiveDot,
  MetaItem,
  SectionHeader,
  SignalHeader,
  SignalPage,
  SignalPanel,
  StatusChip,
} from "@/components/workspace/signal-ui";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  connections: Array<{
    id: string;
    username: string;
    avatar: string | null;
    status: string;
    tokenExpiresAt: string | null;
    createdAt: string;
  }>;
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [authExpired, setAuthExpired] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setLoadError(false);
    setAuthExpired(false);
    try {
      const res = await fetch("/api/user");
      if (res.status === 401) {
        setAuthExpired(true);
        setLoadError(true);
        return;
      }
      if (!res.ok) {
        setLoadError(true);
        return;
      }
      const data = (await res.json()) as { user: UserProfile };
      if (data?.user) {
        setProfile(data.user);
        useAuthStore.getState().setUser(data.user);
      } else {
        setAuthExpired(true);
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect your Instagram? Your automatic replies will stop working until you connect it again."
      )
    ) {
      return;
    }

    setDisconnecting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/instagram/disconnect", { method: "POST" });
      if (res.ok) {
        setMessage({
          type: "success",
          text: "Your Instagram account has been safely disconnected.",
        });
        await fetchProfile();
      } else {
        setMessage({ type: "error", text: "Could not disconnect Instagram. Please try again." });
      }
    } finally {
      setDisconnecting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure? This will permanently delete your account, saved links, and all automatic replies. You cannot undo this."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (res.ok) {
        await logoutAndRedirect("/");
      } else {
        setDeleting(false);
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong while deleting your account. Please try again." });
      setDeleting(false);
    }
  };

  const displayName = profile?.name || (profile?.email ? profile.email.split("@")[0] : "Creator");
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  if (loading && !profile) return <AppLayout><div className="signal-page"><PageSkeleton kind="overview" /></div></AppLayout>;
  if (authExpired && !profile) return <AppLayout><div className="signal-page"><SessionExpired /></div></AppLayout>;
  if (loadError && !profile) return <AppLayout><div className="signal-page"><PageLoadError onRetry={fetchProfile} /></div></AppLayout>;

  return (
    <AppLayout>
      <SignalPage>
        <div className="mx-auto w-full max-w-5xl space-y-5">
          <SignalHeader
            title="Profile & settings"
            description="Manage your profile, connected Instagram account, and privacy."
            badge={
              <StatusChip tone="success">
                <LiveDot tone="success" size="sm" />
                Active & signed in
              </StatusChip>
            }
            actions={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => logoutAndRedirect("/")}
                className="h-9 gap-2 px-3.5"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Log out
              </Button>
            }
            meta={
              <>
                <MetaItem label="Account" value={displayName} />
                <MetaItem label="Email" value={profile?.email || "No email"} />
                <MetaItem label="Connections" value={String(profile?.connections?.length || 0)} tone="violet" />
                <MetaItem
                  label="Joined"
                  value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
                />
              </>
            }
          />

          {authExpired && <SessionExpired />}
          {loadError && !authExpired && <PageLoadError onRetry={fetchProfile} />}

          {message && (
            <div
              role={message.type === "error" ? "alert" : "status"}
              className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${
                message.type === "success"
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-400/20 bg-rose-400/10 text-rose-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-300" aria-hidden="true" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <SignalPanel>
            <SectionHeader
              icon={UserIcon}
              title="Profile"
              description="The identity attached to your workspace and billing."
              action={<StatusChip tone="success">Verified</StatusChip>}
            />
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className="signal-avatar overflow-hidden text-lg font-semibold"
                  style={{ width: "4rem", height: "4rem" }}
                >
                  {profile?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.image}
                      alt={displayName}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-[#F4EFF6]">{displayName}</h2>
                  <p className="truncate text-sm text-[#B8B1C0]">{profile?.email || "No email"}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#8F8797]">
                    Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="signal-label">Status</span>
                <StatusChip tone="success">
                  <LiveDot tone="success" size="sm" />
                  Active
                </StatusChip>
              </div>
            </div>
          </SignalPanel>

          <SignalPanel>
            <SectionHeader
              icon={Instagram}
              title="Connected Instagram account"
              description="The account that automatically sends messages when people comment on your posts."
              action={<StatusChip tone="violet">{profile?.connections?.length || 0} connected</StatusChip>}
            />

            {loading ? (
              <div className="p-6 text-center text-xs text-[#A49AAE]">Checking your Instagram connection…</div>
            ) : !profile?.connections || profile.connections.length === 0 ? (
              <EmptySignal
                icon={Instagram}
                title="No Instagram account connected"
                description="Connect your creator account to turn on automatic replies. FreshDM never asks for your password."
                action={
                  <Link href="/instagram">
                    <Button size="sm" className="gap-2">
                      <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
                      Connect Instagram
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="divide-y divide-white/[0.055]">
                {profile.connections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="signal-avatar overflow-hidden" style={{ width: "2.75rem", height: "2.75rem" }}>
                        {connection.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={connection.avatar}
                            alt={connection.username}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Instagram className="h-4 w-4" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold text-[#F4EFF6]">@{connection.username}</span>
                          <StatusChip tone="success">Connected</StatusChip>
                        </div>
                        <p className="mt-1 text-xs text-[#A49AAE]">Ready to send automatic direct messages</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link href="/instagram">
                        <Button variant="secondary" size="sm" className="gap-1.5">
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          Settings
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDisconnect}
                        disabled={disconnecting}
                        className="gap-1.5"
                      >
                        <Unlink className="h-3.5 w-3.5" aria-hidden="true" />
                        {disconnecting ? "Disconnecting…" : "Disconnect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SignalPanel>

          <SignalPanel>
            <SectionHeader
              icon={ShieldCheck}
              title="Security & privacy"
              description="How your account and Instagram connection stay protected."
            />
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              <div className="signal-insight">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-[#C084FC]" aria-hidden="true" />
                  <p className="signal-insight-title">Secure storage</p>
                </div>
                <p className="signal-insight-copy">
                  Your Instagram connection keys are encrypted at rest so no one else can read them.
                </p>
              </div>
              <div className="signal-insight">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                  <p className="signal-insight-title">Official Meta verification</p>
                </div>
                <p className="signal-insight-copy">
                  Every comment and message is verified directly through Meta to prevent spam and fake activity.
                </p>
              </div>
            </div>
          </SignalPanel>

          <SignalPanel className="signal-panel--danger">
            <SectionHeader
              icon={Trash2}
              title="Delete account"
              description="Permanently remove your account and all your data."
            />
            <div className="space-y-4 p-5">
              <p className="max-w-2xl text-xs leading-relaxed text-[#B8B1C0]">
                This will permanently delete your account, disconnected Instagram links, custom reply flows, and message history. This cannot be undone.
              </p>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="gap-2"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {deleting ? "Deleting account…" : "Delete account"}
              </Button>
            </div>
          </SignalPanel>
        </div>
      </SignalPage>
    </AppLayout>
  );
}
