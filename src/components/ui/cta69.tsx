"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface Cta69Labels {
  marqueePhrase?: string;
  note?: string;
  footnote?: string;
}

interface Cta69Props {
  badge?: Badge;
  heading?: string;
  button?: ActionButton;
  labels?: Cta69Labels;
  className?: string;
}

const REPEATS = 8;

export function Cta69({
  badge,
  heading,
  button,
  labels = {},
  className,
}: Cta69Props) {
  const marqueePhrase = labels.marqueePhrase;
  const marqueeLine = marqueePhrase
    ? `${marqueePhrase} · `.repeat(REPEATS)
    : "";
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
    <section
      ref={sectionRef}
      id="cta"
      className={cn(
        "relative overflow-hidden bg-[#0A080C] py-20 sm:py-28 lg:py-32 w-full border-t border-white/[0.08] select-none text-[#E6E3E8]",
        className
      )}
    >
      <style jsx>{`
        @keyframes cta69-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Ambient Violet Glow Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[350px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(122,34,176,0.16), transparent)" }}
      />

      {/* Giant scrolling backdrop marquee in brand typography */}
      {marqueePhrase && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none"
        >
          <div
            className="flex w-max shrink-0 animate-[cta69-marquee_45s_linear_infinite] whitespace-nowrap text-[#7A22B0]/[0.06]"
            style={{ animationPlayState: marqueeActive ? "running" : "paused" }}
          >
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="font-bebas text-[24vw] md:text-[18vw] font-bold leading-none tracking-normal uppercase"
              >
                {marqueeLine}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Centered statement content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center md:px-6">
        {badge && (
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7A22B0]/35 bg-[#7A22B0]/15 px-4 py-1.5 text-xs font-semibold text-[#D8B4FE] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A24BE0] animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px]">{badge.label}</span>
          </div>
        )}

        {heading && (
          <h2 className="mt-8 font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.02] tracking-[-0.04em] text-[#E6E3E8] text-balance">
            {heading}
          </h2>
        )}

        {labels.note && (
          <p className="mt-5 max-w-xl text-balance font-inter text-sm sm:text-base md:text-lg text-[#8C8890] leading-relaxed">
            {labels.note}
          </p>
        )}

        {button && (
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full">
            <Link
              href={button.href}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-[14px] bg-[#10B981] text-black font-inter text-[14px] font-semibold transition-all hover:bg-[#059669] hover:text-white active:scale-[0.98] shadow-lg shadow-[#10B981]/25"
            >
              <span>{button.label}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link
              href={button.href}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-[14px] bg-[#7A22B0] hover:bg-[#8E2CCB] text-white font-inter text-[14px] font-semibold shadow-[0_12px_32px_rgba(122,34,176,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{button.label}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        )}

        {labels.footnote && (
          <p className="mt-7 font-inter text-xs text-[#8C8890]">
            {labels.footnote}
          </p>
        )}
      </div>
    </section>
  );
}

export default Cta69;
