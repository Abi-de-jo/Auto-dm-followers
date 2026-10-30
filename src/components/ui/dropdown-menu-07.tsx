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
          className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-[#D5EAE0] bg-white text-[#11271D] shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-[#059669]/60 hover:shadow-[0_0_12px_rgba(5,150,105,0.25)] focus:outline-none focus:ring-2 focus:ring-[#059669]/40 cursor-pointer"
        >
          <Avatar className="h-8 w-8 rounded-full">
            {user.image && <AvatarImage src={user.image} alt={displayName} />}
            <AvatarFallback className="bg-[#E8F7F0] text-[11px] font-bold text-[#059669]">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-2xl border border-[#D5EAE0] bg-white p-1.5 text-[#11271D] shadow-xl"
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <div className="flex flex-col space-y-0.5">
            <p className="text-xs font-bold text-[#11271D] tracking-tight truncate">
              {displayName}
            </p>
            {user.email && (
              <p className="text-[11px] font-normal text-[#527060] truncate font-mono">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-[#D5EAE0]" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#11271D] transition-all duration-150 hover:bg-[#E8F7F0] hover:text-[#059669] cursor-pointer"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-[#059669]" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/account"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#11271D] transition-all duration-150 hover:bg-[#E8F7F0] hover:text-[#059669] cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-[#059669]" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-[#D5EAE0]" />

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
