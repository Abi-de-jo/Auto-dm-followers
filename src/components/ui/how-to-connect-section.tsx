"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Inline SVGs matching rulebook (1.5 stroke, clean vector icons)
function SlidersIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const STEPS = [
  {
    id: 1,
    badge: "STEP 01",
    shortName: "Professional",
    title: "Switch to a Professional Account",
    subtitle: "Takes 10 seconds in Instagram Settings",
    description:
      "Open your Instagram profile > Settings > Account Type and switch to a free Creator or Business account. This enables official Meta Graph API message permissions.",
    icon: SlidersIcon,
    tag: "Free & Instant",
    estTime: "10 sec",
  },
  {
    id: 2,
    badge: "STEP 02",
    shortName: "Connect Meta",
    title: "Tap Connect in FreshDM",
    subtitle: "Official Meta Login for Business",
    description:
      "Log into your FreshDM dashboard and click 'Connect Instagram'. We redirect you through Meta's secure authorization dialog — you never share your Instagram password.",
    icon: InstagramIcon,
    tag: "No Password Needed",
    estTime: "15 sec",
  },
  {
    id: 3,
    badge: "STEP 03",
    shortName: "Permissions",
    title: "Allow Required Permissions",
    subtitle: "Read comments & send direct replies",
    description:
      "Meta prompts you to select the Instagram account you wish to manage and approve message delivery. Toggle permissions ON and tap 'Allow' to finish linking.",
    icon: ShieldCheckIcon,
    tag: "100% Meta Compliant",
    estTime: "15 sec",
  },
  {
    id: 4,
    badge: "STEP 04",
    shortName: "Live 24/7",
    title: "You're Connected & Live 24/7",
    subtitle: "Instant comment-to-DM triggers",
    description:
      "Pick any Reel, set keyword triggers like 'PRICE' or 'LINK', and test it live. FreshDM will automatically reply to comments and send DMs to anyone who asks.",
    icon: CheckCircleIcon,
    tag: "Ready for Traffic",
    estTime: "20 sec",
  },
];

