"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Instagram,
  BarChart3,
  Mail,
  Zap,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  MoreVertical,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, logoutAndRedirect } from "@/lib/auth-store";
import FreshDMLogo from "@/components/ui/freshdm-logo";
import { LiveDot } from "@/components/workspace/signal-ui";
import "@/app/workspace.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", shortLabel: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", shortLabel: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Auto-replies", shortLabel: "Replies", href: "/instagram", icon: Instagram },
  { label: "Leads", shortLabel: "Leads", href: "/leads", icon: Mail, isLeads: true },
  { label: "Stories", shortLabel: "Stories", href: "/stories", icon: Zap },
];

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const zustandUser = useAuthStore((s) => s.user);
  const [currentUser, setCurrentUser] = useState<{
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null>(null);
  const [leadCount, setLeadCount] = useState<number>(0);
  const [connection, setConnection] = useState<{ username: string; status: string } | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.total === "number") setLeadCount(data.total);
      })
      .catch(() => {});

    fetch("/api/instagram/connection")
      .then((res) => res.json())
      .then((data) => {
        if (data?.connection) {
          setConnection({
            username: data.connection.username,
            status: data.connection.status,
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user);
    } else {
      fetch("/api/user")
        .then((r) => r.json())
        .then((d) => {
          if (d?.user) {
            setCurrentUser(d.user);
            useAuthStore.getState().setUser(d.user);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  const activeUser = zustandUser || currentUser || session?.user;
  const isConnected = Boolean(connection && connection.status === "active");
  const activeHref = useMemo(() => {
    if (pathname.startsWith("/instagram")) return "/instagram";
    if (pathname.startsWith("/analytics")) return "/analytics";
    if (pathname.startsWith("/leads")) return "/leads";
    if (pathname.startsWith("/stories")) return "/stories";
    return "/dashboard";
  }, [pathname]);

  return (
    <div className="workspace flex min-h-screen flex-col bg-[#080C0A] font-sans text-[#E6EAE7] selection:bg-[#10B981] selection:text-black md:flex-row">
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[#10B981] focus:p-3 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.075] bg-[#080F0B]/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <Link href="/dashboard" className="flex items-center" aria-label="AutoDM dashboard">
          <FreshDMLogo className="origin-left scale-90" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-[#B8B1C0] sm:flex">
            <LiveDot tone={isConnected ? "success" : "muted"} size="sm" />
            {isConnected ? "Engine live" : "Not connected"}
          </div>
          <Link
            href="/account"
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0C1813] text-xs font-bold text-[#A7F3D0]"
            aria-label="Open account settings"
          >
            {activeUser?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeUser.image} alt="" className="h-full w-full object-cover" />
            ) : (
              (activeUser?.name || "U")[0].toUpperCase()
            )}
          </Link>
        </div>
      </header>

      <aside className="sticky top-0 z-20 hidden h-screen w-[17rem] shrink-0 flex-col justify-between border-r border-white/[0.075] bg-[#0C0A0F] px-4 py-5 md:flex">
        <div className="space-y-6">
          <Link href="/dashboard" className="group flex items-center px-1.5 py-1" aria-label="AutoDM dashboard">
            <FreshDMLogo className="transition-transform duration-300 group-hover:scale-[1.02]" />
          </Link>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <LiveDot tone={isConnected ? "success" : "muted"} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-[#F4EFF6]">
                  {isConnected ? `@${connection?.username}` : "Engine offline"}
                </p>
                <p className="truncate text-[10.5px] text-[#A49AAE]">
                  {isConnected ? "Listening for comments" : "Connect Instagram to start"}
                </p>
              </div>
            </div>
          </div>

          <nav aria-label="Workspace navigation" className="space-y-1">
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8F8797]">
              Workspace
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-colors ${
                    isActive ? "text-white" : "text-[#B8B1C0] hover:bg-white/[0.035] hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="workspace-nav-active"
                      className="absolute inset-0 rounded-xl border border-[#10B981]/25 bg-gradient-to-r from-[#10B981]/24 to-[#10B981]/8"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? "text-[#A7F3D0]" : "text-[#8F9790] group-hover:text-[#A7F3D0]"
                      }`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </span>
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.isLeads && leadCount > 0 && (
                      <span className="rounded-full border border-[#10B981]/25 bg-[#10B981]/18 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[#A7F3D0]">
                        {leadCount}
                      </span>
                    )}
                    {item.href === "/instagram" && isConnected && <LiveDot tone="success" size="sm" />}
                  </span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/instagram/create/new?step=1"
            className="group flex items-center justify-between rounded-xl border border-[#10B981]/25 bg-gradient-to-r from-[#10B981]/22 to-[#10B981]/8 px-3 py-2.5 text-[12.5px] font-semibold text-[#F0FDF4] transition-colors hover:border-[#10B981]/45 hover:from-[#10B981]/30"
          >
            <span className="flex items-center gap-2.5">
              <Plus className="h-4 w-4 text-[#A7F3D0]" aria-hidden="true" />
              New auto-reply
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#84938A] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#A7F3D0]" aria-hidden="true" />
          </Link>
        </div>

        <div className="border-t border-white/[0.075] pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group flex w-full items-center justify-between rounded-xl border border-white/[0.075] bg-white/[0.02] p-2 text-left transition-colors hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#10B981]/25 bg-[#0C1813] text-xs font-bold text-[#A7F3D0]">
                    {activeUser?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={activeUser.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      (activeUser?.name || "U")[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold text-[#F4EFF6] group-hover:text-white">
                      {activeUser?.name || "Creator"}
                    </p>
                    <p className="truncate text-[10.5px] text-[#A49AAE]">
                      {activeUser?.email || "Account settings"}
                    </p>
                  </div>
                </div>
                <MoreVertical className="h-4 w-4 shrink-0 text-[#8F8797] group-hover:text-white" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="end" className="w-60 border-white/[0.09] bg-[#0E0C12] text-[#E6E3E8]">
              <DropdownMenuLabel className="border-b border-white/[0.075] pb-2 font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="truncate text-xs font-semibold text-white">{activeUser?.name || "Creator account"}</p>
                  <p className="truncate text-[10px] text-[#A49AAE]">{activeUser?.email || ""}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuGroup className="space-y-0.5 pt-1">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full">
                    <Settings className="h-3.5 w-3.5 text-[#A49AAE]" aria-hidden="true" />
                    <span>Account settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instagram" className="w-full">
                    <Instagram className="h-3.5 w-3.5 text-[#A49AAE]" aria-hidden="true" />
                    <span>Auto-reply rules</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/terms" className="w-full">
                    <HelpCircle className="h-3.5 w-3.5 text-[#A49AAE]" aria-hidden="true" />
                    <span>Help &amp; guidelines</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-white/[0.075]" />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => logoutAndRedirect("/")}
                className="cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main
        id="page-content"
        tabIndex={-1}
        className="min-w-0 flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0"
      >
        {children}
      </main>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/[0.09] bg-[#080F0B]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        {NAV_ITEMS.map(({ href, shortLabel, icon: Icon, isLeads }) => {
          const isActive = activeHref === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[10.5px] font-medium transition-colors ${
                isActive ? "text-[#A7F3D0]" : "text-[#84938A]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-active"
                  className="absolute inset-x-2 inset-y-1.5 rounded-xl border border-[#10B981]/20 bg-[#10B981]/12"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative z-10">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {isLeads && leadCount > 0 && (
                  <span className="absolute -right-2.5 -top-1 min-w-4 rounded-full bg-[#10B981] px-1 text-center text-[9px] font-bold leading-4 text-black">
                    {leadCount > 99 ? "99+" : leadCount}
                  </span>
                )}
              </span>
              <span className="relative z-10">{shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default AppLayout;
