"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MinusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </svg>
  );
}

function ZapIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LayersIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function CrownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function MessageSquareIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BotIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="12" x="3" y="6" rx="2" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M12 2v4" />
    </svg>
  );
}

function UsersIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChartIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3v18h18" />
      <line x1="7" y1="17" x2="7" y2="13" />
      <line x1="12" y1="17" x2="12" y2="9" />
      <line x1="17" y1="17" x2="17" y2="5" />
    </svg>
  );
}

function ShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function RefreshIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function CardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  );
}

interface FeatureRow {
  name: string;
  essential: string | boolean;
  advanced: string | boolean;
  pro: string | boolean;
}

interface FeatureCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  features: FeatureRow[];
}

const COMPARISON_CATEGORIES: FeatureCategory[] = [
  {
    title: "Core Automation",
    icon: MessageSquareIcon,
    features: [
      {
        name: "Connected Instagram accounts",
        essential: "1 Account",
        advanced: "Up to 3",
        pro: "10+",
      },
      {
        name: "Comment-to-DM triggers",
        essential: true,
        advanced: true,
        pro: true,
      },
      {
        name: "Keyword & emoji triggers",
        essential: true,
        advanced: true,
        pro: true,
      },
      {
        name: "Story mention auto-replies",
        essential: false,
        advanced: true,
        pro: true,
      },
      {
        name: "Daily message volume",
        essential: "500 DMs/day",
        advanced: "2,500 DMs/day",
        pro: "Unlimited",
      },
      {
        name: "Works on Posts, Reels & Carousels",
        essential: true,
        advanced: true,
        pro: true,
      },
      {
        name: "Instant webhook delivery (<0.4s)",
        essential: true,
        advanced: true,
        pro: true,
      },
    ],
  },
  {
    title: "Smart AI & Variations",
    icon: BotIcon,
    features: [
      {
        name: "Smart AI dynamic answers",
        essential: false,
        advanced: "Standard AI",
        pro: "Advanced AI",
      },
      {
        name: "Public comment auto-replies",
        essential: false,
        advanced: true,
        pro: true,
      },
      {
        name: "Spam & troll comment protection",
        essential: false,
        advanced: true,
        pro: true,
      },
      {
        name: "Follow-up message sequences",
        essential: false,
        advanced: "2 steps",
        pro: "Unlimited",
      },
      {
        name: "Custom reply variations",
        essential: "3 variations",
        advanced: "10 variations",
        pro: "Unlimited",
      },
    ],
  },
  {
    title: "Analytics & Reporting",
    icon: ChartIcon,
    features: [
      {
        name: "Click & lead analytics dashboard",
        essential: "Basic",
        advanced: "Full Real-Time",
        pro: "Advanced Live",
      },
      {
        name: "Data export (CSV / PDF)",
        essential: "CSV",
        advanced: "CSV + PDF",
        pro: "CSV + PDF",
      },
    ],
  },
  {
    title: "Team & Support",
    icon: UsersIcon,
    features: [
      {
        name: "Team members",
        essential: "1",
        advanced: "3 seats",
        pro: "Unlimited",
      },
      {
        name: "Support level",
        essential: "Email Support",
        advanced: "Priority Support",
        pro: "Dedicated 24/7",
      },
    ],
  },
];

const PLAN_BULLETS: Record<"essential" | "advanced" | "pro", string[]> = {
  essential: [
    "1 Instagram account",
    "500 automated DMs per day",
    "Comment & keyword triggers",
    "3 reply variations",
  ],
  advanced: [
    "Up to 3 Instagram accounts",
    "2,500 automated DMs per day",
    "Standard AI answers",
    "2-step follow-up sequences",
  ],
  pro: [
    "10+ Instagram accounts",
    "Unlimited automated DMs",
    "Advanced AI answers",
    "Unlimited variations",
  ],
};

const TRUST_POINTS = [
  { label: "Official Meta Graph API", icon: ShieldIcon },
  { label: "Cancel anytime", icon: RefreshIcon },
  { label: "No credit card required to start", icon: CardIcon },
];