export function HowToConnectSection() {
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        // Pin left column so only the right side cards scroll
        ScrollTrigger.create({
          trigger: "#how-to-connect-grid",
          start: "top 90px",
          end: "bottom bottom",
          pin: "#connect-left-column",
          pinSpacing: false,
          anticipatePin: 1,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Differential Background Parallax Aura
        gsap.to("#connect-bg-aura", {
          y: 260,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        // 2. Parallax Watermark Numbers in cards
        const cards = gsap.utils.toArray<HTMLElement>(".step-parallax-card");
        cards.forEach((card, index) => {
          const watermark = card.querySelector(".step-watermark");
          if (watermark) {
            gsap.fromTo(
              watermark,
              { y: 50, opacity: 0.02 },
              {
                y: -40,
                opacity: 0.07,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                },
              }
            );
          }

          // Card focal scale & glow when scrolling through viewport
          gsap.fromTo(
            card,
            { scale: 0.96, opacity: 0.7 },
            {
              scale: 1,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 78%",
                end: "top 35%",
                scrub: 0.5,
                onEnter: () => setActiveStep(index + 1),
                onEnterBack: () => setActiveStep(index + 1),
              },
            }
          );
        });

        // 3. Overall Steps Progress Bar Scrub
        let lastPct = 25;
        ScrollTrigger.create({
          trigger: "#steps-cards-container",
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.3,
          onUpdate: (self) => {
            const pct = Math.max(15, Math.min(100, Math.round(self.progress * 100)));
            if (pct === lastPct) return;
            lastPct = pct;
            if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
            if (progressTextRef.current) progressTextRef.current.textContent = `${pct}%`;
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".step-parallax-card", { opacity: 1, scale: 1 });
      });
    },
    { scope: containerRef }
  );

  const scrollToStep = (id: number) => {
    const el = document.querySelector(`#step-card-${id}`);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.1 });
    } else {
      el.scrollIntoView({ block: "center" });
    }
  };
  return (
    <section
      id="how-to-connect"
      ref={containerRef}
      className="relative w-full bg-[#0A080C] py-20 sm:py-28 lg:py-32 overflow-clip font-sans border-t border-white/[0.08] select-none text-[#E6E3E8]"
    >
      {/* Background Parallax Violet Aura */}
      <div
        id="connect-bg-aura"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(122, 34, 176, 0.12) 0%, rgba(162, 75, 224, 0.04) 45%, transparent 72%)",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div id="how-to-connect-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative">
          
          {/* Left Column: Heading + Setup Card (Static pin while right side scrolls) */}
          <div id="connect-left-column" className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 text-left">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7A22B0]/30 bg-[#7A22B0]/15 px-3 py-1 text-xs font-semibold text-[#D8B4FE] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-pulse" />
                <span>FAST 60-SECOND ONBOARDING</span>
              </div>

              {/* Title */}
              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-[52px] tracking-[-0.035em] leading-[1.02] text-[#E6E3E8]">
                How to <span className="text-[#A24BE0]">Connect</span>
              </h2>

              {/* Description */}
              <p className="mt-3.5 font-inter text-sm sm:text-base text-[#8C8890] leading-relaxed">
                Follow the 4 simple steps to connect your Instagram account with official Meta authorization.
              </p>
            </div>

            {/* Setup Progress & Guarantee Card (Styled like FAQ support card) */}
            <div className="rounded-[24px] bg-[#0E0C12] border border-white/[0.08] p-6 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_12px_32px_rgba(0,0,0,0.4)] hover:border-[#7A22B0]/40 transition-all duration-300 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-lg sm:text-xl font-bold text-white tracking-tight">
                  Live Setup Tracker
                </h3>
                <span className="text-xs font-mono font-bold text-[#C084FC] bg-[#7A22B0]/20 border border-[#7A22B0]/40 px-2.5 py-0.5 rounded-full">
                  STEP 0{activeStep} / 04
                </span>
              </div>

              {/* Progress Rail */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8C8890] font-mono">
                  <span>SETUP PROGRESS</span>
                  <span ref={progressTextRef} className="text-white font-bold">25%</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden relative">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-[#7A22B0] via-[#A24BE0] to-[#C084FC] rounded-full"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>

              {/* 4 Step Clickable Quick-Jump Pills */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {STEPS.map((step) => {
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => scrollToStep(step.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#7A22B0]/25 border-[#A24BE0]/50 shadow-[0_4px_16px_rgba(122,34,176,0.25)] text-white"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] text-[#8C8890]"
                      }`}
                    >
                      <span className="block text-[10px] font-mono font-bold opacity-75">
                        0{step.id}
                      </span>
                      <span className="block text-[11px] font-semibold truncate text-[#E6E3E8]">
                        {step.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Meta Safety Guarantee */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-3 text-xs text-[#8C8890]">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-[#A24BE0] shrink-0" />
                  <span>Meta Verified • Zero Passwords</span>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D8B4FE] hover:text-white font-semibold transition-colors shrink-0"
                >
                  <span>Connect</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Minimal Parallax Step Cards (7 of 12 cols) */}
          <div id="steps-cards-container" className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  id={`step-card-${step.id}`}
                  className={`step-parallax-card relative rounded-[24px] p-6 sm:p-8 bg-gradient-to-b from-[#130E1A]/90 to-[#0A080C]/98 border shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-300 ${
                    isActive ? "border-[#A24BE0]/50 shadow-[0_20px_50px_rgba(122,34,176,0.2)]" : "border-white/[0.08]"
                  }`}
                >
                  {/* Parallax Floating Watermark Number */}
                  <span className="step-watermark absolute -right-3 -bottom-7 font-bebas text-[140px] sm:text-[170px] leading-none text-white/[0.035] select-none pointer-events-none font-bold">
                    0{step.id}
                  </span>

                  {/* Top Specular Edge Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                  {/* Card Header Row */}
                  <div className="relative z-10 flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8E2CCB] to-[#5A1688] flex items-center justify-center text-white font-mono text-xs font-bold shadow-md shadow-[#7A22B0]/30 border border-white/20">
                        0{step.id}
                      </div>
                      <span className="text-[10.5px] font-bold tracking-wider font-mono text-[#D8B4FE] uppercase px-2.5 py-0.5 rounded-full bg-[#7A22B0]/20 border border-[#A24BE0]/30">
                        {step.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-[#8C8890] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                        {step.tag}
                      </span>
                      <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A24BE0]">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-xl sm:text-[22px] font-bold text-white tracking-tight leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-medium text-[#C084FC]">
                      {step.subtitle}
                    </p>
                    <p className="text-xs sm:text-[13.5px] text-[#8C8890] leading-relaxed pt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Step Visual Preview Chip */}
                  <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.06]">
                    {step.id === 1 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-[#E1306C]/15 border border-[#E1306C]/25 flex items-center justify-center text-[#E1306C]">
                            <InstagramIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-white block">Instagram Account Type</span>
                            <span className="text-[10px] text-[#8C8890]">Settings &gt; Account &gt; Switch</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#D8B4FE]">Creator Mode</span>
                          <div className="w-7 h-4 rounded-full bg-[#7A22B0] p-0.5 flex justify-end items-center">
                            <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                          </div>
                        </div>
                      </div>
                    )}

                    {step.id === 2 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-[#0081FB]/15 border border-[#0081FB]/25 flex items-center justify-center text-[#0081FB]">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-white block">Meta Login for Business</span>
                            <span className="text-[10px] text-emerald-400">OAuth 2.0 Official Authorization</span>
                          </div>
                        </div>
                        <span className="text-[9.5px] font-mono text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30">
                          Verified
                        </span>
                      </div>
                    )}

                    {step.id === 3 && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[11px] font-medium text-white truncate">Read Comments</span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[11px] font-medium text-white truncate">Send Direct Replies</span>
                        </div>
                      </div>
                    )}

                    {step.id === 4 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#7A22B0]/20 to-[#A24BE0]/10 border border-[#A24BE0]/30">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </span>
                          <div>
                            <span className="text-[11px] font-bold text-white block">FreshDM Automation Engine</span>
                            <span className="text-[10px] text-[#D8B4FE]">Listening for keyword triggers 24/7</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                          ACTIVE
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Minimal Bottom Quick Action */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-[13px] text-[#8C8890] text-center sm:text-left">
            Ready to turn comments into sales? Setup takes under 60 seconds with zero password sharing.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-[#7A22B0] hover:bg-[#8E2CCB] text-white font-inter text-xs font-semibold shadow-lg shadow-[#7A22B0]/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <span>Connect with Instagram</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default HowToConnectSection;
