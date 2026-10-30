"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// =====================================================================
// 1. EDITABLE DATA LIST
// NOTE: These entries are placeholder data for FreshDM client results.
// Replace with real creator videos, posters, and metrics for live production.
// =====================================================================
export interface ResultItem {
  id: number;
  video: string;
  poster: string;
  platform: "instagram";
  views: string;
  resultTitle: string;
  description: string;
  handle: string;
  initials: string;
  avatarGradient: string;
}

export const RESULTS_DATA: ResultItem[] = [
  {
    id: 1,
    video: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
    poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    platform: "instagram",
    views: "2.4M Views",
    resultTitle: "2,400 leads in 30 days",
    description: "Comment-to-DM flow on a launch reel captured buyers on autopilot.",
    handle: "@brandname_one",
    initials: "BO",
    avatarGradient: "from-purple-500 to-indigo-600",
  },
  {
    id: 2,
    video: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-illuminated-city-street-41460-large.mp4",
    poster: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
    platform: "instagram",
    views: "850K Views",
    resultTitle: "38% comment-to-DM rate",
    description: "Keyword PRICE triggered a direct checkout link under 0.4s.",
    handle: "@brandname_two",
    initials: "BT",
    avatarGradient: "from-violet-600 to-fuchsia-600",
  },
  {
    id: 3,
    video: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-skating-at-sunset-41444-large.mp4",
    poster: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    platform: "instagram",
    views: "1.1M Views",
    resultTitle: "Replies in under 3 seconds",
    description: "Zero manual replying required during a 24-hour live product drop.",
    handle: "@brandname_three",
    initials: "TH",
    avatarGradient: "from-indigo-500 to-purple-700",
  },
  {
    id: 4,
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-sparkler-in-a-field-at-night-42171-large.mp4",
    poster: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    platform: "instagram",
    views: "490K Views",
    resultTitle: "+5K followers in 1 month",
    description: "Story mention auto-responders turned passive viewers into conversations.",
    handle: "@brandname_four",
    initials: "BF",
    avatarGradient: "from-purple-600 to-pink-600",
  },
  {
    id: 5,
    video: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-rain-41275-large.mp4",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    platform: "instagram",
    views: "1.8M Views",
    resultTitle: "1M+ views, 9K DMs sent",
    description: "One viral reel scaled effortlessly with zero dropped conversations.",
    handle: "@brandname_five",
    initials: "BV",
    avatarGradient: "from-violet-700 to-purple-500",
  },
];

// Helper Inline SVGs
function EyeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function VerifiedBadgeCheck({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#7A22B0" stroke="#A24BE0" />
      <path d="m9 12 2 2 4-4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function InstagramOutlineGlyph({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2" />
    </svg>
  );
}

