"use client";

import React from "react";
import Link from "next/link";

interface SignUpButtonProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SignUpButton({
  href = "/login",
  children = "Sign up",
  className = "",
}: SignUpButtonProps) {
  return (
    <Link
      href={href}
      className={`styled-signup-btn group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/20 bg-white/[0.05] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md transition-all duration-300 hover:border-[#A855F7] hover:bg-[#A855F7] hover:text-black hover:shadow-[0_0_30px_rgba(168,85,247,0.45)] active:scale-[0.98] ${className}`}
    >
      <span>{children}</span>
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
      >
        <path
          clipRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
          fillRule="evenodd"
        />
      </svg>
    </Link>
  );
}

export default SignUpButton;
