"use client";

import React from "react";

export function FreshDMLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Typography: Auto (Solid White) + DM (Solid Emerald) */}
      <div className="flex items-baseline font-sans font-black tracking-tight text-[26px] sm:text-[28px] leading-none">
        <span className="text-white">Auto</span>
        <span className="text-[#10B981]">DM</span>
      </div>
      <span className="rounded-md bg-[#059669]/20 border border-[#10B981]/30 px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#34D399]">
        Followers
      </span>
    </div>
  );
}

export default FreshDMLogo;
