"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface FeatureItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  illustration: "isometric-dm" | "isometric-cube" | "isometric-radar" | "isometric-layers" | "isometric-shield" | "isometric-chart";
}

export const INSTAGRAM_FEATURES: FeatureItem[] = [
  {
    id: "send-links",
    badge: "01 / AUTOMATION",
    title: "Send Links in DMs",
    description:
      "Send links, pricing, or guides to anyone who comments on your Reels.",
    illustration: "isometric-dm",
  },
  {
    id: "keyword-triggers",
    badge: "02 / TRIGGERS",
    title: "Keyword Triggers",
    description:
      "Pick simple trigger words like 'PRICE' or 'LINK' to send auto replies.",
    illustration: "isometric-cube",
  },
  {
    id: "story-mentions",
    badge: "03 / ENGAGEMENT",
    title: "Story Mention Replies",
    description:
      "Send a thank-you message whenever a follower tags your account in their Story.",
    illustration: "isometric-radar",
  },
  {
    id: "smart-ai",
    badge: "04 / INTELLIGENCE",
    title: "Smart AI Answers",
    description:
      "Answer questions naturally without sounding like a robot or repeating text.",
    illustration: "isometric-layers",
  },
  {
    id: "safe-compliant",
    badge: "05 / SECURITY",
    title: "Official Meta Approved",
    description:
      "Built strictly using official Instagram rules so your account stays 100% safe.",
    illustration: "isometric-shield",
  },
  {
    id: "link-tracking",
    badge: "06 / ANALYTICS",
    title: "Click & Lead Tracking",
    description:
      "See how many people commented, received your DMs, and clicked your links.",
    illustration: "isometric-chart",
  },
];

interface FeatureLayout {
  card: string;
  stage: string;
  art: string;
  horizontal?: boolean;
}

