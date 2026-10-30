"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Instagram, Check, Heart, X } from "lucide-react";

export function CreatorFollowModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const hasDismissed = localStorage.getItem("autodm_creator_followed");
      if (!hasDismissed) {
        // Small delay so user sees the page first
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage disabled or SSR
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem("autodm_creator_followed", "true");
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  const handleFollowClick = () => {
    window.open("https://instagram.com/codebyabi", "_blank", "noopener,noreferrer");
    handleDismiss();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-[420px] rounded-3xl bg-white border border-[#D5EAE0] p-7 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#F4FBF7] text-[#527060] hover:text-[#11271D] hover:bg-[#E8F7F0] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Creator Avatar with Verified Instagram Ring */}
        <div className="flex flex-col items-center pt-2">
          <div className="relative h-20 w-20 rounded-full p-[3px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-[#10B981] shadow-md shadow-[#059669]/20">
            <img
              src="/avatars/owner.png"
              alt="codebyabi"
              className="h-full w-full rounded-full object-cover border-2 border-white"
            />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#059669] text-white flex items-center justify-center border-2 border-white">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 font-bold text-[#11271D] text-lg">
            <span>Follow creator</span>
            <span className="text-[#059669]">@codebyabi</span>
          </div>
          <span className="text-xs text-[#527060] font-medium">Developer &amp; Creator</span>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-[13px] text-[#3B5D4D] leading-relaxed px-2">
          AutoDM Followers is 100% free and open-source. Support fellow creator <strong>@codebyabi</strong> on Instagram for free automation tips, updates, and templates!
        </p>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleFollowClick}
            className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-inter text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#059669]/25 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <Instagram className="h-4 w-4" />
            <span>Follow @codebyabi on Instagram</span>
          </button>

          <button
            onClick={handleDismiss}
            className="w-full h-10 rounded-xl bg-[#F4FBF7] hover:bg-[#E8F7F0] border border-[#D5EAE0] text-[#059669] font-inter text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Already Followed</span>
          </button>

          <button
            onClick={handleDismiss}
            className="text-[11px] text-[#6B8A7A] hover:text-[#11271D] font-medium underline underline-offset-2 transition-colors cursor-pointer block mx-auto pt-1"
          >
            I will follow later
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatorFollowModal;
