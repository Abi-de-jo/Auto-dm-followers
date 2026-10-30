"use client";

import React from "react";
import Link from "next/link";
import HeroInstagramAutomation from "@/components/ui/hero-instagram-automation";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[780px] lg:h-screen lg:min-h-[820px] overflow-hidden bg-[#0A080C] select-none">
      
      {/* =========================================================
          BACKGROUND LAYERS
          1) Solid #0A080C base
          2) Soft charcoal spotlight centered behind the phone (#1C181D)
          3) Subtle vignette
      ========================================================= */}
      {/* Background Ambience with Soft Masking */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 45% 50% at 50% 45%, #1C181D 0%, rgba(28,24,29,0.6) 35%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      </div>

      {/* Hero Bottom Connection Gradient (at the very bottom border, behind all content) */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 bottom-0 h-32 pointer-events-none z-0 bg-gradient-to-b from-transparent to-[#0A080C]"
      />
      {/* Visually-hidden SEO <h1> */}
      <h1 className="sr-only">Reply to customers, even when you&apos;re offline</h1>

      {/* =========================================================
          DESKTOP VIEWPORT (lg+): Balanced 3-Column Symmetrical Layout
      ========================================================= */}
      <div className="hidden lg:block relative z-10 w-full h-full max-w-[1440px] mx-auto">
        
        {/* --- LAYER 1: WATERMARK (Behind everything, z:1, M completely visible) --- */}
        <div
          aria-hidden="true"
          className="absolute top-[13%] left-1/2 -translate-x-1/2 z-1 pointer-events-none select-none text-center w-full px-8 font-anton uppercase leading-[0.9] text-transparent bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #5C595E 0%, #2A272C 70%, transparent 100%)",
            fontSize: "clamp(120px, 18.5vw, 290px)",
            letterSpacing: "-0.015em",
          }}
        >
          FRESHDM
        </div>

        {/* --- LAYER 2: CENTER PRODUCT = STATIC OLED BLACK PHONE (z:3) --- */}
        <div className="absolute left-1/2 top-[15%] -translate-x-1/2 z-3 origin-center pointer-events-auto flex items-center justify-center">
          <HeroInstagramAutomation />
        </div>

        {/* --- A & D. LEFT HEADLINE + SUPPORTING COPY + CTAs (z:2) --- */}
        <div className="absolute left-[4.5%] top-[26%] z-2 max-w-[32%] xl:max-w-[31%] pointer-events-auto flex flex-col items-start text-left">
          
          {/* Left Headline (2 lines, Inter 700) */}
          <div
            className="font-inter font-bold text-[#F2F0F4] tracking-[-0.025em] leading-[1.02] text-left"
            style={{
              fontSize: "clamp(44px, 4.4vw, 84px)",
              textShadow: "0 2px 28px rgba(0,0,0,0.55)",
            }}
          >
            <span className="block whitespace-nowrap">Reply to</span>
            <span className="block whitespace-nowrap">Customers,</span>
          </div>

          {/* Supporting Copy */}
          <p className="mt-[28px] font-inter text-[17px] leading-[1.6] text-[#8C8890] max-w-[440px]">
            AutoDM automatically replies to Instagram comments and DMs with human speed, converting followers and story replies into fans when you&apos;re away.
          </p>

          {/* CTA Row */}
          <div className="mt-[32px] flex items-center gap-[20px] whitespace-nowrap">
            <Link
              href="/login"
              className="boton-elegante whitespace-nowrap shrink-0"
            >
              Start automating
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 font-inter text-[14px] text-[#8C8890] hover:text-[#E6E3E8] transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0" aria-hidden="true">
                <polygon points="3 2 10 6 3 10" fill="currentColor" />
              </svg>
              <span>See how it works</span>
            </a>
          </div>

        </div>

        {/* --- B. RIGHT HEADLINE (Shifted right + down, staggered) --- */}
        <div className="absolute left-[65.5%] 2xl:left-[66.5%] right-[4.5%] top-[43%] z-4 max-w-[31%] pointer-events-auto text-left">
          <div
            className="font-inter font-bold tracking-[-0.025em] leading-[1.02] text-left"
            style={{
              fontSize: "clamp(46px, 4.8vw, 90px)",
              textShadow: "0 2px 28px rgba(0,0,0,0.55)",
            }}
          >
            <span className="block text-[#10B981] whitespace-nowrap">Even when</span>
            <span className="block text-[#F2F0F4] whitespace-nowrap">you&apos;re offline.</span>
          </div>
        </div>

        {/* --- E. TESTIMONIAL GLASS CARD (bottom-left, crisp un-dimmed glass) --- */}
        <div className="absolute left-[4.5%] bottom-[10%] z-20 pointer-events-auto flex items-center gap-[16px] px-[20px] py-[16px] rounded-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] shadow-2xl">
          {/* Overlapping Avatars */}
          <div className="flex -space-x-[10px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[36px] h-[36px] rounded-full ring-2 ring-[#0A080C] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[36px] h-[36px] rounded-full ring-2 ring-[#0A080C] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[36px] h-[36px] rounded-full ring-2 ring-[#0A080C] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[36px] h-[36px] rounded-full ring-2 ring-[#0A080C] object-cover"
            />
          </div>

          {/* Divider */}
          <div className="w-[1px] h-[32px] bg-[rgba(255,255,255,0.12)]" />

          {/* Rating & Copy */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-[6px]">
              <div className="flex items-center gap-[1px]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#E0B04A" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-inter text-[15px] font-semibold text-[#E6E3E8] leading-none">
                5.0
              </span>
            </div>
            <span className="font-inter text-[13px] text-[#8C8890] mt-[3px] leading-tight">
              Trusted by 10,000+ creators
            </span>
          </div>
        </div>

        {/* --- LAYER 5: BOTTOM-RIGHT VERIFIED META GRAPH API GLASS CARD (crisp un-dimmed glass) --- */}
        <div className="absolute right-[4.5%] bottom-[5%] z-20 w-[240px] p-[16px] rounded-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] pointer-events-auto shadow-2xl">
          <div className="font-bebas text-[18px] uppercase text-[#E6E3E8] leading-[1.05] tracking-[0.02em]">
            VERIFIED META GRAPH API
          </div>
          <p className="mt-1 font-inter text-[11px] leading-normal text-[#8C8890]">
            Average comment-to-DM trigger under 2.4 seconds.
          </p>
          <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <span className="font-inter text-[11px] text-[#E6E3E8]">See more info</span>
            <div className="w-[22px] h-[22px] rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#E6E3E8]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================
          RESPONSIVE VIEWPORT (<= 1024px): Mobile & Tablet Stacked Layout
      ========================================================= */}
      <div className="lg:hidden relative w-full px-6 pt-28 pb-16 flex flex-col items-center text-center z-10">
        
        {/* Watermark in background */}
        <div
          aria-hidden="true"
          className="absolute top-10 left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none text-center w-full px-4 font-anton uppercase leading-[0.9] text-transparent bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #5C595E 0%, #2A272C 70%, transparent 100%)",
            fontSize: "clamp(64px, 16vw, 130px)",
            letterSpacing: "-0.01em",
          }}
        >
          FRESHDM
        </div>

        {/* Static Centered OLED Black Phone Mockup */}
        <div className="relative z-10 my-8 scale-90 sm:scale-100 pointer-events-auto flex items-center justify-center mx-auto">
          <HeroInstagramAutomation />
        </div>

        {/* Combined Centered Headline */}
        <h1
          className="relative z-10 font-inter font-bold tracking-[-0.025em] leading-[1.05] text-[#F2F0F4] max-w-xl text-center"
          style={{
            fontSize: "clamp(36px, 5.5vw, 44px)",
            textShadow: "0 2px 28px rgba(0,0,0,0.55)",
          }}
        >
          Reply to Followers,{" "}
          <span className="text-[#10B981]">Even when</span>{" "}
          <span className="text-[#F2F0F4]">you&apos;re offline.</span>
        </h1>

        {/* Sub-headline */}
        <p className="relative z-10 mt-3 font-inter text-[15px] leading-relaxed text-[#8C8890] max-w-md">
          AutoDM automatically replies to Instagram comments and DMs with human speed, converting followers into active conversations while you&apos;re away.
        </p>

        {/* Action Buttons Row */}
        <div className="relative z-10 mt-6 flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 whitespace-nowrap">
          <Link
            href="/login"
            className="boton-elegante whitespace-nowrap shrink-0"
          >
            Start automating
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 font-inter text-[14px] text-[#8C8890] hover:text-[#E6E3E8] transition-colors whitespace-nowrap shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <polygon points="3 2 10 6 3 10" fill="currentColor" />
            </svg>
            <span>See how it works</span>
          </a>
        </div>

        {/* Testimonial Glass Card (Mobile, static, centered, crisp) */}
        <div className="relative z-20 mt-8 flex items-center gap-[14px] px-[18px] py-[14px] rounded-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] shadow-xl">
          <div className="flex -space-x-[8px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[32px] h-[32px] rounded-full ring-2 ring-[#0A080C] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[32px] h-[32px] rounded-full ring-2 ring-[#0A080C] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[32px] h-[32px] rounded-full ring-2 ring-[#0A080C] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[32px] h-[32px] rounded-full ring-2 ring-[#0A080C] object-cover"
            />
          </div>

          <div className="w-[1px] h-[28px] bg-[rgba(255,255,255,0.12)]" />

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-[5px]">
              <div className="flex items-center gap-[1px]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 20 20" fill="#E0B04A" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-inter text-[14px] font-semibold text-[#E6E3E8] leading-none">
                5.0
              </span>
            </div>
            <span className="font-inter text-[11px] text-[#8C8890] mt-[2px] leading-tight">
              Trusted by 10,000+ creators
            </span>
          </div>
        </div>

        {/* Verified Meta Graph API Glass Card (Mobile, static, centered, crisp) */}
        <div className="relative z-20 mt-6 w-[240px] p-[16px] rounded-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.15)] text-left">
          <div className="font-bebas text-[18px] uppercase text-[#E6E3E8] leading-[1.05] tracking-[0.02em]">
            VERIFIED META GRAPH API
          </div>
          <p className="mt-1 font-inter text-[11px] leading-normal text-[#8C8890]">
            Average comment-to-DM trigger under 2.4 seconds.
          </p>
          <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <span className="font-inter text-[11px] text-[#E6E3E8]">See more info</span>
            <div className="w-[22px] h-[22px] rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#E6E3E8]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
