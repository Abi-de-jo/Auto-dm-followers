"use client";

import React, { useEffect, useRef, useState } from "react";

// Hand-crafted logos for top creator agencies, tools & social commerce platforms in the creator space
const BRAND_PARTNERS = [
  {
    name: "Instagram",
    render: () => (
      <div className="flex items-center gap-2 text-[#E6E3E8] group">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#A24BE0] group-hover:text-[#C084FC] transition-colors"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" />
        </svg>
        <span className="font-sans font-bold text-[17px] tracking-tight">Instagram</span>
      </div>
    ),
  },
  {
    name: "Meta Graph API",
    render: () => (
      <div className="flex items-center gap-2 text-[#E6E3E8] group">
        <svg
          width="22"
          height="16"
          viewBox="0 0 24 18"
          fill="currentColor"
          className="text-[#A24BE0] group-hover:text-[#C084FC] transition-colors"
        >
          <path d="M12.001 5.093c-2.38 0-4.471 1.488-5.69 3.655-1.22-2.167-3.31-3.655-5.691-3.655C-1.892 5.093-3.23 9.49-1.92 12.87c1.077 2.775 3.791 4.63 6.92 4.63 2.38 0 4.471-1.488 5.69-3.655 1.22 2.167 3.31 3.655 5.691 3.655 3.129 0 5.843-1.855 6.92-4.63 1.31-3.38-.028-7.777-2.679-7.777-2.381 0-4.471 1.488-5.69 3.655-1.22-2.167-3.311-3.655-5.691-3.655zm-6.38 8.807c-2.029 0-3.682-1.748-3.682-3.896 0-2.147 1.653-3.896 3.682-3.896 1.701 0 3.136 1.228 3.568 2.896-.432 1.668-1.867 2.896-3.568 2.896zm12.76 0c-1.701 0-3.136-1.228-3.568-2.896.432-1.668 1.867-2.896 3.568-2.896 2.029 0 3.682 1.748 3.682 3.896 0 2.148-1.653 3.896-3.682 3.896z" />
        </svg>
        <span className="font-sans font-bold text-[17px] tracking-tight">Meta for Devs</span>
      </div>
    ),
  },
  {
    name: "Shopify Creators",
    render: () => (
      <div className="flex items-center gap-2 text-[#E6E3E8] group">
        <svg
          width="18"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#A24BE0] group-hover:text-[#C084FC] transition-colors"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span className="font-sans font-bold text-[17px] tracking-tight">Shopify</span>
      </div>
    ),
  },
  {
    name: "Kajabi",
    render: () => (
      <div className="flex items-center gap-2 text-[#E6E3E8] group">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#A24BE0] group-hover:text-[#C084FC] transition-colors"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        <span className="font-sans font-bold text-[17px] tracking-tight">Kajabi</span>
      </div>
    ),
  },
  {
    name: "Stan Store",
    render: () => (
      <div className="flex items-center gap-2 text-[#E6E3E8] group">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#A24BE0] group-hover:text-[#C084FC] transition-colors"
        >
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          <path d="M2 7h20" />
        </svg>
        <span className="font-sans font-bold text-[17px] tracking-tight">Stan Store</span>
      </div>
    ),
  },
  {
    name: "Gumroad",
    render: () => (
      <div className="flex items-center gap-2 text-[#E6E3E8] group">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#A24BE0] group-hover:text-[#C084FC] transition-colors"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8a4 4 0 1 0 4 4" />
        </svg>
        <span className="font-sans font-bold text-[17px] tracking-tight">Gumroad</span>
      </div>
    ),
  },
  {
    name: "Skool",
    render: () => (
      <div className="flex items-center gap-2 text-[#E6E3E8] group">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#A24BE0] group-hover:text-[#C084FC] transition-colors"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <span className="font-sans font-bold text-[17px] tracking-tight">Skool</span>
      </div>
    ),
  },
  {
    name: "Substack",
    render: () => (
      <div className="flex items-center gap-2 text-[#E6E3E8] group">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[#A24BE0] group-hover:text-[#C084FC] transition-colors"
        >
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </svg>
        <span className="font-sans font-bold text-[17px] tracking-tight">Substack</span>
      </div>
    ),
  },
];

export function TrustedCreators() {
  const sectionRef = useRef<HTMLElement>(null);
  const [marqueeActive, setMarqueeActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMarqueeActive(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0A080C] py-14 sm:py-18 overflow-hidden font-sans select-none">
      {/* Background soft purple aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[220px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(122,34,176,0.10), transparent)" }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Header tailored to FreshDM's creator & business audience */}
        <div className="text-center mb-7 sm:mb-9 flex flex-col items-center">
          <p className="font-inter text-xs sm:text-[13px] font-semibold uppercase tracking-[0.12em] text-[#8C8890]">
            POWERING REEL &amp; STORY CONVERSIONS FOR
          </p>
          <h3 className="mt-1.5 font-bebas text-3xl sm:text-4xl md:text-[42px] tracking-[-0.035em] leading-tight text-[#E6E3E8]">
            The Top Creators <span className="text-[#A24BE0]">&amp; Brands</span>
          </h3>
        </div>

        {/* Glossy Dark Banner Bar Container with faded top and bottom lines (no left/right borders) */}
        <div className="relative w-full max-w-5xl mx-auto bg-[#0E0C12]/90 py-5 sm:py-6 overflow-hidden">
          {/* Faded Top Hairline: sharp in center, smoothly fades out to transparent on ends */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent pointer-events-none" />

          {/* Faded Bottom Hairline: sharp in center, smoothly fades out to transparent on ends */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent pointer-events-none" />

          {/* Subtle accent highlight in the center of the top hairline */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#A24BE0]/35 to-transparent pointer-events-none" />

          {/* Faded Left & Right Vignette Overlay */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
            }}
          >
            {/* Seamless Infinite Marquee Track */}
            <div
              className="flex w-max shrink-0 items-center gap-12 sm:gap-16 whitespace-nowrap animate-marquee-left"
              style={{
                animationDuration: "32s",
                animationPlayState: marqueeActive ? "running" : "paused",
              }}
            >
              {[...BRAND_PARTNERS, ...BRAND_PARTNERS, ...BRAND_PARTNERS].map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex items-center opacity-75 hover:opacity-100 transition-opacity duration-300 cursor-default"
                >
                  {item.render()}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default TrustedCreators;