interface PlanCardProps {
  name: string;
  price: number;
  symbol: string;
  isYearly: boolean;
  bullets: string[];
  cta: string;
  icon: React.ComponentType<{ className?: string }>;
  featured?: boolean;
  chip?: string;
  className?: string;
}

function PlanCard({
  name,
  price,
  symbol,
  isYearly,
  bullets,
  cta,
  icon: Icon,
  featured = false,
  chip,
  className = "",
}: PlanCardProps) {
  return (
    <article
      className={`pricing-plan-card pricing-reveal group relative flex flex-col overflow-hidden rounded-[20px] border p-6 transition-[transform,border-color,background-color] duration-300 sm:p-7 motion-safe:hover:-translate-y-1 ${
        featured
          ? "border-[#059669] bg-white ring-2 ring-[#059669]/20 shadow-xl"
          : "border-[#D5EAE0] bg-white shadow-md hover:border-[#059669]/40"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          featured ? "via-[#10B981]/60" : "via-[#D5EAE0]"
        }`}
      />
      {featured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.15), transparent)" }}
        />
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border ${
                featured
                  ? "border-[#059669]/30 bg-[#E8F7F0] text-[#059669]"
                  : "border-[#D5EAE0] bg-[#F4FBF7] text-[#059669]"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <h3 className="text-[15px] font-bold tracking-[-0.01em] text-[#11271D]">
              {name}
            </h3>
          </div>
          {chip && (
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold leading-none ${
                featured
                  ? "border-transparent bg-[#059669] text-white"
                  : "border-[#059669]/30 bg-[#E8F7F0] text-[#059669]"
              }`}
            >
              {chip}
            </span>
          )}
        </div>

        <div className="mt-7 flex items-end gap-1.5">
          <span className="inline-flex items-baseline font-bold tabular-nums text-[#11271D]">
            <span className="mr-1 text-2xl font-semibold text-[#527060]">{symbol}</span>
            <span
              className="price-count text-[52px] leading-[0.9] tracking-[-0.035em] text-[#11271D]"
              data-value={price}
            >
              {price}
            </span>
          </span>
          <span className="pb-1.5 text-[13px] font-medium text-[#527060]">/ month</span>
        </div>
        <p className="mt-2.5 text-[11px] font-medium text-[#527060]">
          {isYearly ? "Billed yearly · save 20%" : "Billed monthly"}
        </p>

        <div className="mt-6 flex-1 border-t border-[#D5EAE0] pt-5">
          <ul className="space-y-2.5">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-[13px] leading-snug text-[#3B5D4D]">
                <CheckIcon className="mt-[1px] h-3.5 w-3.5 shrink-0 text-[#059669]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/login"
          className={`group/cta mt-6 inline-flex h-11 w-full items-center justify-center rounded-[12px] px-4 text-[12px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]/60 ${
            featured
              ? "bg-[#059669] text-white font-bold shadow-md shadow-[#059669]/20 hover:bg-[#047857]"
              : "border border-[#D5EAE0] bg-[#F4FBF7] text-[#11271D] hover:bg-white hover:border-[#059669]"
          }`}
        >
          {cta}
          <ArrowRightIcon className="ml-2 h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export function PricingSection() {
  const containerRef = useRef<HTMLElement>(null);
  const hasCountedRef = useRef(false);
  const priceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"INR" | "USD">("USD");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const lang = navigator.language || "";
      if (
        tz.includes("Kolkata") ||
        tz.includes("Calcutta") ||
        tz.includes("India") ||
        lang.includes("IN")
      ) {
        setCurrency("INR");
      }
    } catch {}

    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isIndia) {
          setCurrency("INR");
        } else if (data?.country && data.country !== "IN") {
          setCurrency("USD");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      priceTimelineRef.current?.kill();
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pricing-reveal", {
          opacity: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#pricing-plans-block",
            start: "top 82%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  const runPriceCount = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const figures = gsap.utils.toArray<HTMLElement>(".price-count", containerRef.current ?? undefined);
    priceTimelineRef.current?.kill();
    const tl = gsap.timeline();
    priceTimelineRef.current = tl;

    figures.forEach((figure, index) => {
      const target = Number(figure.dataset.value ?? 0);
      const counter = { value: 0 };
      const startAt = index * 0.06;

      figure.textContent = "0";

      tl.to(
        counter,
        {
          value: target + 5,
          duration: 0.55,
          ease: "power2.out",
          onUpdate: () => {
            figure.textContent = String(Math.round(counter.value));
          },
        },
        startAt
      )
        .to(
          counter,
          {
            value: target,
            duration: 0.45,
            ease: "power2.inOut",
            onUpdate: () => {
              figure.textContent = String(Math.round(counter.value));
            },
            onComplete: () => {
              figure.textContent = String(target);
            },
          },
          startAt + 0.55
        );
    });
  }, []);

  useEffect(() => {
    if (hasCountedRef.current) {
      runPriceCount();
      return;
    }

    const node = document.querySelector("#pricing-cards-grid");
    if (!node || typeof IntersectionObserver === "undefined") {
      runPriceCount();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          hasCountedRef.current = true;
          runPriceCount();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [billingCycle, currency, runPriceCount]);

  const isYearly = billingCycle === "yearly";
  const isINR = currency === "INR";
  const currencySymbol = isINR ? "₹" : "$";

  const essentialPrice = isINR
    ? isYearly ? 24 : 29
    : isYearly ? 15 : 19;

  const advancedPrice = isINR
    ? isYearly ? 49 : 59
    : isYearly ? 23 : 29;

  const proPrice = isINR
    ? isYearly ? 80 : 100
    : isYearly ? 39 : 49;

  const renderCellValue = (val: string | boolean, emphasize = false) => {
    if (typeof val === "boolean") {
      return val ? (
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-inset ${
            emphasize
              ? "bg-[#10B981]/30 text-[#A7F3D0] ring-[#10B981]/40"
              : "bg-[#10B981]/15 text-[#34D399] ring-[#10B981]/20"
          }`}
        >
          <CheckIcon className="h-3 w-3" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center text-[#6E6A73]">
          <MinusIcon className="h-3.5 w-3.5" />
        </span>
      );
    }
    return (
      <span
        className={`text-xs font-medium tabular-nums sm:text-[13px] ${
          emphasize ? "text-[#F4EFF6]" : "text-[#E6E3E8]"
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <section
      id="pricing"
      ref={containerRef}
      aria-labelledby="pricing-heading"
      className="relative w-full scroll-mt-24 overflow-hidden border-t border-[#D5EAE0] bg-[#F6FAF7] py-20 font-sans text-[#11271D] sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.08), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[380px] w-[760px] -translate-x-1/2 translate-y-1/3 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(5,150,105,0.05), transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-8 lg:mb-12 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h2
              id="pricing-heading"
              className="font-bebas text-4xl leading-[1.02] tracking-[-0.035em] text-[#11271D] sm:text-5xl lg:text-[52px]"
            >
              Pricing <span className="text-[#059669]">details</span>
            </h2>
            <p className="mt-3.5 font-inter text-sm leading-relaxed text-[#4E7361] sm:text-base">
              Pick the plan that fits your creator audience and start automating DMs in 60 seconds.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 lg:items-end">
            <div className="inline-flex flex-wrap items-center gap-1 rounded-[14px] border border-[#D5EAE0] bg-white p-1 shadow-sm">
              <div role="group" aria-label="Billing cycle" className="flex items-center">
                <button
                  type="button"
                  aria-pressed={!isYearly}
                  onClick={() => setBillingCycle("monthly")}
                  className={`h-9 rounded-[10px] px-3.5 text-xs font-semibold transition-colors duration-200 ${
                    !isYearly
                      ? "bg-[#059669] text-white font-bold shadow-sm"
                      : "text-[#527060] hover:bg-[#E8F7F0] hover:text-[#059669]"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  aria-pressed={isYearly}
                  onClick={() => setBillingCycle("yearly")}
                  className={`flex h-9 items-center gap-1.5 rounded-[10px] px-3.5 text-xs font-semibold transition-colors duration-200 ${
                    isYearly
                      ? "bg-[#059669] text-white font-bold shadow-sm"
                      : "text-[#527060] hover:bg-[#E8F7F0] hover:text-[#059669]"
                  }`}
                >
                  <span>Yearly</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                      isYearly ? "bg-black/20 text-black font-bold" : "bg-[#10B981]/20 text-[#A7F3D0]"
                    }`}
                  >
                    20% off
                  </span>
                </button>
              </div>

              <span aria-hidden="true" className="mx-1 h-5 w-px bg-white/[0.08]" />

              <div role="group" aria-label="Currency" className="flex items-center">
                <button
                  type="button"
                  aria-pressed={isINR}
                  onClick={() => setCurrency("INR")}
                  className={`h-9 rounded-[10px] px-3 text-xs font-semibold transition-colors duration-200 ${
                    isINR
                      ? "bg-[#059669] text-white font-bold shadow-sm"
                      : "text-[#527060] hover:bg-[#E8F7F0] hover:text-[#059669]"
                  }`}
                >
                  <span>₹ INR</span>
                </button>
                <button
                  type="button"
                  aria-pressed={!isINR}
                  onClick={() => setCurrency("USD")}
                  className={`h-9 rounded-[10px] px-3 text-xs font-semibold transition-colors duration-200 ${
                    !isINR
                      ? "bg-[#059669] text-white font-bold shadow-sm"
                      : "text-[#527060] hover:bg-[#E8F7F0] hover:text-[#059669]"
                  }`}
                >
                  <span>$ USD</span>
                </button>
              </div>
            </div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#A49AAE] lg:text-right">
              Prices in {isINR ? "INR" : "USD"} · {isYearly ? "billed yearly, save 20%" : "billed monthly"}
            </p>
            <p role="status" aria-live="polite" className="sr-only">
              {`Prices updated to ${isINR ? "Indian rupees" : "US dollars"}, billed ${
                isYearly ? "yearly with 20 percent off" : "monthly"
              }.`}
            </p>
          </div>
        </div>

        <div id="pricing-plans-block">
          <div className="pricing-reveal relative mb-6 overflow-hidden rounded-[20px] border border-[#D5EAE0] bg-white p-6 shadow-md">
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-40 sm:block">
              <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
                <circle cx="140" cy="140" r="58" stroke="#34D399" strokeOpacity="0.35" />
                <circle cx="140" cy="140" r="92" stroke="#10B981" strokeOpacity="0.32" />
                <circle cx="140" cy="140" r="126" stroke="#059669" strokeOpacity="0.2" />
                <circle cx="140" cy="140" r="30" stroke="#6EE7B7" strokeOpacity="0.45" strokeDasharray="3 5" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_1px_6px_rgba(16,185,129,0.4)]" />
                  Early Bird · Free Creator Access
                </p>
                <p className="mt-2 flex items-baseline gap-2 text-[#059669]">
                  <span className="text-[40px] font-bold leading-none tracking-[-0.04em] tabular-nums text-[#059669]">
                    100%
                  </span>
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#11271D]">
                    free
                  </span>
                </p>
              </div>

              <p className="max-w-xl text-[13px] leading-relaxed text-[#4E7361] sm:text-right">
                Open edition. Connect your account and deploy automated replies on autopilot.
              </p>
            </div>
          </div>

          <div id="pricing-cards-grid" className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <PlanCard
              name="Essential Plan"
              price={essentialPrice}
              symbol={currencySymbol}
              isYearly={isYearly}
              bullets={PLAN_BULLETS.essential}
              cta="Basic Access"
              icon={ZapIcon}
            />
            <PlanCard
              name="Advanced Plan"
              price={advancedPrice}
              symbol={currencySymbol}
              isYearly={isYearly}
              bullets={PLAN_BULLETS.advanced}
              cta="Premium Access"
              icon={LayersIcon}
              featured
              chip="Trending"
            />
            <PlanCard
              name="Pro Plan"
              price={proPrice}
              symbol={currencySymbol}
              isYearly={isYearly}
              bullets={PLAN_BULLETS.pro}
              cta="Elite Access"
              icon={CrownIcon}
              chip="First 100 users"
              className="sm:col-span-2 sm:mx-auto sm:w-[calc(50%-12px)] lg:col-span-1 lg:mx-0 lg:w-full"
            />
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {TRUST_POINTS.map((point) => {
              const PointIcon = point.icon;
              return (
                <span key={point.label} className="inline-flex items-center gap-2 text-[11px] font-medium text-[#84938A]">
                  <PointIcon className="h-3.5 w-3.5 text-[#10B981]" />
                </span>
              );
            })}
          </div>
        </div>

        <div className="mt-16 space-y-9 sm:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-bebas text-2xl tracking-[-0.03em] text-[#F4EFF6] sm:text-[28px]">
                Compare every detail
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <p className="text-[13px] text-[#B8B1C0]">
                  Every capability, side by side.
                </p>
                <span className="inline-flex items-center gap-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-[#8C8890] sm:hidden">
                  Swipe to compare
                  <ArrowRightIcon className="h-3 w-3" />
                </span>
              </div>
            </div>
            <span className="hidden items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#84938A] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              Advanced highlighted
            </span>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0E0C12] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="pricing-scroll overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">
                  Full comparison of Essential, Advanced and Pro plans
                </caption>
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#130E1A]">
                    <th
                      scope="col"
                      className="sticky left-0 z-30 w-[33%] border-r border-white/[0.06] bg-[#130E1A] px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A49AAE]"
                    >
                      What&apos;s included
                    </th>
                    <th
                      scope="col"
                      className="w-[22.33%] px-4 py-4 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A49AAE]"
                    >
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <ZapIcon className="h-3.5 w-3.5 text-[#8C8890]" />
                        Essential
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="w-[22.33%] border-x border-[#10B981]/25 bg-[#10B981]/[0.1] px-4 py-4 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A7F3D0]"
                    >
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <LayersIcon className="h-3.5 w-3.5" />
                        Advanced
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="w-[22.33%] px-4 py-4 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A49AAE]"
                    >
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <CrownIcon className="h-3.5 w-3.5 text-[#8C8890]" />
                        Pro
                      </span>
                    </th>
                  </tr>
                </thead>
                {COMPARISON_CATEGORIES.map((category, categoryIndex) => {
                  const CategoryIcon = category.icon;
                  return (
                    <tbody key={category.title}>
                      <tr>
                        <th
                          scope="rowgroup"
                          className={`sticky left-0 z-20 w-[33%] border-r border-white/[0.05] bg-[#0B0810] px-5 py-3 text-left ${categoryIndex === 0 ? "" : "border-t border-white/[0.08]"}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border border-white/[0.08] bg-white/[0.04] text-[#10B981]">
                              <CategoryIcon className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-[12px] font-semibold tracking-[-0.01em] text-[#E6E3E8]">
                              {category.title}
                            </span>
                          </div>
                        </th>
                        <td
                          colSpan={3}
                          className={`bg-[#0B0810] px-5 py-3 ${categoryIndex === 0 ? "" : "border-t border-white/[0.08]"}`}
                        >
                          <div className="flex items-center gap-3">
                            <span aria-hidden="true" className="h-px flex-1 bg-white/[0.06]" />
                            <span className="shrink-0 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-[#8C8890]">
                              {category.features.length} features
                            </span>
                          </div>
                        </td>
                      </tr>
                      {category.features.map((feature) => (
                        <tr
                          key={feature.name}
                          className="group border-t border-white/[0.055] transition-colors duration-200 hover:bg-[#10B981]/[0.035]"
                        >
                          <th
                            scope="row"
                            className="sticky left-0 z-10 border-r border-white/[0.05] bg-[#0E0C12] px-5 py-3.5 text-left text-xs font-medium text-[#E6E3E8] transition-colors duration-200 group-hover:bg-[#120D18] sm:text-[13px]"
                          >
                            {feature.name}
                          </th>
                          <td className="px-4 py-3.5 text-center">
                            {renderCellValue(feature.essential)}
                          </td>
                          <td className="border-x border-[#10B981]/15 bg-[#10B981]/[0.055] px-4 py-3.5 text-center">
                            {renderCellValue(feature.advanced, true)}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {renderCellValue(feature.pro)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
