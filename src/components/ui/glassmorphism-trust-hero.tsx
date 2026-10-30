"use client";

import React from "react";
import Link from "next/link";
import HeroInstagramAutomation from "@/components/ui/hero-instagram-automation";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[780px] lg:h-screen lg:min-h-[820px] overflow-hidden bg-[#F6FAF7] text-[#11271D] select-none">
      
      {/* Background Ambience with Soft Masking */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: "linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 35%, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.04) 45%, transparent 75%)",
          }}
        />
      </div>

      {/* Hero Bottom Connection Gradient */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 bottom-0 h-32 pointer-events-none z-0 bg-gradient-to-b from-transparent to-[#F6FAF7]"
      />
      {/* Visually-hidden SEO <h1> */}
      <h1 className="sr-only">Reply to followers, even when you&apos;re offline</h1>

      {/* =========================================================
          DESKTOP VIEWPORT (lg+): Balanced 3-Column Symmetrical Layout
      ========================================================= */}
      <div className="hidden lg:block relative z-10 w-full h-full max-w-[1440px] mx-auto">
        
        {/* --- LAYER 1: WATERMARK --- */}
        <div
          aria-hidden="true"
          className="absolute top-[13%] left-1/2 -translate-x-1/2 z-1 pointer-events-none select-none text-center w-full px-8 font-anton uppercase leading-[0.9] text-transparent bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(5,150,105,0.14) 0%, rgba(5,150,105,0.03) 75%, transparent 100%)",
            fontSize: "clamp(120px, 18.5vw, 290px)",
            letterSpacing: "-0.015em",
          }}
        >
          AUTODM
        </div>

        {/* --- LAYER 2: CENTER PRODUCT --- */}
        <div className="absolute left-1/2 top-[15%] -translate-x-1/2 z-3 origin-center pointer-events-auto flex items-center justify-center">
          <HeroInstagramAutomation />
        </div>

        {/* --- A & D. LEFT HEADLINE + SUPPORTING COPY + CTAs --- */}
        <div className="absolute left-[4.5%] top-[26%] z-2 max-w-[32%] xl:max-w-[31%] pointer-events-auto flex flex-col items-start text-left">
          
          {/* Left Headline */}
          <div
            className="font-inter font-bold text-[#11271D] tracking-[-0.025em] leading-[1.02] text-left"
            style={{
              fontSize: "clamp(44px, 4.4vw, 84px)",
            }}
          >
            <span className="block whitespace-nowrap">Reply to</span>
            <span className="block whitespace-nowrap">Followers,</span>
          </div>

          {/* Supporting Copy */}
          <p className="mt-[28px] font-inter text-[17px] leading-[1.6] text-[#3F6250] max-w-[440px]">
            AutoDM automatically replies to Instagram comments and DMs with human speed, converting followers into engaged fans when you&apos;re away.
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
              href="#how-to-connect"
              className="inline-flex items-center gap-2 font-inter text-[14px] text-[#3F6250] hover:text-[#059669] transition-colors duration-150 whitespace-nowrap shrink-0 font-semibold"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0" aria-hidden="true">
                <polygon points="3 2 10 6 3 10" fill="currentColor" />
              </svg>
              <span>How it connects</span>
            </a>
          </div>

        </div>

        {/* --- B. RIGHT HEADLINE --- */}
        <div className="absolute left-[65.5%] 2xl:left-[66.5%] right-[4.5%] top-[43%] z-4 max-w-[31%] pointer-events-auto text-left">
          <div
            className="font-inter font-bold tracking-[-0.025em] leading-[1.02] text-left"
            style={{
              fontSize: "clamp(46px, 4.8vw, 90px)",
            }}
          >
            <span className="block text-[#059669] whitespace-nowrap">Even when</span>
            <span className="block text-[#11271D] whitespace-nowrap">you&apos;re offline.</span>
          </div>
        </div>

        {/* --- E. TESTIMONIAL GLASS CARD --- */}
        <div className="absolute left-[4.5%] bottom-[10%] z-20 pointer-events-auto flex items-center gap-[16px] px-[20px] py-[16px] rounded-[20px] bg-white/95 border border-[#D5EAE0] shadow-xl shadow-[#059669]/5">
          {/* Overlapping Avatars */}
          <div className="flex -space-x-[10px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[36px] h-[36px] rounded-full ring-2 ring-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[36px] h-[36px] rounded-full ring-2 ring-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
              alt="creator"
              className="inline-block w-[36px] h-[36px] rounded-full ring-2 ring-white object-cover"
            />
          </div>

          {/* Divider */}
          <div className="w-[1px] h-[32px] bg-[#D5EAE0]" />

          {/* Rating & Copy */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-[6px]">
              <div className="flex items-center gap-[1px]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#EAB308" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-inter text-[15px] font-bold text-[#11271D] leading-none">
                5.0
              </span>
            </div>
            <span className="font-inter text-[12px] font-medium text-[#527060] mt-[3px] leading-tight">
              Trusted by active creators
            </span>
          </div>
        </div>

        {/* --- LAYER 5: BOTTOM-RIGHT VERIFIED META GRAPH API GLASS CARD --- */}
        <div className="absolute right-[4.5%] bottom-[5%] z-20 w-[240px] p-[16px] rounded-[20px] bg-white/95 border border-[#D5EAE0] pointer-events-auto shadow-xl shadow-[#059669]/5">
          <div className="font-bebas text-[18px] uppercase text-[#059669] leading-[1.05] tracking-[0.02em]">
            OFFICIAL META GRAPH API
          </div>
          <p className="mt-1 font-inter text-[11px] leading-normal text-[#527060]">
            Average comment-to-DM trigger under 2.4 seconds.
          </p>
          <div className="mt-3 pt-2 border-t border-[#D5EAE0] flex items-center justify-between">
            <span className="font-inter text-[11px] font-semibold text-[#11271D]">100% Policy Safe</span>
            <div className="w-[22px] h-[22px] rounded-full bg-[#E8F7F0] text-[#059669] flex items-center justify-center font-bold text-[11px]">
              ✓
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
              "linear-gradient(to bottom, rgba(5,150,105,0.12) 0%, rgba(5,150,105,0.02) 75%, transparent 100%)",
            fontSize: "clamp(64px, 16vw, 130px)",
            letterSpacing: "-0.01em",
          }}
        >
          AUTODM
        </div>

        {/* Center Phone Mockup */}
        <div className="relative z-10 my-8 scale-90 sm:scale-100 pointer-events-auto flex items-center justify-center mx-auto">
          <HeroInstagramAutomation />
        </div>

        {/* Combined Centered Headline */}
        <h1
          className="relative z-10 font-inter font-bold tracking-[-0.025em] leading-[1.05] text-[#11271D] max-w-xl text-center"
          style={{
            fontSize: "clamp(36px, 5.5vw, 44px)",
          }}
        >
          Reply to Followers,{" "}
          <span className="text-[#059669]">Even when</span>{" "}
          <span className="text-[#11271D]">you&apos;re offline.</span>
        </h1>

        {/* Sub-headline */}
        <p className="relative z-10 mt-3 font-inter text-[15px] leading-relaxed text-[#3F6250] max-w-md">
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
            href="#how-to-connect"
            className="inline-flex items-center gap-2 font-inter text-[14px] text-[#3F6250] hover:text-[#059669] transition-colors whitespace-nowrap shrink-0 font-semibold"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <polygon points="3 2 10 6 3 10" fill="currentColor" />
            </svg>
            <span>How it connects</span>
          </a>
        </div>
      </div>
    </section>
  );
}
