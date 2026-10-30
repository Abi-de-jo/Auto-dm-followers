"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AVATARS = {
  owner: "/avatars/owner.png",
  commenter: "/avatars/commenter.png",
};

// Inline SVGs
function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2" />
    </svg>
  );
}

function KeyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l1.5 1.5-5 5A4 4 0 1 1 5 13l5-5 1.5 1.5L13 8l-1.5-1.5L14 5l1.5 1.5L17 5l-1.5-1.5L17 2h4v4l-1.5 1.5L18 6l-1.5 1.5L18 9" />
      <circle cx="7.5" cy="16.5" r="1.5" />
    </svg>
  );
}

function SendIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ZapIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg className="h-3 w-3 text-[#10B981] fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

const STEPS = [
  {
    id: 1,
    title: "Connect Your Instagram",
    badge: "Step 01",
    description:
      "Tap connect, allow access for @codebyabi in seconds through official authorization. No password needed, safe and secure.",
    icon: InstagramIcon,
  },
  {
    id: 2,
    title: "Choose Post & Keyword",
    badge: "Step 02",
    description:
      'Select your Reel, and set your trigger word like "PRICE" or "LINK". FreshDM detects it the moment anyone comments.',
    icon: KeyIcon,
  },
  {
    id: 3,
    title: "Automated DM Sent to Inbox",
    badge: "Step 03",
    description:
      "Your follower instantly receives a private DM in their Instagram inbox with your link and friendly response.",
    icon: SendIcon,
  },
  {
    id: 4,
    title: "Capture Leads in Dashboard",
    badge: "Step 04",
    description:
      "Watch new leads stream into your mobile dashboard 24/7 with real-time delivery and click tracking while you sleep.",
    icon: ZapIcon,
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isPausedRef = useRef(false);

  const selectStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
    setProgress(0);
  };

  useGSAP(
    () => {
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(`.scene-${activeStep}`, { opacity: 1, x: 0 });
        gsap.set(".scene-layer", (i: number, target: HTMLElement) => {
          if (!target.classList.contains(`scene-${activeStep}`)) {
            gsap.set(target, { opacity: 0 });
          }
        });
        setProgress(1);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".scene-layer", { opacity: 0, x: 24, pointerEvents: "none" });
        gsap.set(`.scene-${activeStep}`, { opacity: 1, x: 0, pointerEvents: "auto" });

        const dot = document.querySelector("#touch-dot");
        const ripple = document.querySelector("#touch-ripple");
        gsap.set(dot, { opacity: 0, scale: 1 });
        gsap.set(ripple, { scale: 0.6, opacity: 0 });

        const tapAt = (
          tl: gsap.core.Timeline,
          x: number,
          y: number,
          labelTime?: number | string
        ) => {
          tl.to(
            dot,
            {
              x,
              y,
              opacity: 0.85,
              duration: 0.7,
              ease: "power2.inOut",
            },
            labelTime
          )
            .to(dot, { scale: 0.82, duration: 0.09, ease: "power1.in" })
            .fromTo(
              ripple,
              { x: x - 12, y: y - 12, scale: 0.6, opacity: 0.9 },
              { scale: 1.6, opacity: 0, duration: 0.4, ease: "power2.out" },
              "<"
            )
            .to(dot, { scale: 1, duration: 0.12, ease: "power1.out" });
        };

        const master = gsap.timeline({
          onUpdate: () => {
            setProgress(master.progress());
          },
          onComplete: () => {
            if (autoPlay && !isPausedRef.current) {
              setActiveStep((prev) => (prev >= 4 ? 1 : prev + 1));
            }
          },
        });

        activeTimelineRef.current = master;

        // ==========================================
        // SCENE 1: CONNECT YOUR INSTAGRAM (~9s)
        // ==========================================
        if (activeStep === 1) {
          gsap.set("#s1-app-view", { opacity: 1, display: "flex" });
          gsap.set("#s1-auth-view", { opacity: 0, display: "none" });
          gsap.set("#s1-connected-chip", { scale: 0, opacity: 0 });
          gsap.set(".s1-toggle-knob", { x: 0 });
          gsap.set(".s1-toggle-bg", { backgroundColor: "rgba(255,255,255,0.15)" });
          gsap.set("#s1-btn-spinner", { display: "none" });
          gsap.set("#s1-btn-text", { display: "block" });

          gsap.set(dot, { x: 230, y: 440, opacity: 0 });

          // 1. Dot moves to "Connect Instagram" button and taps at pixel-perfect (X: 145, Y: 350)
          tapAt(master, 145, 350, 0.4);

          // 2. Button loading spinner
          master.add(() => {
            gsap.set("#s1-btn-spinner", { display: "inline-block" });
            gsap.set("#s1-btn-text", { display: "none" });
          }, "+=0.1");

          // 3. Transition to Instagram Auth Sheet
          master.to("#s1-app-view", { opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.5");
          master.add(() => {
            gsap.set("#s1-app-view", { display: "none" });
            gsap.set("#s1-auth-view", { display: "flex", opacity: 0, y: 16 });
          });
          master.to("#s1-auth-view", { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" });

          // 4. Permission toggles flip on
          master.to("#s1-toggle-knob-1", { x: 18, duration: 0.25, ease: "power2.out" }, "+=0.3");
          master.to("#s1-toggle-bg-1", { backgroundColor: "#0095F6", duration: 0.25 }, "<");

          master.to("#s1-toggle-knob-2", { x: 18, duration: 0.25, ease: "power2.out" }, "+=0.25");
          master.to("#s1-toggle-bg-2", { backgroundColor: "#0095F6", duration: 0.25 }, "<");

          master.to("#s1-toggle-knob-3", { x: 18, duration: 0.25, ease: "power2.out" }, "+=0.25");
          master.to("#s1-toggle-bg-3", { backgroundColor: "#0095F6", duration: 0.25 }, "<");

          // 5. Dot moves to blue "Allow" button and taps at pixel-perfect (X: 145, Y: 430)
          tapAt(master, 145, 430, "+=0.3");

          // 6. Return to FreshDM screen with "Connected" badge
          master.to("#s1-auth-view", { opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.2");
          master.add(() => {
            gsap.set("#s1-auth-view", { display: "none" });
            gsap.set("#s1-app-view", { display: "flex", opacity: 0 });
          });
          master.to("#s1-app-view", { opacity: 1, duration: 0.35, ease: "power2.out" });

          master.fromTo(
            "#s1-connected-chip",
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" },
            "+=0.1"
          );

          master.to(dot, { opacity: 0, duration: 0.3 }, "+=0.2");
          master.to({}, { duration: 1.2 });
        }

        // ==========================================
        // SCENE 2: CHOOSE POST & KEYWORD (~11s)
        // ==========================================
        if (activeStep === 2) {
          gsap.set("#s2-step-post", { display: "block", opacity: 1 });
          gsap.set("#s2-step-keyword", { display: "none", opacity: 0 });
          gsap.set("#s2-step-reply", { display: "none", opacity: 0 });
          gsap.set("#s2-keyboard", { y: "100%", opacity: 0 });
          gsap.set("#s2-typed-keyword", { textContent: "" });
          gsap.set("#s2-toast", { y: 25, opacity: 0 });

          // Dot tap on reel #2 (center tile)
          tapAt(master, 145, 175, 0.4);

          // Reel gets violet ring, others dim
          master.add(() => {
            gsap.to(".s2-reel-card", { opacity: 0.45, duration: 0.3 });
            gsap.to("#s2-reel-2", { opacity: 1, scale: 1.03, duration: 0.3 });
            gsap.to("#s2-next-btn-1", {
              backgroundColor: "#10B981",
              color: "#000000",
              duration: 0.25,
            });
          });

          // Dot taps "Next"
          tapAt(master, 145, 475, "+=0.4");

          // Transition to Step 2: Keyword
          master.to("#s2-step-post", { opacity: 0, duration: 0.25, ease: "power2.in" });
          master.add(() => {
            gsap.set("#s2-step-post", { display: "none" });
            gsap.set("#s2-step-keyword", { display: "block", opacity: 0 });
            gsap.set("#s2-seg-1", { color: "#8C8890" });
            gsap.set("#s2-seg-2", { color: "#10B981", fontWeight: "700" });
          });
          master.to("#s2-step-keyword", { opacity: 1, duration: 0.25 });

          // Keyboard slides up
          master.to("#s2-keyboard", { y: "0%", opacity: 1, duration: 0.35, ease: "power3.out" }, "+=0.1");

          // Typing "PRICE"
          const word = "PRICE";
          const kwEl = document.querySelector("#s2-typed-keyword");
          let str = "";
          word.split("").forEach((char, i) => {
            master.add(() => {
              str += char;
              if (kwEl) kwEl.textContent = str;
            }, `+=${i === 0 ? 0.3 : i === 1 ? 0.22 : 0.12}`);
          });

          // Keyboard slides down
          master.to("#s2-keyboard", { y: "100%", opacity: 0, duration: 0.3, ease: "power2.in" }, "+=0.3");

          // Dot taps "Next"
          tapAt(master, 145, 475, "+=0.2");

          // Transition to Step 3: Reply
          master.to("#s2-step-keyword", { opacity: 0, duration: 0.25, ease: "power2.in" });
          master.add(() => {
            gsap.set("#s2-step-keyword", { display: "none" });
            gsap.set("#s2-step-reply", { display: "block", opacity: 0 });
            gsap.set("#s2-seg-2", { color: "#8C8890" });
            gsap.set("#s2-seg-3", { color: "#10B981", fontWeight: "700" });
          });
          master.to("#s2-step-reply", { opacity: 1, duration: 0.25 });

          // Dot taps "Turn on automation"
          tapAt(master, 145, 475, "+=0.4");

          // Success toast slides down
          // Success toast slides in at bottom-right
          master.to(
            "#s2-toast",
            { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.8)" },
            "+=0.1"
          );
          master.to(dot, { opacity: 0, duration: 0.2 });
          master.to({}, { duration: 1.2 });
        }

        // ==========================================
        // SCENE 3: AUTOMATED DM SENT TO INBOX (~12s)
        // ==========================================
        if (activeStep === 3) {
          gsap.set("#s3-post-view", { display: "flex", opacity: 1 });
          gsap.set("#s3-dm-view", { display: "none", opacity: 0 });
          gsap.set("#s3-comment-user", { display: "none", opacity: 0, y: 8 });
          gsap.set("#s3-comment-reply", { display: "none", opacity: 0, y: 8 });
          gsap.set("#s3-notification", { y: -80, opacity: 0 });
          gsap.set("#s3-typing-dots", { display: "none", opacity: 0 });
          gsap.set("#s3-incoming-dm", { display: "none", opacity: 0, y: 10 });
          gsap.set("#s3-keyboard", { y: "100%", opacity: 0 });
          gsap.set("#s3-input-text", { textContent: "Add a comment..." });

          // Dot taps comment input box (X: 145, Y: 480)
          tapAt(master, 145, 480, 0.4);

          // Keyboard slides up
          master.to("#s3-keyboard", { y: "0%", opacity: 1, duration: 0.35, ease: "power3.out" }, "+=0.1");

          // Follower types "price"
          const inputEl = document.querySelector("#s3-input-text");
          const word = "price";
          let str = "";
          word.split("").forEach((char, i) => {
            master.add(() => {
              str += char;
              if (inputEl) inputEl.textContent = str;
            }, `+=${i === 0 ? 0.3 : 0.12}`);
          });

          // Dot taps "Post" (X: 250, Y: 335)
          tapAt(master, 250, 335, "+=0.2");

          // Keyboard slides down, comment appears
          master.to("#s3-keyboard", { y: "100%", opacity: 0, duration: 0.3, ease: "power2.in" });
          master.add(() => {
            gsap.set("#s3-comment-user", { display: "flex" });
            if (inputEl) inputEl.textContent = "Add a comment...";
          });
          master.to("#s3-comment-user", { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });

          // After 1.2s delay, automated reply slides in
          master.add(() => {
            gsap.set("#s3-comment-reply", { display: "flex" });
          }, "+=1.2");
          master.to("#s3-comment-reply", { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });

          // Notification banner drops from top
          master.to(
            "#s3-notification",
            { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
            "+=0.8"
          );

          // Dot taps the notification banner
          tapAt(master, 145, 48, "+=0.4");

          // Transition to DM inbox thread
          master.to("#s3-notification", { y: -80, opacity: 0, duration: 0.3 });
          master.to("#s3-post-view", { opacity: 0, duration: 0.35, ease: "power2.in" }, "<");
          master.add(() => {
            gsap.set("#s3-post-view", { display: "none" });
            gsap.set("#s3-dm-view", { display: "flex", opacity: 0 });
          });
          master.to("#s3-dm-view", { opacity: 1, duration: 0.35, ease: "power2.out" });

          // 3-Dot Typing Indicator
          master.add(() => {
            gsap.set("#s3-typing-dots", { display: "flex", opacity: 1 });
          }, "+=0.2");
          master.to({}, { duration: 0.9 });
          master.to("#s3-typing-dots", { opacity: 0, duration: 0.2 });
          master.add(() => {
            gsap.set("#s3-typing-dots", { display: "none" });
            gsap.set("#s3-incoming-dm", { display: "flex" });
          });

          // Incoming DM bubble with link card slides in
          master.to("#s3-incoming-dm", { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" });

          master.to(dot, { opacity: 0, duration: 0.2 });
          master.to({}, { duration: 1.2 });
        }

        // ==========================================
        // SCENE 4: CAPTURE LEADS IN DASHBOARD (~10s)
        // ==========================================
        if (activeStep === 4) {
          gsap.set("#s4-lead-row-new-1", { opacity: 0, y: -20, display: "none" });
          gsap.set("#s4-lead-row-new-2", { opacity: 0, y: -20, display: "none" });
          gsap.set(".s4-clicked-badge", { scale: 0, opacity: 0 });

          const countLeads = { val: 24 };
          const countDms = { val: 86 };
          const countClicks = { val: 38 };

          const leadsEl = document.querySelector("#s4-stat-leads");
          const dmsEl = document.querySelector("#s4-stat-dms");
          const clicksEl = document.querySelector("#s4-stat-clicks");

          master.to(countLeads, {
            val: 32,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              if (leadsEl) leadsEl.textContent = `${Math.round(countLeads.val)}`;
            },
          }, 0.2);

          master.to(countDms, {
            val: 94,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              if (dmsEl) dmsEl.textContent = `${Math.round(countDms.val)}`;
            },
          }, 0.2);

          const s4Line = document.querySelector<SVGPathElement>("#s4-chart-line");
          if (s4Line) {
            const len = s4Line.getTotalLength();
            gsap.set(s4Line, { strokeDasharray: len, strokeDashoffset: len });
            master.to(s4Line, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.4);
          }

          master.add(() => {
            gsap.set("#s4-lead-row-new-1", { display: "flex" });
          }, "+=0.6");
          master.to(
            "#s4-lead-row-new-1",
            { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.6)" }
          );

          master.add(() => {
            gsap.set("#s4-lead-row-new-2", { display: "flex" });
          }, "+=1.2");
          master.to(
            "#s4-lead-row-new-2",
            { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.6)" }
          );

          master.to(".s4-clicked-badge", {
            scale: 1,
            opacity: 1,
            stagger: 0.2,
            duration: 0.4,
            ease: "back.out(2)",
          }, "+=0.5");

          master.to(countClicks, {
            val: 45,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              if (clicksEl) clicksEl.textContent = `${Math.round(countClicks.val)}`;
            },
          }, "<");

          master.to({}, { duration: 1.5 });
        }

        ScrollTrigger.create({
          trigger: "#how-it-works",
          onLeave: () => {
            master.pause();
            isPausedRef.current = true;
          },
          onEnterBack: () => {
            master.resume();
            isPausedRef.current = false;
          },
          onLeaveBack: () => {
            master.pause();
            isPausedRef.current = true;
          },
          onEnter: () => {
            master.resume();
            isPausedRef.current = false;
          },
        });
      });
    },
    { dependencies: [activeStep, autoPlay], scope: containerRef }
  );

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    activeTimelineRef.current?.pause();
  };
  const handleMouseLeave = () => {
    isPausedRef.current = false;
    activeTimelineRef.current?.resume();
  };

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#0A080C] py-20 sm:py-24 lg:py-28 overflow-hidden font-sans border-t border-white/[0.08] select-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 h-[350px] w-[600px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(122,34,176,0.11), transparent)" }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold tracking-widest text-[#10B981] uppercase mb-2.5">
            SIMPLE SETUP
          </p>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-[52px] tracking-[-0.035em] leading-[1.02] text-[#E6E3E8]">
            How it works
          </h2>
          <p className="mt-3.5 font-inter text-sm sm:text-base text-[#8C8890] leading-relaxed">
            Follow the 4 simple steps to automate your Instagram comments and messages
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ========================================================
              LEFT COLUMN: Smartphone Shell
          ======================================================== */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative w-[285px] sm:w-[310px] h-[550px] sm:h-[580px] rounded-[48px] bg-[#0E0C12] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12),inset_0_0_2px_1px_rgba(255,255,255,0.2)]">
              
              {/* Hardware Buttons */}
              <div className="absolute -left-[3px] top-[115px] w-[3px] h-[28px] rounded-l-sm bg-white/20 shadow-sm" />
              <div className="absolute -left-[3px] top-[152px] w-[3px] h-[28px] rounded-l-sm bg-white/20 shadow-sm" />
              <div className="absolute -right-[3px] top-[135px] w-[3px] h-[45px] rounded-r-sm bg-white/20 shadow-sm" />

              {/* Inner Screen Container (No thick top camera line) */}
              <div className="relative h-full w-full rounded-[38px] bg-[#0A080C] overflow-hidden flex flex-col text-[#E6E3E8] shadow-inner">
                
                {/* Status Bar: Clean transparent background */}
                <div className="relative z-40 h-9 w-full flex items-center justify-between px-6 pt-1 text-[11px] font-bold text-[#E6E3E8] bg-transparent">
                  <span>9:41</span>
                  {/* Dynamic Island */}
                  <div className="w-[84px] h-[19px] bg-black rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-zinc-950" />
                    </div>
                  </div>
                  {/* Status Icons */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-[#E6E3E8] rounded-[2px] p-[1px] flex items-center">
                      <div className="h-full w-2.5 bg-[#E6E3E8] rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Virtual Touch Dot & Ripple */}
                <div
                  id="touch-dot"
                  className="absolute z-50 w-6 h-6 rounded-full bg-white/85 shadow-[0_2px_10px_rgba(0,0,0,0.5)] pointer-events-none opacity-0"
                  style={{ willChange: "transform, opacity" }}
                />
                <div
                  id="touch-ripple"
                  className="absolute z-50 w-6 h-6 rounded-full border border-white/80 pointer-events-none opacity-0"
                />

                {/* ========================================================
                    SCENE 1: CONNECT YOUR INSTAGRAM
                ======================================================== */}
                <div
                  className={`scene-layer scene-1 absolute inset-0 pt-9 pb-6 flex flex-col justify-between ${
                    activeStep === 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                  aria-label="FreshDM app screen connecting Instagram with official authorization"
                >
                  {/* 1A. FreshDM Screen */}
                  <div id="s1-app-view" className="h-full flex flex-col justify-between px-5 pt-3">
                    <div>
                      {/* Top Bar with real photo of codebyabi */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <span className="font-sans font-bold text-[16px] text-white tracking-tight">
                          Auto<span className="text-[#10B981]">DM</span>
                        </span>
                        <img
                          src={AVATARS.owner}
                          alt="creator"
                          className="w-7 h-7 rounded-full object-cover border border-[#10B981]/50"
                        />
                      </div>

                      <div className="mt-6 text-left">
                        <h4 className="font-sans text-[18px] font-bold text-white tracking-tight">
                          Connect your Instagram
                        </h4>
                        <p className="mt-1 font-inter text-[12px] text-[#8C8890] leading-relaxed">
                          Link your Creator or Business account to enable instant comment and DM replies.
                        </p>
                      </div>

                      {/* Connected Chip with profile image */}
                      <div
                        id="s1-connected-chip"
                        className="mt-4 p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={AVATARS.owner}
                            alt="codebyabi"
                            className="w-5 h-5 rounded-full object-cover border border-emerald-400"
                          />
                          <span className="font-inter text-[12px] font-semibold text-white">@codebyabi</span>
                        </div>
                        <span className="text-[11px] font-medium text-[#10B981]">Connected</span>
                      </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="space-y-3 pb-4">
                      <button
                        type="button"
                        id="s1-connect-btn"
                        className="w-full h-11 rounded-[14px] bg-[#10B981] hover:bg-[#059669] text-black font-inter text-[13px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/30 transition-colors"
                      >
                        <span id="s1-btn-text">Connect Instagram</span>
                        <span id="s1-btn-spinner" className="hidden w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </button>
                      <p className="font-inter text-[10.5px] text-center text-[#8C8890]">
                        Official authorization. No password needed.
                      </p>
                    </div>

                    <div className="flex justify-around pt-2 border-t border-white/[0.08] text-[10px] text-[#8C8890]">
                      <span className="text-[#10B981] font-bold">Home</span>
                      <span>Automations</span>
                      <span>Leads</span>
                    </div>
                  </div>

                  {/* 1B. Instagram Dark Authorization Sheet */}
                  <div
                    id="s1-auth-view"
                    className="hidden h-full flex flex-col justify-between bg-black px-5 pt-3 pb-4 text-white"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                        <ChevronLeftIcon className="w-4 h-4 text-white" />
                        <InstagramIcon className="w-4 h-4 text-white" />
                        <span className="w-4" />
                      </div>

                      {/* Account Identity with actual codebyabi avatar */}
                      <div className="flex items-center gap-2.5 mt-3">
                        <img
                          src={AVATARS.owner}
                          alt="codebyabi"
                          className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                        />
                        <div className="text-left">
                          <p className="text-[13px] font-bold text-white leading-tight">@codebyabi</p>
                          <p className="text-[10px] text-[#A8A8A8]">Creator Account</p>
                        </div>
                      </div>

                      <h5 className="mt-4 text-[14.5px] font-bold text-white leading-snug text-left">
                        Allow FreshDM to access your account?
                      </h5>

                      <div className="mt-3.5 space-y-3 text-left">
                        {[
                          { id: 1, text: "Read comments on your posts" },
                          { id: 2, text: "Reply to comments" },
                          { id: 3, text: "Send messages for you" },
                        ].map((perm) => (
                          <div key={perm.id} className="flex items-center justify-between">
                            <span className="text-[11.5px] text-[#A8A8A8]">{perm.text}</span>
                            <div
                              id={`s1-toggle-bg-${perm.id}`}
                              className="s1-toggle-bg w-9 h-5 rounded-full p-0.5 transition-colors bg-white/15"
                            >
                              <div
                                id={`s1-toggle-knob-${perm.id}`}
                                className="s1-toggle-knob w-4 h-4 rounded-full bg-white shadow-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        id="s1-allow-btn"
                        className="w-full h-9 rounded-lg bg-[#0095F6] text-white font-inter text-[12px] font-semibold flex items-center justify-center"
                      >
                        Allow
                      </button>
                      <button
                        type="button"
                        className="w-full text-center text-[11px] text-[#A8A8A8]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    SCENE 2: CHOOSE POST & KEYWORD
                ======================================================== */}
                <div
                  className={`scene-layer scene-2 absolute inset-0 pt-9 pb-4 px-4 flex flex-col justify-between ${
                    activeStep === 2 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                  aria-label="FreshDM screen selecting reel and setting automated keyword triggers"
                >
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      {/* Top Segmented Flow Indicator (Clean, no overlapping border) */}
                      <div className="flex items-center justify-between pb-2 text-[11px]">
                        <span id="s2-seg-1" className="font-bold text-[#10B981]">1. Post</span>
                        <span id="s2-seg-2" className="text-[#8C8890]">2. Keyword</span>
                        <span id="s2-seg-3" className="text-[#8C8890]">3. Reply</span>
                      </div>

                      {/* 2A. Post Selector Step with Photo Thumbnails & Instagram Outline Icon */}
                      <div id="s2-step-post" className="mt-3">
                        <p className="text-left text-[11px] font-medium text-[#8C8890] mb-2">
                          Select Reel to automate:
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 1, views: "12.4K", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80" },
                            { id: 2, views: "88.2K", img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300&auto=format&fit=crop&q=80" },
                            { id: 3, views: "34.1K", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80" },
                            { id: 4, views: "9.8K", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
                            { id: 5, views: "45.0K", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
                            { id: 6, views: "18.3K", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80" },
                          ].map((tile) => (
                            <div
                              key={tile.id}
                              id={`s2-reel-${tile.id}`}
                              className={`s2-reel-card relative aspect-[9/14] rounded-lg overflow-hidden border border-white/10 p-1 flex flex-col justify-between transition-all ${
                                tile.id === 2 ? "ring-2 ring-[#10B981]" : ""
                              }`}
                            >
                              <img
                                src={tile.img}
                                alt="Reel thumbnail"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="relative z-10 flex justify-end">
                                {/* Clean Instagram Outline Icon */}
                                <InstagramIcon className="w-3.5 h-3.5 text-white/90" />
                              </div>
                              <span className="relative z-10 text-[9px] font-bold text-white">{tile.views}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2B. Keyword Step */}
                      <div id="s2-step-keyword" className="hidden mt-4 text-left">
                        <label className="text-[11px] font-medium text-[#8C8890] block mb-1">
                          Trigger word
                        </label>
                        <div className="h-10 rounded-xl bg-white/[0.06] border border-[#10B981] px-3 flex items-center">
                          <span id="s2-typed-keyword" className="font-bold text-[14px] text-white">
                            PRICE
                          </span>
                          <span className="w-0.5 h-4 bg-[#10B981] ml-0.5 animate-pulse" />
                        </div>

                        <div className="flex gap-2 mt-2.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[#8C8890]">
                            LINK
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[#8C8890]">
                            DEMO
                          </span>
                        </div>
                      </div>

                      {/* 2C. Reply Step */}
                      <div id="s2-step-reply" className="hidden mt-4 text-left">
                        <label className="text-[11px] font-medium text-[#8C8890] block mb-1">
                          Public reply to comment
                        </label>
                        <div className="h-9 rounded-xl bg-white/[0.06] border border-white/10 px-3 flex items-center text-[11.5px] text-white">
                          Sent you a DM 👍
                        </div>

                        <div className="mt-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                          <span className="text-[10px] font-bold text-[#10B981] uppercase">
                            Private DM Preview
                          </span>
                          <p className="text-[11px] text-zinc-300">
                            Hey Abi! Thanks for your interest.
                          </p>
                          <div className="rounded-lg bg-white/[0.06] p-1.5 border border-white/10 text-[10px] text-white flex items-center justify-between">
                            <span>Get access link →</span>
                            <span className="text-[#10B981] font-bold">View</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pb-4 relative">
                      <button
                        type="button"
                        id="s2-next-btn-1"
                        className="w-full h-10 rounded-[14px] bg-[#10B981] text-black font-inter text-[12.5px] font-semibold"
                      >
                        Next
                      </button>

                      {/* Success Toast in Bottom-Right */}
                      <div
                        id="s2-toast"
                        className="absolute -top-12 right-0 z-30 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 shadow-lg flex items-center gap-1.5 pointer-events-none"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                        <span className="text-[10.5px] font-semibold text-emerald-200 whitespace-nowrap">
                          Automation is live
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* iOS Style Keyboard */}
                  <div
                    id="s2-keyboard"
                    className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-white/10 p-2 space-y-1.5 text-center text-white text-[12px] font-medium rounded-b-[38px]"
                  >
                    <div className="flex justify-center gap-1">
                      {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((k) => (
                        <span key={k} className="w-6 h-8 rounded bg-[#2C2C2E] flex items-center justify-center">{k}</span>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1">
                      {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((k) => (
                        <span key={k} className="w-6 h-8 rounded bg-[#2C2C2E] flex items-center justify-center">{k}</span>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1">
                      {["Z", "X", "C", "V", "B", "N", "M"].map((k) => (
                        <span key={k} className="w-6 h-8 rounded bg-[#2C2C2E] flex items-center justify-center">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    SCENE 3: AUTOMATED DM SENT TO INBOX
                ======================================================== */}
                <div
                  className={`scene-layer scene-3 absolute inset-0 pt-9 pb-4 bg-black flex flex-col justify-between ${
                    activeStep === 3 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                  aria-label="Instagram comment thread triggering instant automated DM to inbox"
                >
                  {/* Top Notification Banner */}
                  <div
                    id="s3-notification"
                    className="absolute top-11 left-3 right-3 z-50 p-2.5 rounded-2xl bg-zinc-900/95 border border-white/15 shadow-2xl flex items-center gap-2.5 text-left text-white"
                  >
                    <img
                      src={AVATARS.owner}
                      alt="codebyabi"
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-zinc-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-bold text-white truncate">codebyabi sent you a message</p>
                      <p className="text-[10px] text-zinc-400 truncate">Hey Abi! Thanks for your interest...</p>
                    </div>
                  </div>

                  {/* 3A. Post View with Dimmed Background & Comments Sheet */}
                  <div id="s3-post-view" className="h-full flex flex-col justify-between text-white relative">
                    {/* Top: Dimmed Post Header */}
                    <div className="px-4 py-2 flex items-center justify-between border-b border-[#262626] opacity-60">
                      <div className="flex items-center gap-2">
                        <ChevronLeftIcon className="w-4 h-4 text-white" />
                        <span className="text-[12px] font-bold">Posts</span>
                      </div>
                      <span className="text-xs text-zinc-400">•••</span>
                    </div>

                    {/* Dimmed post author */}
                    <div className="px-4 py-2 flex items-center gap-2 opacity-50">
                      <img
                        src={AVATARS.owner}
                        alt="codebyabi"
                        className="w-7 h-7 rounded-full object-cover border border-zinc-600"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[11.5px] font-bold text-white">codebyabi</span>
                        <VerifiedBadge />
                      </div>
                    </div>

                    {/* Bottom Slide-up Comments Sheet (like reference images) */}
                    <div className="w-full flex-1 rounded-t-[24px] bg-[#121212] border-t border-[#262626] flex flex-col justify-between overflow-hidden">
                      {/* Sheet drag pill */}
                      <div className="w-10 h-1 rounded-full bg-zinc-700 mx-auto mt-2" />
                      <div className="text-center py-1 border-b border-[#262626]">
                        <span className="text-[12px] font-bold text-white">Comments</span>
                      </div>

                      {/* Comments stream with abi_de_jo and codebyabi */}
                      <div className="flex-1 px-4 py-3 text-left space-y-3 overflow-y-auto">
                        {/* 1. Existing rohan.dev comment */}
                        <div className="flex items-start gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                            alt="rohan.dev"
                            className="w-6 h-6 rounded-full object-cover border border-zinc-700 mt-0.5"
                          />
                          <div className="space-y-0.5">
                            <p className="text-[11px] text-white">
                              <strong className="font-bold">rohan.dev</strong> <span className="text-zinc-400 text-[9.5px]">2h</span>
                            </p>
                            <p className="text-[10.5px] text-zinc-300">Does this integrate with Shopify?</p>
                          </div>
                        </div>

                        {/* 2. New abi_de_jo comment */}
                        <div id="s3-comment-user" className="flex items-start gap-2">
                          <img
                            src={AVATARS.commenter}
                            alt="abi_de_jo"
                            className="w-6 h-6 rounded-full object-cover border border-zinc-700 mt-0.5"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] font-bold text-white">abi_de_jo</span>
                              <span className="text-[9px] text-zinc-400">just now</span>
                            </div>
                            <p className="text-[11px] text-white">price</p>
                          </div>
                        </div>

                        {/* 3. Automated reply from codebyabi */}
                        <div id="s3-comment-reply" className="pl-6 flex items-start gap-2">
                          <img
                            src={AVATARS.owner}
                            alt="codebyabi"
                            className="w-5 h-5 rounded-full object-cover border border-zinc-700 mt-0.5"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[10.5px] font-bold text-white">codebyabi</span>
                              <VerifiedBadge />
                              <span className="rounded bg-[#10B981]/30 px-1 text-[7.5px] font-semibold text-[#A7F3D0]">
                                Author
                              </span>
                            </div>
                            <p className="text-[10.5px] text-zinc-200">Sent you a DM 👍</p>
                          </div>
                        </div>
                      </div>

                      {/* Comment Input row with commenter avatar */}
                      <div className="px-3 py-2 border-t border-[#262626] flex items-center gap-2">
                        <img
                          src={AVATARS.commenter}
                          alt="abi_de_jo"
                          className="w-6 h-6 rounded-full object-cover border border-zinc-700 shrink-0"
                        />
                        <div className="flex-1 h-8 rounded-full bg-zinc-900 border border-zinc-800 px-3 flex items-center justify-between text-[11px] text-[#A8A8A8]">
                          <span id="s3-input-text">Add a comment...</span>
                          <span className="text-[#0095F6] font-bold text-[10px]">Post</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3B. Instagram DM Inbox View */}
                  <div id="s3-dm-view" className="hidden h-full flex flex-col justify-between px-3 text-white">
                    <div>
                      {/* DM Top Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                        <div className="flex items-center gap-2">
                          <ChevronLeftIcon className="w-4 h-4 text-white" />
                          <img
                            src={AVATARS.owner}
                            alt="codebyabi"
                            className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                          />
                          <div className="text-left">
                            <div className="flex items-center gap-1">
                              <span className="text-[12px] font-bold text-white">codebyabi</span>
                              <VerifiedBadge />
                            </div>
                            <span className="text-[9px] text-[#16C784] font-medium leading-none block">Active now</span>
                          </div>
                        </div>
                        {/* Call, video & tag icons */}
                        <div className="flex items-center gap-3 text-zinc-300">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          </svg>
                          <div className="relative">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                              <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#0095F6]" />
                          </div>
                        </div>
                      </div>

                      {/* Profile Card Header Showcase in Chat - Compact sized avatar */}
                      <div className="flex flex-col items-center justify-center pt-3 pb-2 space-y-1 text-center">
                        <img
                          src={AVATARS.owner}
                          alt="codebyabi"
                          className="w-14 h-14 rounded-full object-cover border border-zinc-700 shadow-sm"
                        />
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-[12px] font-bold text-white tracking-tight">codebyabi</span>
                          <VerifiedBadge />
                        </div>
                        <span className="text-[9.5px] text-zinc-400">Instagram · 48K followers</span>
                      </div>
                      {/* Timestamp */}
                      <div className="text-center py-1">
                        <span className="text-[9px] text-zinc-500 font-medium">1:09 PM</span>
                      </div>

                      {/* 3-Dot Typing Indicator */}
                      <div id="s3-typing-dots" className="mt-2 flex items-center gap-1 p-2 rounded-2xl bg-zinc-900 w-14">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                      </div>

                      {/* Real DM Message with 'Get access link' button */}
                      <div id="s3-incoming-dm" className="mt-2 flex items-end gap-2 text-left">
                        <img
                          src={AVATARS.owner}
                          alt="codebyabi"
                          className="w-6 h-6 rounded-full object-cover border border-zinc-700 shrink-0 mb-1"
                        />
                        <div className="p-3 rounded-2xl bg-[#262626] border border-[#333333] max-w-[215px] space-y-1.5">
                          <p className="text-[12px] font-medium text-white">Hey Abi!</p>
                          <p className="text-[11px] text-zinc-300">Thanks for your interest.</p>
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981] hover:bg-[#059669] px-3.5 py-1.5 text-[10px] font-bold text-black shadow-md">
                              Get access link →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Message Input Bar with Authentic Outline Camera Icon & Add-ons */}
                    <div className="pb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-black shrink-0 shadow-sm cursor-pointer">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                      <div className="flex-1 h-9 rounded-full bg-[#1e1e1e] border border-[#2e2e2e] px-3.5 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Message...</span>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                          </svg>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
                            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* iOS Style Keyboard for Commenting */}
                  <div
                    id="s3-keyboard"
                    className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-white/10 p-2 space-y-1.5 text-center text-white text-[12px] font-medium rounded-b-[38px]"
                  >
                    <div className="flex justify-center gap-1">
                      {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((k) => (
                        <span key={k} className="w-6 h-8 rounded bg-[#2C2C2E] flex items-center justify-center">{k}</span>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1">
                      {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((k) => (
                        <span key={k} className="w-6 h-8 rounded bg-[#2C2C2E] flex items-center justify-center">{k}</span>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1">
                      {["Z", "X", "C", "V", "B", "N", "M"].map((k) => (
                        <span key={k} className="w-6 h-8 rounded bg-[#2C2C2E] flex items-center justify-center">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    SCENE 4: CAPTURE LEADS IN DASHBOARD
                ======================================================== */}
                <div
                  className={`scene-layer scene-4 absolute inset-0 pt-9 pb-4 px-4 flex flex-col justify-between ${
                    activeStep === 4 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                  aria-label="FreshDM dashboard showing streaming leads and link click tracking"
                >
                  <div className="h-full flex flex-col justify-between text-left">
                    <div>
                      {/* Dashboard Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                        <span className="font-bold text-[14px] text-white">Leads</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-emerald-300">LIVE</span>
                        </div>
                      </div>

                      {/* 3 Stat Tiles Row */}
                      <div className="grid grid-cols-3 gap-1.5 mt-3">
                        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                          <span className="text-[9px] text-[#8C8890] block">Leads today</span>
                          <span id="s4-stat-leads" className="font-bold text-[16px] text-white tabular-nums">24</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                          <span className="text-[9px] text-[#8C8890] block">DMs sent</span>
                          <span id="s4-stat-dms" className="font-bold text-[16px] text-white tabular-nums">86</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                          <span className="text-[9px] text-[#8C8890] block">Link clicks</span>
                          <span id="s4-stat-clicks" className="font-bold text-[16px] text-[#10B981] tabular-nums">38</span>
                        </div>
                      </div>

                      {/* Compact Animated Line Chart */}
                      <div className="relative w-full h-14 mt-3">
                        <svg viewBox="0 0 240 50" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id="s4-chart-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 10 40 Q 60 30 110 32 T 180 15 T 235 8 L 235 50 L 10 50 Z"
                            fill="url(#s4-chart-grad)"
                          />
                          <path
                            id="s4-chart-line"
                            d="M 10 40 Q 60 30 110 32 T 180 15 T 235 8"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      {/* Streaming Leads List */}
                      <div className="mt-2 space-y-1.5">
                        {/* New Dropping Row 1 */}
                        <div
                          id="s4-lead-row-new-1"
                          className="hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={AVATARS.commenter}
                              alt="abi_de_jo"
                              className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                            />
                            <div>
                              <p className="font-bold text-white leading-tight">@abi_de_jo</p>
                              <span className="text-[9px] text-[#8C8890]">Just now</span>
                            </div>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#A7F3D0] font-bold">PRICE</span>
                        </div>

                        {/* New Dropping Row 2 */}
                        <div
                          id="s4-lead-row-new-2"
                          className="hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                              alt="sneha_creates"
                              className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                            />
                            <div>
                              <p className="font-bold text-white leading-tight">@sneha_creates</p>
                              <span className="text-[9px] text-[#8C8890]">45m ago</span>
                            </div>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#A7F3D0] font-bold">PRICE</span>
                        </div>

                        {/* Existing Leads */}
                        {[
                          { handle: "@rohan.dev", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80", time: "2h ago", clicked: true },
                          { handle: "@mark_k", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", time: "3h ago", clicked: true },
                          { handle: "@elena_ux", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", time: "5h ago", clicked: false },
                        ].map((lead, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between text-[11px]"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={lead.img}
                                alt={lead.handle}
                                className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                              />
                              <div>
                                <p className="font-bold text-white leading-tight">{lead.handle}</p>
                                <span className="text-[9px] text-[#8C8890]">{lead.time}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {lead.clicked && (
                                <span className="s4-clicked-badge text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-0.5">
                                  <CheckIcon className="w-2.5 h-2.5" />
                                  <span>Clicked</span>
                                </span>
                              )}
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.08] text-[#8C8890] font-bold">PRICE</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-around pt-2 border-t border-white/[0.08] text-[10px] text-[#8C8890]">
                      <span>Home</span>
                      <span>Automations</span>
                      <span className="text-[#10B981] font-bold">Leads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Flow Stepper Items
          ======================================================== */}
          <div className="lg:col-span-7 space-y-3.5 order-1 lg:order-2">
            {STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = activeStep === stepNumber;
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  onClick={() => selectStep(stepNumber)}
                  className={`group relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border-[#10B981]/60 bg-white/[0.04] shadow-lg shadow-[#10B981]/10"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-[#10B981]/30 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#10B981] text-black shadow-md shadow-[#10B981]/30"
                          : "bg-white/[0.04] border border-white/[0.08] text-[#8C8890] group-hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-base sm:text-lg font-bold transition-colors ${
                            isActive ? "text-white" : "text-[#E6E3E8]"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 transition-colors ${
                            isActive
                              ? "text-[#A7F3D0] bg-[#10B981]/20 border-[#10B981]/40"
                              : "text-[#8C8890] bg-white/[0.03] border-white/[0.08]"
                          }`}
                        >
                          {step.badge}
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs sm:text-sm text-[#8C8890] leading-relaxed">
                        {step.description}
                      </p>

                      {/* Progressive fill driven by left scene timeline */}
                      {isActive && (
                        <div className="mt-3.5 w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                          <div
                            style={{ width: `${Math.min(progress * 100, 100)}%` }}
                            className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-full rounded-full transition-all duration-75 ease-linear"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Stepper Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#8C8890]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => selectStep(activeStep > 1 ? activeStep - 1 : 4)}
                  className="px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#E6E3E8] hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => selectStep(activeStep < 4 ? activeStep + 1 : 1)}
                  className="px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#E6E3E8] hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAutoPlay(!autoPlay)}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C8890] hover:text-[#E6E3E8] transition-colors cursor-pointer"
              >
                {autoPlay ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>Auto-advancing</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-zinc-500" />
                    <span>Paused</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
