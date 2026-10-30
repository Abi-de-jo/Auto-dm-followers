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
    subtitle: "Required by Meta's Official Instagram Graph API",
    description:
      "Open Instagram Settings > Account Type and switch to Creator or Business. It is 100% free and takes 10 seconds. This unlocks official API permissions for automated direct messaging.",
    icon: SlidersIcon,
    timeEst: "10 sec",
  },
  {
    id: 2,
    badge: "STEP 02",
    shortName: "Connect Meta",
    title: "Authorize via Official Meta Login",
    subtitle: "End-to-end OAuth 2.0 security dialog",
    description:
      "Tap connect, allow access for @codebyabi in seconds through official authorization. No password needed, safe and secure.",
    icon: InstagramIcon,
    timeEst: "20 sec",
  },
  {
    id: 3,
    badge: "STEP 03",
    shortName: "Permissions",
    title: "Enable Messaging Permissions",
    subtitle: "Comment reading and DM dispatch capabilities",
    description:
      "Check the permissions box for 'Manage Comments' and 'Send Direct Messages'. AutoDM strictly complies with Meta's developer policies and only triggers actions when requested.",
    icon: ShieldCheckIcon,
    timeEst: "15 sec",
  },
  {
    id: 4,
    badge: "STEP 04",
    shortName: "Automate",
    title: "Ready to Automate on Autopilot",
    subtitle: "Create keyword rules and start replying",
    description:
      "Pick any Reel or post, type your keyword (e.g. 'PRICE' or 'LINK'), and write your automated reply. AutoDM begins listening and replying to followers 24/7.",
    icon: CheckCircleIcon,
    timeEst: "15 sec",
  },
];