const FEATURE_LAYOUT: Record<string, FeatureLayout> = {
  "send-links": {
    card: "lg:col-span-7",
    stage: "h-[210px] sm:h-[230px]",
    art: "h-44 w-44 sm:h-48 sm:w-48",
  },
  "keyword-triggers": {
    card: "lg:col-span-5",
    stage: "h-[210px] sm:h-[230px]",
    art: "h-44 w-44 sm:h-48 sm:w-48",
  },
  "story-mentions": {
    card: "lg:col-span-4",
    stage: "h-[170px]",
    art: "h-36 w-36",
  },
  "smart-ai": {
    card: "lg:col-span-4",
    stage: "h-[170px]",
    art: "h-36 w-36",
  },
  "safe-compliant": {
    card: "lg:col-span-4",
    stage: "h-[170px]",
    art: "h-36 w-36",
  },
  "link-tracking": {
    card: "lg:col-span-12",
    stage: "h-[200px] lg:h-[230px]",
    art: "h-48 w-48 sm:h-52 sm:w-52",
    horizontal: true,
  },
};

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Rocket/Plane only: ascends from grid, dips, accelerates up
        gsap.to("#iso-plane-object", {
          x: 14,
          y: -18,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("#iso-plane-thrust", {
          scaleY: 1.6,
          opacity: 0.9,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          transformOrigin: "top center",
        });
        gsap.to("#iso-plane-thrust", {
          strokeDashoffset: -16,
          duration: 0.7,
          repeat: -1,
          ease: "none",
        });

        // 2. Keyword Cube: levitates and pulses its key tag badge
        gsap.to("#iso-cube-body", {
          y: -10,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("#iso-cube-key", {
          scale: 1.15,
          duration: 1.3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          transformOrigin: "center center",
        });
        gsap.fromTo(
          "#iso-cube-ring",
          { scale: 0.9, opacity: 0.5 },
          {
            scale: 1.7,
            opacity: 0,
            duration: 2.4,
            repeat: -1,
            ease: "power1.out",
            svgOrigin: "80 116",
          }
        );

        // 3. Story Radar: rings pulse outward continuously
        gsap.to(".svg-3d-pulse", {
          scale: 1.9,
          opacity: 0,
          duration: 2.2,
          repeat: -1,
          ease: "power1.out",
          transformOrigin: "center center",
        });
        gsap.to("#iso-radar-beacon", {
          scale: 1.25,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "center center",
        });
        gsap.to("#iso-radar-sweep", {
          rotation: 360,
          duration: 5,
          repeat: -1,
          ease: "none",
          svgOrigin: "80 85",
        });

        // 4. Smart AI Layers: top and middle plates separate & float independently
        gsap.to("#iso-layer-top", {
          y: -12,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("#iso-layer-mid", {
          y: -6,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.2,
        });
        gsap.to("#iso-layer-line", {
          strokeDashoffset: -12,
          duration: 0.9,
          repeat: -1,
          ease: "none",
        });
        gsap.fromTo(
          "#iso-layer-signal",
          { attr: { cy: 118 }, opacity: 0 },
          {
            attr: { cy: 40 },
            opacity: 1,
            duration: 2.2,
            repeat: -1,
            repeatDelay: 0.25,
            ease: "power1.inOut",
          }
        );

        // 5. Shield: breathes and checkmark pulses with protection glow
        gsap.to("#iso-shield-body", {
          y: -8,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("#iso-shield-check", {
          scale: 1.12,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          transformOrigin: "center center",
        });
        gsap.to("#iso-shield-orbit", {
          rotation: 360,
          duration: 9,
          repeat: -1,
          ease: "none",
          svgOrigin: "80 70",
        });

        // 6. Lead Tracking Bars: grow sequentially from lower to high
        gsap.fromTo(
          ".iso-bar-column",
          { scaleY: 0.35, transformOrigin: "bottom center" },
          {
            scaleY: 1.05,
            duration: 1.6,
            stagger: 0.25,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
          }
        );
        gsap.to("#iso-chart-trend", {
          strokeDashoffset: -40,
          duration: 1.4,
          repeat: -1,
          ease: "none",
        });
        gsap.fromTo(
          ".feature-stage-glow",
          { opacity: 0.55 },
          {
            opacity: 0.95,
            duration: 3.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.2,
          }
        );

        // Stagger cards in when in viewport
        gsap.from(".feature-3d-card", {
          autoAlpha: 0,
          y: 30,
          duration: 0.75,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: "#features-grid",
            start: "top 80%",
            once: true,
          },
        });

        const loopTweens = gsap
          .getTweensOf(Array.from(containerRef.current?.querySelectorAll("*") ?? []))
          .filter((tween) => tween.repeat() === -1);

        const loopTrigger = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            loopTweens.forEach((tween) => {
              if (self.isActive) tween.resume();
              else tween.pause();
            });
          },
        });

        if (!loopTrigger.isActive) {
          loopTweens.forEach((tween) => tween.pause());
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".feature-3d-card", { autoAlpha: 1, y: 0 });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="features"
      ref={containerRef}
      aria-labelledby="features-heading"
      className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#0A080C] py-20 font-sans text-[#E6E3E8] sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(122,34,176,0.14), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[380px] w-[760px] -translate-x-1/2 translate-y-1/3 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(76,18,115,0.28), transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-8 sm:mb-16 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h2
              id="features-heading"
              className="font-bebas text-4xl leading-[1.02] tracking-[-0.035em] text-[#F4EFF6] sm:text-5xl lg:text-[52px]"
            >
              Ready out of the <span className="text-[#C084FC]">box</span>
            </h2>
            <p className="mt-3.5 font-inter text-sm leading-relaxed text-[#B8B1C0] sm:text-base">
              Simple, reliable, and built to capture follower intent without sounding like a robot.
            </p>
          </div>

          <div className="hidden items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#A49AAE] sm:flex">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              06 modules
            </span>
            <span aria-hidden="true" className="h-3 w-px bg-white/10" />
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C084FC]" />
              Official Meta Graph API
            </span>
          </div>
        </div>

        <div id="features-grid" className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12 lg:gap-7">
          {INSTAGRAM_FEATURES.map((feature) => {
            const layout = FEATURE_LAYOUT[feature.id];
            return (
            <div
              key={feature.id}
              className={`feature-3d-card group relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0C1510] p-6 transition-[transform,border-color,background-color] duration-300 hover:border-[#10B981]/45 hover:bg-[#0E1A14] motion-safe:hover:-translate-y-1 sm:p-7 ${layout.card} ${layout.horizontal ? "lg:flex-row lg:items-center lg:gap-8" : ""}`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent"
              />
              {layout.horizontal && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full"
                  style={{ background: "radial-gradient(closest-side, rgba(122,34,176,0.4), transparent)" }}
                />
              )}

              <div
                className={`feature-stage relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-white/[0.06] bg-[#0A080C] ${layout.stage} ${layout.horizontal ? "mb-6 lg:mb-0 lg:w-[46%]" : "mb-6"}`}
              >
                <div
                  aria-hidden="true"
                  className="feature-stage-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(122,34,176,0.18),transparent_68%)]"
                />
                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-[#10B981]/30" />
                <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-[#10B981]/30" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#10B981]/30" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-[#10B981]/30" />

                {/* 3D Visual 1: Isometric Flying Message Plane */}
                {/* 3D Visual 1: Isometric Flying Message Plane (Rocket moves away from static grid) */}
                {feature.illustration === "isometric-dm" && (
                  <div aria-hidden="true" className={`relative flex items-center justify-center transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04] ${layout.art}`}>
                    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="iso-plane-grad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#34D399" />
                          <stop offset="60%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>

                      {/* Static Isometric Floor Grid (Stays in place) */}
                      <g opacity="0.35" transform="translate(0, 30)">
                        <path d="M 80 40 L 140 70 L 80 100 L 20 70 Z" fill="none" stroke="#10B981" strokeWidth="1" />
                        <path d="M 80 55 L 120 75 L 80 95 L 40 75 Z" fill="none" stroke="#10B981" strokeWidth="0.8" strokeDasharray="3 3" />
                        <line x1="80" y1="40" x2="80" y2="100" stroke="#10B981" strokeWidth="0.8" strokeDasharray="3 3" />
                        <line x1="20" y1="70" x2="140" y2="70" stroke="#10B981" strokeWidth="0.8" strokeDasharray="3 3" />
                      </g>

                      {/* 3D Plane/Rocket that flies upwards independently */}
                      <g id="iso-plane-object" transform="translate(45, 35) rotate(-15)">
                        <polygon points="50,10 10,75 50,60" fill="url(#iso-plane-grad)" opacity="0.95" />
                        <polygon points="50,10 90,75 50,60" fill="#10B981" opacity="0.8" />
                        <polygon points="50,60 50,75 35,70" fill="#064E3B" />
                        {/* Thrust trail */}
                        <line id="iso-plane-thrust" x1="50" y1="70" x2="50" y2="95" stroke="#34D399" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>
                )}

                {/* 3D Visual 2: Isometric Trigger Key Prism Cube */}
                {feature.illustration === "isometric-cube" && (
                  <div aria-hidden="true" className={`relative flex items-center justify-center transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04] ${layout.art}`}>
                    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="cube-top-grad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#34D399" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>

                      {/* Base shadow + expanding floor ring */}
                      <ellipse cx="80" cy="115" rx="42" ry="16" fill="#10B981" opacity="0.25" filter="blur(6px)" />
                      <ellipse id="iso-cube-ring" cx="80" cy="116" rx="42" ry="16" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.5" />

                      {/* Cube Body that floats */}
                      <g id="iso-cube-body">
                        <polygon points="80,40 120,60 80,80 40,60" fill="url(#cube-top-grad)" />
                        <polygon points="40,60 80,80 80,120 40,100" fill="#10B981" />
                        <polygon points="80,80 120,60 120,100 80,120" fill="#064E3B" />

                        {/* Key badge */}
                        <g id="iso-cube-key" transform="translate(68, 48)">
                          <rect width="24" height="14" rx="4" fill="#0E0C12" stroke="#C084FC" strokeWidth="1.5" />
                          <text x="12" y="10.5" textAnchor="middle" fill="#C084FC" fontSize="7" fontWeight="bold" fontFamily="monospace">
                            KEY
                          </text>
                        </g>
                      </g>
                    </svg>
                  </div>
                )}

                {/* 3D Visual 3: Isometric Story Radar Disc */}
                {feature.illustration === "isometric-radar" && (
                  <div aria-hidden="true" className={`relative flex items-center justify-center transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04] ${layout.art}`}>
                    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="radar-sweep-grad" x1="80" y1="85" x2="134" y2="85" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <ellipse cx="80" cy="85" rx="55" ry="25" fill="none" stroke="#059669" strokeWidth="1" strokeOpacity="0.3" />
                      <ellipse cx="80" cy="85" rx="38" ry="17" fill="none" stroke="#10B981" strokeWidth="1.2" strokeOpacity="0.5" />
                      <ellipse cx="80" cy="85" rx="22" ry="10" fill="none" stroke="#34D399" strokeWidth="1.5" />
                      <ellipse className="svg-3d-pulse" cx="80" cy="85" rx="22" ry="10" fill="none" stroke="#10B981" strokeWidth="1.5" />
                      <g id="iso-radar-sweep">
                        <line x1="80" y1="85" x2="134" y2="85" stroke="url(#radar-sweep-grad)" strokeWidth="2" strokeLinecap="round" />
                      </g>
                      <line x1="80" y1="85" x2="80" y2="48" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
                      <circle id="iso-radar-beacon" cx="80" cy="48" r="6" fill="#C084FC" />
                      <circle cx="80" cy="48" r="3" fill="#ffffff" />
                    </svg>
                  </div>
                )}

                {/* 3D Visual 4: Isometric AI Layers */}
                {feature.illustration === "isometric-layers" && (
                  <div aria-hidden="true" className={`relative flex items-center justify-center transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04] ${layout.art}`}>
                    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
                      {/* Layer 1 (Bottom, anchored) */}
                      <polygon points="80,85 125,105 80,125 35,105" fill="#4C1273" opacity="0.6" />
                      {/* Layer 2 (Middle) */}
                      <polygon id="iso-layer-mid" points="80,65 125,85 80,105 35,85" fill="#059669" opacity="0.8" />
                      {/* Layer 3 (Top Floating) */}
                      <polygon id="iso-layer-top" points="80,45 125,65 80,85 35,65" fill="#10B981" />
                      <line id="iso-layer-line" x1="80" y1="35" x2="80" y2="120" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
                      <circle id="iso-layer-signal" cx="80" cy="118" r="3.5" fill="#F0FDF4" />
                      <circle cx="80" cy="35" r="4" fill="#34D399" />
                    </svg>
                  </div>
                )}

                {/* 3D Visual 5: Isometric Shield Protection */}
                {feature.illustration === "isometric-shield" && (
                  <div aria-hidden="true" className={`relative flex items-center justify-center transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04] ${layout.art}`}>
                    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
                      <ellipse cx="80" cy="120" rx="40" ry="14" fill="#10B981" opacity="0.2" filter="blur(5px)" />
                      <g id="iso-shield-orbit">
                        <circle cx="80" cy="70" r="52" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="2 7" opacity="0.35" />
                        <circle cx="132" cy="70" r="3.5" fill="#34D399" />
                      </g>
                      <g id="iso-shield-body" transform="translate(42, 35)">
                        <path
                          d="M 38 10 L 68 22 L 68 55 C 68 75 38 92 38 92 C 38 92 8 75 8 55 L 8 22 Z"
                          fill="#10B981"
                          stroke="#34D399"
                          strokeWidth="2"
                        />
                        <path
                          id="iso-shield-check"
                          d="M 26 48 L 34 56 L 50 38"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                  </div>
                )}

                {/* 3D Visual 6: Isometric Stepped Chart Pedestal with Growing Bars */}
                {feature.illustration === "isometric-chart" && (
                  <div aria-hidden="true" className={`relative flex items-center justify-center transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04] ${layout.art}`}>
                    <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
                      {/* Bar 1 (Shortest to start, grows) */}
                      <g className="iso-bar-column" transform="translate(30, 75)">
                        <polygon points="15,0 30,8 15,16 0,8" fill="#10B981" />
                        <polygon points="0,8 15,16 15,40 0,32" fill="#059669" />
                        <polygon points="15,16 30,8 30,32 15,40" fill="#064E3B" />
                      </g>
                      {/* Bar 2 (Medium, grows) */}
                      <g className="iso-bar-column" transform="translate(65, 55)">
                        <polygon points="15,0 30,8 15,16 0,8" fill="#C084FC" />
                        <polygon points="0,8 15,16 15,60 0,52" fill="#10B981" />
                        <polygon points="15,16 30,8 30,52 15,60" fill="#059669" />
                      </g>
                      {/* Bar 3 (Tallest, grows highest) */}
                      <g className="iso-bar-column" transform="translate(100, 35)">
                        <polygon points="15,0 30,8 15,16 0,8" fill="#E9D5FF" />
                        <polygon points="0,8 15,16 15,80 0,72" fill="#C084FC" />
                        <polygon points="15,16 30,8 30,72 15,80" fill="#10B981" />
                      </g>
                      <path
                        id="iso-chart-trend"
                        d="M 38 82 L 70 62 L 102 44 L 130 26"
                        fill="none"
                        stroke="#E9D5FF"
                        strokeWidth="1.5"
                        strokeDasharray="5 4"
                        strokeLinecap="round"
                        opacity="0.75"
                      />
                      <path
                        d="M 122 26 L 130 26 L 130 34"
                        fill="none"
                        stroke="#E9D5FF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.75"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className={`relative z-10 flex flex-1 flex-col text-left ${layout.horizontal ? "lg:justify-center" : ""}`}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#10B981]">
                  {feature.badge}
                </span>
                <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.01em] text-[#F4EFF6] transition-colors group-hover:text-[#A7F3D0] sm:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-md text-[13px] leading-relaxed text-[#B8B1C0]">
                  {feature.description}
                </p>
              </div>
            </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;