function BadgeNotchLeft() {
  return (
    <svg width="14" height="4" viewBox="0 0 14 4" fill="none" className="shrink-0 text-[#8C8890]/60">
      <line x1="0" y1="2" x2="14" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BadgeNotchRight() {
  return (
    <svg width="14" height="4" viewBox="0 0 14 4" fill="none" className="shrink-0 text-[#8C8890]/60">
      <line x1="0" y1="2" x2="14" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ResultsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Ticker loop variables stored in refs to avoid re-renders
  const xPosRef = useRef(0);
  const baseSpeedRef = useRef(65); // px per second
  const currentSpeedRef = useRef(65);
  const targetSpeedRef = useRef(65);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const lastDragXRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const isSectionVisibleRef = useRef(true);

  // Triple repeat so cards span >= 3x the viewport width seamlessly
  const REPEATED_ITEMS = [...RESULTS_DATA, ...RESULTS_DATA, ...RESULTS_DATA];

  // ==========================================
  // GSAP HEADER REVEAL & SCROLL CONTROLS
  // ==========================================
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Words reveal in header
        const words = document.querySelectorAll(".results-header-word");
        const badge = document.querySelector("#results-badge");
        const button = document.querySelector("#results-cta-button");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#results-header-block",
            start: "top 80%",
            once: true,
          },
        });

        // 1. Badge fades & scales
        tl.fromTo(
          badge,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );

        // 2. Heading words rise from 24px below
        tl.fromTo(
          ".results-heading-word",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" },
          "-=0.2"
        );

        // 3. Paragraph words rise
        tl.fromTo(
          ".results-paragraph-word",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.02, ease: "power3.out" },
          "-=0.4"
        );

        // 4. CTA Button fades up
        tl.fromTo(
          button,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          ["#results-badge", ".results-header-word", "#results-cta-button"],
          { opacity: 1, y: 0, scale: 1 }
        );
      });

      // Viewport visibility pause
      ScrollTrigger.create({
        trigger: sectionRef.current,
        onEnter: () => {
          isSectionVisibleRef.current = true;
        },
        onLeave: () => {
          isSectionVisibleRef.current = false;
        },
        onEnterBack: () => {
          isSectionVisibleRef.current = true;
        },
        onLeaveBack: () => {
          isSectionVisibleRef.current = false;
        },
      });
    },
    { scope: sectionRef }
  );

  // ==========================================
  // SEAMLESS TICKER LOOP & DRAG INERTIA
  // ==========================================
  useEffect(() => {
    // Responsive speed setting
    const updateSpeed = () => {
      const w = window.innerWidth;
      if (w <= 768) {
        baseSpeedRef.current = 40;
      } else if (w <= 1024) {
        baseSpeedRef.current = 50;
      } else {
        baseSpeedRef.current = 65;
      }
      if (!isHoveredRef.current && !isDraggingRef.current) {
        targetSpeedRef.current = baseSpeedRef.current;
      }
    };
    updateSpeed();
    window.addEventListener("resize", updateSpeed);

    // Track width measurements
    const track = trackRef.current;
    if (!track) return;

    let singleSetWidth = 0;
    const calculateWidth = () => {
      const cards = track.children;
      if (cards.length > 0) {
        let total = 0;
        for (let i = 0; i < RESULTS_DATA.length; i++) {
          const el = cards[i] as HTMLElement;
          if (el) {
            total += el.offsetWidth + 10; // card width + gap
          }
        }
        singleSetWidth = total;
      }
    };
    calculateWidth();
    window.addEventListener("resize", calculateWidth);

    // GSAP Ticker animation loop
    let lastTime = performance.now();

    const tickerUpdate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isSectionVisibleRef.current) return;

      // Handle hover deceleration & acceleration
      if (isHoveredRef.current && !isDraggingRef.current) {
        targetSpeedRef.current = 0;
      } else if (!isDraggingRef.current) {
        targetSpeedRef.current = baseSpeedRef.current;
      }

      // Smooth lerp speed
      if (!isDraggingRef.current) {
        currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.1;
        xPosRef.current -= currentSpeedRef.current * delta;

        // Apply drag release inertia decay
        if (Math.abs(dragVelocityRef.current) > 0.5) {
          xPosRef.current += dragVelocityRef.current * delta;
          dragVelocityRef.current *= 0.92;
        }
      }

      // Wrap-around seamless logic
      if (singleSetWidth > 0) {
        while (xPosRef.current <= -singleSetWidth) {
          xPosRef.current += singleSetWidth;
        }
        while (xPosRef.current > 0) {
          xPosRef.current -= singleSetWidth;
        }
      }

      if (track) {
        track.style.transform = `translate3d(${xPosRef.current}px, 0, 0)`;
      }
    };

    gsap.ticker.add(tickerUpdate);

    // ==========================================
    // VIDEO PERFORMANCE: VIEWPORT PLAY/PAUSE
    // ==========================================
    const checkVideoPlayback = () => {
      if (!isSectionVisibleRef.current || document.hidden) {
        videoRefs.current.forEach((vid) => {
          if (vid && !vid.paused) vid.pause();
        });
        return;
      }

      const winWidth = window.innerWidth;
      const buffer = 0;

      videoRefs.current.forEach((vid) => {
        if (!vid) return;
        const rect = vid.getBoundingClientRect();
        const isInView = rect.right >= -buffer && rect.left <= winWidth + buffer;

        if (isInView) {
          if (vid.paused) {
            vid.play().catch(() => {});
          }
        } else {
          if (!vid.paused) {
            vid.pause();
          }
        }
      });
    };

    const videoInterval = setInterval(checkVideoPlayback, 160);
    document.addEventListener("visibilitychange", checkVideoPlayback);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      clearInterval(videoInterval);
      window.removeEventListener("resize", updateSpeed);
      window.removeEventListener("resize", calculateWidth);
      document.removeEventListener("visibilitychange", checkVideoPlayback);
    };
  }, []);

  // Pointer/Touch Drag handlers (pan-y preserved)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = xPosRef.current;
    lastDragXRef.current = e.clientX;
    dragVelocityRef.current = 0;

    const track = trackRef.current;
    if (track) {
      track.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX;
    const deltaX = currentX - dragStartXRef.current;
    xPosRef.current = dragStartPosRef.current + deltaX;

    // Calculate instant drag velocity
    dragVelocityRef.current = (currentX - lastDragXRef.current) * 60;
    lastDragXRef.current = currentX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    const track = trackRef.current;
    if (track) {
      track.style.cursor = "grab";
    }
  };

  return (
    <section
      id="results"
      ref={sectionRef}
      className="relative w-full bg-[#0A080C] pt-[120px] pb-[120px] overflow-hidden select-none text-[#E6E3E8]"
    >
      {/* Center Wide Soft Violet Glow (6% opacity max) behind ticker */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[350px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(122,34,176,0.13), transparent)" }}
      />

      {/* ========================================================
          1. HEADER BLOCK (Centered, max-width ~760px)
      ======================================================== */}
      <div
        id="results-header-block"
        className="relative z-10 max-w-[760px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center"
      >
        {/* Badge Pill: 2 layers (Dark outer + blurred glass chip with side notches) */}
        <div id="results-badge" className="p-1 rounded-full bg-black/60 shadow-sm border border-white/[0.06]">
          <div className="h-[34px] px-4 rounded-full bg-white/[0.06] border border-white/[0.10] flex items-center gap-2.5">
            <BadgeNotchLeft />
            <span className="font-inter font-medium text-[14px] text-white/80 tracking-normal">
              Creator Results
            </span>
            <BadgeNotchRight />
          </div>
        </div>

        {/* Heading: Two lines with "numbers" in violet Kaushan Script */}
        <h2 className="mt-7 font-bebas text-[clamp(40px,4.8vw,72px)] leading-[1.02] tracking-[-0.04em] text-[#E6E3E8] text-balance">
          <span className="block overflow-hidden">
            {"Real replies,".split(" ").map((w, i) => (
              <span key={i} className="results-header-word results-heading-word inline-block mr-2.5">
                {w}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden mt-1 sm:mt-1.5">
            <span className="results-header-word results-heading-word inline-block mr-2.5">Real</span>
            <span className="results-header-word results-heading-word inline-block font-kaushan normal-case text-[#7A22B0] tracking-normal">
              numbers
            </span>
          </span>
        </h2>

        {/* Paragraph: Centered, max-w 560px, Inter 17px / 1.6 */}
        <p className="mt-5 max-w-[560px] font-inter text-[17px] leading-[1.6] text-[#8C8890] text-balance">
          {"Every automation below was set up, tested and measured with real creators. The numbers speak for themselves.".split(" ").map((w, i) => (
            <span key={i} className="results-header-word results-paragraph-word inline-block mr-1">
              {w}
            </span>
          ))}
        </p>

        {/* Button: Violet flat button with dual stacked text & arrow slide */}
        <div id="results-cta-button" className="mt-7">
          <button
            type="button"
            className="group relative h-[48px] pl-6 pr-2 rounded-full bg-[#7A22B0] text-white font-inter font-medium text-[16px] flex items-center gap-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:bg-[#8E2CCB] transition-colors overflow-hidden cursor-pointer active:scale-[0.98]"
          >
            {/* Dual stacked text container */}
            <span className="relative h-5 overflow-hidden inline-flex flex-col">
              <span className="inline-block transition-transform duration-350 ease-out group-hover:-translate-y-full">
                See more results
              </span>
              <span className="inline-block transition-transform duration-350 ease-out translate-y-full group-hover:-translate-y-full text-white">
                See more results
              </span>
            </span>

            {/* Right circle holding dual stacked arrow */}
            <div className="w-8 h-8 rounded-full bg-white/[0.18] flex items-center justify-center shrink-0 relative overflow-hidden">
              <span className="absolute inline-block transition-transform duration-350 ease-out group-hover:translate-x-4 group-hover:-translate-y-4">
                <ArrowUpRightIcon className="w-4 h-4 text-white" />
              </span>
              <span className="absolute inline-block -translate-x-4 translate-y-4 transition-transform duration-350 ease-out group-hover:translate-x-0 group-hover:translate-y-0">
                <ArrowUpRightIcon className="w-4 h-4 text-white" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. THE TICKER (Endless, full-bleed row with left/right fade)
      ======================================================== */}
      <div
        className="relative w-full mt-14 overflow-hidden touch-pan-y"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        {/* Left Edge Overlay Fade (8% width) */}
        <div className="absolute top-0 bottom-0 left-0 w-[8%] max-w-[120px] bg-gradient-to-r from-[#0A080C] to-transparent z-20 pointer-events-none" />

        {/* Right Edge Overlay Fade (8% width) */}
        <div className="absolute top-0 bottom-0 right-0 w-[8%] max-w-[120px] bg-gradient-to-l from-[#0A080C] to-transparent z-20 pointer-events-none" />

        {/* Moving Draggable Track */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex items-center gap-[10px] w-max cursor-grab select-none will-change-transform py-4"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          {REPEATED_ITEMS.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group/card relative w-[230px] sm:w-[260px] md:w-[300px] h-[380px] sm:h-[420px] md:h-[480px] rounded-[16px] border border-white/10 overflow-hidden shrink-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 shadow-2xl"
            >
              {/* Layer 1: Diagonal-Stripe SVG Pattern Placeholder */}
              <div className="absolute inset-0 bg-[#0F0D11] z-0 pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="diag-stripes" width="12" height="12" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#diag-stripes)" />
                </svg>
              </div>

              {/* Layer 2: Autoplay looping muted video with poster */}
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={item.video}
                poster={item.poster}
                preload={index < 4 ? "auto" : "metadata"}
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-500"
              />

              {/* Layer 3: Top-Left Cluster (Platform logo tile + Views chip) */}
              <div className="absolute top-[14px] left-[14px] z-10 flex items-center gap-2">
                {/* Platform logo tile */}
                <div className="w-9 h-9 rounded-[10px] bg-black/60 border border-white/10 flex items-center justify-center text-white">
                  <InstagramOutlineGlyph className="w-4 h-4 text-white" />
                </div>

                {/* Views Chip */}
                <div className="h-[30px] px-3 rounded-full bg-black/60 border border-white/10 flex items-center gap-1.5 text-white">
                  <EyeIcon className="w-3.5 h-3.5 text-white" />
                  <span className="font-inter font-medium text-[13px]">{item.views}</span>
                </div>
              </div>

              {/* Layer 4: Bottom Content Panel (Height ~120px) */}
              <div
                className="absolute bottom-0 left-0 right-0 z-10 p-4 flex flex-col justify-end text-left"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(10,8,12,0.95) 100%)",
                }}
              >
                {/* Result Title */}
                <h4 className="font-inter font-semibold text-[17px] sm:text-[18px] text-white truncate leading-tight">
                  {item.resultTitle}
                </h4>

                {/* Description */}
                <p className="mt-1 font-inter text-[13px] text-[#8C8890] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Profile Row */}
                <div className="mt-3 flex items-center gap-2 opacity-80">
                  <div
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr ${item.avatarGradient} flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-white/15`}
                  >
                    {item.initials}
                  </div>
                  <span className="font-inter font-medium text-[13px] text-white truncate">
                    {item.handle}
                  </span>
                  <VerifiedBadgeCheck className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ResultsSection;