export function HowToConnectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftStickyRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  const lenis = useLenis();

  const handleStepJump = (stepId: number) => {
    setActiveStep(stepId);
    const targetEl = document.getElementById(`step-card-${stepId}`);
    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -120, duration: 1.1 });
      } else {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(".step-parallax-card");

      cards.forEach((card, index) => {
        const stepNum = index + 1;
        const watermark = card.querySelector(".step-watermark");

        if (watermark) {
          gsap.fromTo(
            watermark,
            { y: -30, opacity: 0.04 },
            {
              y: 30,
              opacity: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }

        ScrollTrigger.create({
          trigger: card,
          start: "top center+=80",
          end: "bottom center",
          onEnter: () => updateProgress(stepNum),
          onEnterBack: () => updateProgress(stepNum),
        });
      });

      function updateProgress(step: number) {
        setActiveStep(step);
        const percent = Math.round((step / 4) * 100);

        if (progressBarRef.current) {
          gsap.to(progressBarRef.current, {
            width: `${percent}%`,
            duration: 0.4,
            ease: "power2.out",
          });
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${percent}%`;
        }
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      id="how-to-connect"
      ref={containerRef}
      className="relative w-full bg-[#F6FAF7] py-20 sm:py-28 lg:py-32 overflow-clip font-sans border-t border-[#D5EAE0] select-none text-[#11271D]"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Sticky Progress Column */}
          <div
            ref={leftStickyRef}
            className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 text-left"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#059669]/30 bg-[#E8F7F0] px-3 py-1 text-xs font-semibold text-[#059669] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>FAST 60-SECOND ONBOARDING</span>
              </div>

              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-[52px] tracking-[-0.035em] leading-[1.02] text-[#11271D]">
                How to <span className="text-[#059669]">Connect</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-[#4E7361] leading-relaxed">
                Connect your account in four simple steps through official Meta authorization dialogs. No passwords, no risk, active in 60 seconds.
              </p>
            </div>

            {/* Setup Progress Card */}
            <div className="rounded-[24px] bg-white border border-[#D5EAE0] p-6 sm:p-7 shadow-lg shadow-[#059669]/5 hover:border-[#059669]/40 transition-all duration-300 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-lg sm:text-xl font-bold text-[#11271D] tracking-tight">
                  Live Setup Tracker
                </h3>
                <span className="text-xs font-mono font-bold text-[#059669] bg-[#E8F7F0] border border-[#10B981]/30 px-2.5 py-0.5 rounded-full">
                  STEP 0{activeStep} / 04
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#527060]">
                  <span>SETUP PROGRESS</span>
                  <span ref={progressTextRef} className="text-[#11271D] font-bold">25%</span>
                </div>
                <div className="h-2 w-full bg-[#E2F2E9] rounded-full overflow-hidden relative">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-[#059669] via-[#10B981] to-[#34D399] rounded-full"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>

              {/* Step Navigation Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {STEPS.map((step) => {
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepJump(step.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                        isActive
                          ? "bg-[#E8F7F0] border-[#059669] text-[#059669] font-bold shadow-sm"
                          : "bg-[#F8FCF9] border-[#D5EAE0] hover:bg-white text-[#527060]"
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-mono text-[#4E7361]">
                        0{step.id}
                      </span>
                      <span className="block text-[11px] font-semibold truncate text-[#11271D]">
                        {step.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#D5EAE0] flex items-center justify-between text-xs text-[#527060]">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Meta Verified • Zero Passwords</span>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#059669] hover:underline font-bold shrink-0"
                >
                  <span>Connect</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Step Cards */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  id={`step-card-${step.id}`}
                  className={`step-parallax-card relative rounded-[24px] p-6 sm:p-8 bg-white border shadow-md transition-all duration-300 text-left ${
                    isActive ? "border-[#059669] ring-2 ring-[#059669]/20 shadow-xl" : "border-[#D5EAE0]"
                  }`}
                >
                  <span className="step-watermark absolute -right-3 -bottom-7 font-bebas text-[140px] sm:text-[170px] leading-none text-[#059669]/[0.06] select-none pointer-events-none font-bold">
                    0{step.id}
                  </span>

                  <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#D5EAE0]">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#059669] flex items-center justify-center text-white font-mono text-xs font-bold shadow-md shadow-[#059669]/25">
                        0{step.id}
                      </div>
                      <span className="text-[10.5px] font-bold tracking-wider font-mono text-[#059669] uppercase px-2.5 py-0.5 rounded-full bg-[#E8F7F0] border border-[#10B981]/30">
                        {step.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono font-medium text-[#527060]">
                        ⏱ {step.timeEst}
                      </span>
                      <div className="h-8 w-8 rounded-lg bg-[#E8F7F0] border border-[#D5EAE0] flex items-center justify-center text-[#059669]">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 mt-4">
                    <h3 className="text-xl sm:text-[22px] font-bold text-[#11271D] tracking-tight leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-semibold text-[#059669]">
                      {step.subtitle}
                    </p>
                    <p className="text-sm text-[#4E7361] leading-relaxed pt-1">
                      {step.description}
                    </p>

                    {/* Step Visual Elements */}
                    {step.id === 1 && (
                      <div className="mt-4 p-3.5 rounded-xl bg-[#F4FBF7] border border-[#D5EAE0] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src="/avatars/owner.png"
                            alt="codebyabi"
                            className="w-9 h-9 rounded-full object-cover border border-[#059669]"
                          />
                          <div>
                            <span className="text-[12px] font-bold text-[#11271D] block">Instagram Creator Account</span>
                            <span className="text-[11px] text-[#527060]">@codebyabi (Verified Creator)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#059669]">Active</span>
                          <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                        </div>
                      </div>
                    )}

                    {step.id === 2 && (
                      <div className="mt-4 p-3.5 rounded-xl bg-[#F4FBF7] border border-[#D5EAE0] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center text-white">
                            <InstagramIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[12px] font-bold text-[#11271D] block">Meta Official OAuth 2.0</span>
                            <span className="text-[11px] text-[#059669]">Encrypted Token Security</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#E8F7F0] px-2 py-0.5 rounded-md">
                          Verified
                        </span>
                      </div>
                    )}

                    {step.id === 3 && (
                      <div className="mt-4 grid grid-cols-2 gap-2.5">
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F4FBF7] border border-[#D5EAE0]">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                          <span className="text-[11px] font-semibold text-[#11271D] truncate">Read Comments</span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F4FBF7] border border-[#D5EAE0]">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                          <span className="text-[11px] font-semibold text-[#11271D] truncate">Send Direct Replies</span>
                        </div>
                      </div>
                    )}

                    {step.id === 4 && (
                      <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-[#E8F7F0] border border-[#10B981]/30">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] animate-ping" />
                          <div>
                            <span className="text-[11px] font-bold text-[#11271D] block">AutoDM Automation Engine</span>
                            <span className="text-[10px] text-[#059669]">Listening for keyword triggers 24/7</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#059669] bg-white px-2 py-0.5 rounded border border-[#10B981]/30">
                          Ready
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-16 sm:mt-20 p-6 sm:p-8 rounded-[24px] bg-white border border-[#D5EAE0] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-bebas text-2xl sm:text-3xl text-[#11271D] tracking-wide">
              Ready to Connect in 60 Seconds?
            </h4>
            <p className="text-xs sm:text-sm text-[#4E7361]">
              Free open Instagram automation. No credit card required.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-inter text-xs sm:text-sm font-bold shadow-md shadow-[#059669]/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
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
