"use client";

import Link from "next/link";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAndRedirect } from "@/lib/auth-store";

interface UserNavDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserNavDropdown({ user }: UserNavDropdownProps) {
  const displayName = user.name || (user.email ? user.email.split("@")[0] : "Account");
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-[#0E0C12]/80 text-[#E6E3E8] shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-200 hover:border-[#7A22B0]/60 hover:shadow-[0_0_16px_rgba(122,34,176,0.35)] focus:outline-none focus:ring-2 focus:ring-[#7A22B0]/40 cursor-pointer"
        >
          <Avatar className="h-8 w-8 rounded-full">
            {user.image && <AvatarImage src={user.image} alt={displayName} />}
            <AvatarFallback className="bg-gradient-to-br from-[#7A22B0]/40 to-[#4C1273]/30 text-[11px] font-semibold text-[#E6E3E8]">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-2xl border border-white/[0.08] bg-[#0E0C12]/90 p-1.5 text-[#E6E3E8] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <div className="flex flex-col space-y-0.5">
            <p className="text-xs font-semibold text-[#FFFFFF] tracking-tight truncate">
              {displayName}
            </p>
            {user.email && (
              <p className="text-[11px] font-normal text-[#8C8890] truncate font-mono">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-white/[0.06]" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#E6E3E8] transition-all duration-150 hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.06] focus:text-white cursor-pointer"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-[#A24BE0]" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/account"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#E6E3E8] transition-all duration-150 hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.06] focus:text-white cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-[#A24BE0]" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-white/[0.06]" />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => logoutAndRedirect("/")}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 transition-all duration-150 hover:bg-rose-500/10 hover:text-rose-300 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
