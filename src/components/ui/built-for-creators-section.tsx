"use client";

import React from "react";

export function BuiltForCreatorsSection() {
  return (
    <section className="relative w-full bg-[#0A080C] pt-[120px] pb-24 overflow-hidden select-none">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        
        {/* --- HEADER --- */}
        <div className="text-center flex flex-col items-center">
          <h2
            className="font-bebas tracking-[-0.04em] leading-none text-transparent bg-clip-text"
            style={{
              fontSize: "clamp(40px, 4.5vw, 64px)",
              backgroundImage: "linear-gradient(to bottom, #E6E3E8 60%, #9C98A0 100%)",
            }}
          >
            Built for creators.
          </h2>
          <div className="mt-[-6px] font-kaushan text-[#7A22B0] text-[30px] sm:text-[34px] leading-tight">
            Replying while you&apos;re offline
          </div>
        </div>

        {/* --- 3-COLUMN ROW (Desktop) --- */}
        <div className="mt-[72px] max-w-[1100px] mx-auto hidden lg:grid grid-cols-[auto_1fr_auto] gap-[48px] items-center">
          
          {/* --- LEFT TILES (2 vertical rounded tiles) --- */}
          <div className="flex items-center gap-[12px]">
            {/* Tile 1: Diagonal fine-line wave */}
            <div className="w-[128px] h-[295px] rounded-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] overflow-hidden relative shadow-lg">
              <div className="absolute inset-0 bg-[#0f0d11]" />
              <svg
                width="128"
                height="295"
                viewBox="0 0 128 295"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full opacity-60"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern id="diag-waves" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                    <path
                      d="M0 6 Q6 0, 12 6 T24 6 M0 18 Q6 12, 12 18 T24 18"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="1"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diag-waves)" />
              </svg>
            </div>

            {/* Tile 2: Offset small square grid */}
            <div className="w-[128px] h-[295px] rounded-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] overflow-hidden relative shadow-lg">
              <div className="absolute inset-0 bg-[#0f0d11]" />
              <svg
                width="128"
                height="295"
                viewBox="0 0 128 295"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full opacity-40"
              >
                <defs>
                  <pattern id="sq-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <rect x="2" y="2" width="6" height="6" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" fill="none" />
                    <rect x="10" y="10" width="6" height="6" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#sq-grid)" />
              </svg>
            </div>
          </div>

          {/* --- CENTER: 2x2 FEATURE GRID --- */}
          <div className="grid grid-cols-2 gap-x-[48px] gap-y-[36px] justify-center px-4">
            
            {/* Feature 1 */}
            <div className="max-w-[190px]">
              <h3 className="font-bebas text-[20px] uppercase text-[#E6E3E8] tracking-[0.02em] leading-tight">
                INSTANT TRIGGERS
              </h3>
              <p className="mt-1 font-inter text-[13px] leading-[1.5] text-[#8C8890]">
                Comment keywords fire a DM in seconds, no manual replies.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="max-w-[190px]">
              <h3 className="font-bebas text-[20px] uppercase text-[#E6E3E8] tracking-[0.02em] leading-tight">
                HUMAN-SPEED REPLIES
              </h3>
              <p className="mt-1 font-inter text-[13px] leading-[1.5] text-[#8C8890]">
                Natural timing so conversations never feel automated.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="max-w-[190px]">
              <h3 className="font-bebas text-[20px] uppercase text-[#E6E3E8] tracking-[0.02em] leading-tight">
                SHOPIFY & STRIPE LINKS
              </h3>
              <p className="mt-1 font-inter text-[13px] leading-[1.5] text-[#8C8890]">
                Send product and payment links straight into the DM.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="max-w-[190px]">
              <h3 className="font-bebas text-[20px] uppercase text-[#E6E3E8] tracking-[0.02em] leading-tight">
                STORY REPLIES
              </h3>
              <p className="mt-1 font-inter text-[13px] leading-[1.5] text-[#8C8890]">
                Turn story reactions into conversations and customers.
              </p>
            </div>

          </div>

          {/* --- RIGHT TILES (2 vertical rounded tiles) --- */}
          <div className="flex items-center gap-[12px]">
            {/* Tile 3: Dot matrix */}
            <div className="w-[128px] h-[295px] rounded-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] overflow-hidden relative shadow-lg">
              <div className="absolute inset-0 bg-[#0f0d11]" />
              <svg
                width="128"
                height="295"
                viewBox="0 0 128 295"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full opacity-45"
              >
                <defs>
                  <pattern id="dot-matrix" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="6" cy="6" r="1.25" fill="rgba(255,255,255,0.5)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dot-matrix)" />
              </svg>
            </div>

            {/* Tile 4: Honeycomb / rounded bump pattern */}
            <div className="w-[128px] h-[295px] rounded-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] overflow-hidden relative shadow-lg">
              <div className="absolute inset-0 bg-[#0f0d11]" />
              <svg
                width="128"
                height="295"
                viewBox="0 0 128 295"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full opacity-40"
              >
                <defs>
                  <pattern id="honeycomb" width="20" height="34.64" patternUnits="userSpaceOnUse">
                    <path
                      d="M10 0 L20 5.77 L20 17.32 L10 23.09 L0 17.32 L0 5.77 Z M10 17.32 L20 23.09 L20 34.64 L10 40.41 L0 34.64 L0 23.09 Z"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="0.75"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#honeycomb)" />
              </svg>
            </div>
          </div>

        </div>

        {/* --- RESPONSIVE LAYOUT (<= 1024px & <= 768px) --- */}
        <div className="lg:hidden mt-12 flex flex-col items-center gap-10">
          
          {/* Feature Grid: 2-column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 max-w-lg mx-auto text-left">
            <div>
              <h3 className="font-bebas text-[20px] uppercase text-[#E6E3E8] tracking-[0.02em]">
                INSTANT TRIGGERS
              </h3>
              <p className="mt-1 font-inter text-[13px] leading-[1.5] text-[#8C8890]">
                Comment keywords fire a DM in seconds, no manual replies.
              </p>
            </div>
            <div>
              <h3 className="font-bebas text-[20px] uppercase text-[#E6E3E8] tracking-[0.02em]">
                HUMAN-SPEED REPLIES
              </h3>
              <p className="mt-1 font-inter text-[13px] leading-[1.5] text-[#8C8890]">
                Natural timing so conversations never feel automated.
              </p>
            </div>
            <div>
              <h3 className="font-bebas text-[20px] uppercase text-[#E6E3E8] tracking-[0.02em]">
                SHOPIFY & STRIPE LINKS
              </h3>
              <p className="mt-1 font-inter text-[13px] leading-[1.5] text-[#8C8890]">
                Send product and payment links straight into the DM.
              </p>
            </div>
            <div>
              <h3 className="font-bebas text-[20px] uppercase text-[#E6E3E8] tracking-[0.02em]">
                STORY REPLIES
              </h3>
              <p className="mt-1 font-inter text-[13px] leading-[1.5] text-[#8C8890]">
                Turn story reactions into conversations and customers.
              </p>
            </div>
          </div>

          {/* Horizontally scrollable row of texture tiles */}
          <div className="w-full flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-4 px-2 no-scrollbar">
            <div className="w-[90px] h-[210px] shrink-0 rounded-[16px] bg-[#0f0d11] border border-[rgba(255,255,255,0.12)] overflow-hidden relative">
              <svg width="100%" height="100%" className="opacity-50">
                <rect width="100%" height="100%" fill="url(#diag-waves)" />
              </svg>
            </div>
            <div className="w-[90px] h-[210px] shrink-0 rounded-[16px] bg-[#0f0d11] border border-[rgba(255,255,255,0.12)] overflow-hidden relative">
              <svg width="100%" height="100%" className="opacity-40">
                <rect width="100%" height="100%" fill="url(#sq-grid)" />
              </svg>
            </div>
            <div className="w-[90px] h-[210px] shrink-0 rounded-[16px] bg-[#0f0d11] border border-[rgba(255,255,255,0.12)] overflow-hidden relative">
              <svg width="100%" height="100%" className="opacity-45">
                <rect width="100%" height="100%" fill="url(#dot-matrix)" />
              </svg>
            </div>
            <div className="w-[90px] h-[210px] shrink-0 rounded-[16px] bg-[#0f0d11] border border-[rgba(255,255,255,0.12)] overflow-hidden relative">
              <svg width="100%" height="100%" className="opacity-40">
                <rect width="100%" height="100%" fill="url(#honeycomb)" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default BuiltForCreatorsSection;
