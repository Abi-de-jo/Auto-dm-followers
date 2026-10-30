"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  Eye,
  Flame,
  Heart,
  MessageCircle,
  Play,
  X,
  Zap,
} from "lucide-react";
import styles from "./problem-section.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const challenges = [
  {
    step: "01",
    tag: "Views",
    title: "Views that don’t convert",
    description:
      "Your videos get views, but no real engagement, lead capture, or business impact.",
    insight:
      "Views alone don’t build a business — without automated triggers, 99.8% leave forever.",
    icon: Eye,
    label: "Content performance",
  },
  {
    step: "02",
    tag: "Likes",
    title: "Likes don’t pay the bills",
    description:
      "Viral moments feel good, but without automated comment capture they don’t build a sustainable audience.",
    insight:
      "Likes are vanity metrics. Automatic private replies turn passive double-taps into conversions.",
    icon: Heart,
    label: "Engagement & growth",
  },
  {
    step: "03",
    tag: "System",
    title: "No system, no consistency",
    description:
      "Posting randomly without a system leads to inconsistent results and no real growth.",
    insight:
      "Consistency isn’t posting daily — it’s having a system that converts traffic 24/7.",
    icon: CalendarDays,
    label: "Posting activity",
  },
];

function CountUp({
  value,
  decimals = 0,
  suffix = "",
  play,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  play: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (next: number) =>
    `${next.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      !play ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      element.textContent = format(value);
      return;
    }

    const state = { value: 0 };
    const tween = gsap.to(state, {
      value,
      duration: 1.15,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = format(state.value);
      },
    });

    return () => {
      tween.kill();
    };
  }, [decimals, play, suffix, value]);

  return <span ref={ref}>{format(value)}</span>;
}

function ViewsExample({ play }: { play: boolean }) {
  const barsData = [
    { month: "JAN", height: 120 },
    { month: "FEB", height: 108 },
    { month: "MAR", height: 96 },
    { month: "APR", height: 82 },
    { month: "MAY", height: 68 },
    { month: "JUN", height: 56 },
  ];

  return (
    <div className={styles.views}>
      <div className={styles.metricRow}>
        <div className={styles.metricGroup}>
          <div className={styles.metricHeader}>
            <strong className={styles.metric}>
              <CountUp value={120} suffix="K" play={play} />
            </strong>
            <span className={styles.metricBadge}>Per Month</span>
          </div>
          <span className={styles.metricLabel}>Total Reach Potential</span>
        </div>
        <div className={styles.drop}>
          <div className={styles.dropBadge}>
            <ArrowDownRight size={16} aria-hidden="true" />
            <span>50%</span>
          </div>
          <div className={styles.dropText}>
            <strong>Audience Drop-off</strong>
            <small>60K viewers lost monthly</small>
          </div>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <div className={styles.chartLeakTag}>
          <span className={styles.leakDot} />
          <span>99.8% Viewers Leave Without DM</span>
        </div>

        <svg
          className={styles.chart}
          viewBox="0 0 480 180"
          role="img"
          aria-label="Monthly views decline from January to June"
        >
          <defs>
            <linearGradient id="problem-bars" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#a24be0" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#7a22b0" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="problem-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a24be0" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7a22b0" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[30, 75, 120].map((y) => (
            <line
              key={y}
              x1="20"
              y1={y}
              x2="460"
              y2={y}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeDasharray="3 3"
            />
          ))}

          <path
            className={styles.area}
            d="M50 26 C85 30 96 34 126 38 S178 46 202 50 S255 59 278 64 S332 74 354 78 S405 86 430 92 L430 145 L50 145 Z"
            fill="url(#problem-area)"
          />

          {barsData.map((bar, index) => (
            <g key={bar.month} className={styles.barGroup}>
              <rect
                className={styles.bar}
                x={35 + index * 76}
                y={145 - bar.height}
                width="30"
                height={bar.height}
                rx="6"
                fill="url(#problem-bars)"
                style={{ animationDelay: `${index * 55}ms` }}
              />
            </g>
          ))}

          <path
            className={styles.trend}
            pathLength={1}
            d="M50 26 C85 30 96 34 126 38 S178 46 202 50 S255 59 278 64 S332 74 354 78 S405 86 430 92"
            fill="none"
            stroke="#d8b4fe"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <circle
            cx="430"
            cy="92"
            r="5"
            fill="#f43f5e"
            stroke="#130e1a"
            strokeWidth="2.5"
          />
          <circle
            className={styles.leakRing}
            cx="430"
            cy="92"
            r="5"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="1"
          />

          {barsData.map((bar, index) => (
            <text
              key={bar.month}
              x={50 + index * 76}
              y="166"
              textAnchor="middle"
              className={index === 5 ? styles.monthActive : styles.monthText}
            >
              {bar.month}
            </text>
          ))}
        </svg>
      </div>

      <div className={styles.leakGrid}>
        <div className={styles.leakCard}>
          <div className={styles.leakCardHeader}>
            <Eye size={13} className="text-[#A24BE0]" />
            <span>Monthly Views</span>
          </div>
          <strong>
            <CountUp value={120400} play={play} />
          </strong>
          <div className={styles.meterBar}>
            <div className={styles.meterFillViews} />
          </div>
        </div>
        <div className={styles.leakCardAlert}>
          <div className={styles.leakCardHeader}>
            <AlertTriangle size={13} className="text-rose-400" />
            <span>Captured Leads</span>
          </div>
          <strong className="text-rose-400">0 Leads (0%)</strong>
          <div className={styles.meterBar}>
            <div className={styles.meterFillZero} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EngagementExample({ play }: { play: boolean }) {
  return (
    <div className={styles.engagement}>
      <div className={styles.engagementMetrics}>
        <div className={styles.metricGroup}>
          <div className={styles.metricHeader}>
            <strong className={styles.metric}>
              <CountUp value={88.4} decimals={1} suffix="K" play={play} />
            </strong>
            <span className={styles.metricBadge}>Total Likes</span>
          </div>
          <span className={styles.metricLabel}>High Engagement</span>
        </div>
        <div className={styles.metricGroup}>
          <div className={styles.metricHeader}>
            <strong className={`${styles.metric} ${styles.metricAlert}`}>
              <CountUp value={0.3} decimals={1} play={play} />
              <span className={styles.metricSuffix}>%</span>
            </strong>
            <span className={styles.leakBadgeSmall}>Stalled</span>
          </div>
          <span className={styles.metricLabel}>Profile Conversion</span>
        </div>
      </div>

      <div className={styles.pipeline}>
        <div className={styles.pipeStep}>
          <div className={styles.pipeIconSuccess}>
            <Play size={18} fill="currentColor" aria-hidden="true" />
          </div>
          <span className={styles.pipeTitle}>Reel Viewed</span>
          <span className={styles.pipeStat}>120K views</span>
        </div>

        <div className={styles.pipeConnectorActive} />

        <div className={styles.pipeStep}>
          <div className={styles.pipeIconSuccess}>
            <Heart
              size={18}
              fill="#f43f5e"
              className="text-rose-500"
              aria-hidden="true"
            />
          </div>
          <span className={styles.pipeTitle}>Reel Liked</span>
          <span className={styles.pipeStat}>88.4K double-taps</span>
        </div>

        <div className={styles.pipeConnectorBroken}>
          <div className={styles.brokenLine} />
          <span className={styles.brokenTag}>Drop-off</span>
        </div>

        <div className={styles.pipeStepBroken}>
          <div className={styles.pipeIconBroken}>
            <MessageCircle size={18} aria-hidden="true" />
          </div>
          <span className={styles.pipeTitle}>No Reply</span>
          <span className={styles.pipeStatAlert}>0 DMs Sent</span>
        </div>
      </div>

      <div className={styles.compareBanner}>
        <div className={styles.compareLeft}>
          <span className={styles.compareTagManual}>Manual Creator</span>
          <p>
            Double taps don’t put links into inboxes. Manual replying takes
            hours and drops leads.
          </p>
        </div>
        <div className={styles.compareRight}>
          <span className={styles.compareTagFresh}>FreshDM Autopilot</span>
          <p>
            Every comment receives a DM in 0.4s with your link, turning casual
            likers into buyers.
          </p>
        </div>
      </div>
    </div>
  );
}

function ConsistencyExample({ play }: { play: boolean }) {
  const days = [
    { day: "MON", posted: false, dms: 0 },
    { day: "TUE", posted: true, dms: "1.2K" },
    { day: "WED", posted: true, dms: "890" },
    { day: "THU", posted: false, dms: 0 },
    { day: "FRI", posted: false, dms: 0 },
    { day: "SAT", posted: true, dms: "450" },
    { day: "SUN", posted: false, dms: 0 },
  ];

  return (
    <div className={styles.consistency}>
      <div className={styles.metricRow}>
        <div className={styles.metricGroup}>
          <div className={styles.metricHeader}>
            <strong className={styles.metric}>
              <CountUp value={3} play={play} />
              <span className={styles.metricSuffix}> / 7</span>
            </strong>
            <span className={styles.metricBadge}>Days Active</span>
          </div>
          <span className={styles.metricLabel}>Inconsistent Schedule</span>
        </div>
        <div className={styles.drop}>
          <div className={styles.dropBadgeAmber}>
            <Flame size={15} className="text-amber-400" />
            <span>4 Days Idle</span>
          </div>
          <div className={styles.dropText}>
            <strong>Zero Lead Capture</strong>
            <small>Traffic wasted while offline</small>
          </div>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        {days.map((item, index) => (
          <div
            key={item.day}
            className={
              item.posted ? styles.calendarDayActive : styles.calendarDayMissed
            }
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <span className={styles.dayName}>{item.day}</span>
            <div className={styles.dayIconBox}>
              {item.posted ? (
                <Check size={16} strokeWidth={2.5} className="text-white" />
              ) : (
                <X
                  size={14}
                  strokeWidth={2}
                  className="text-[#8C8890]/50"
                />
              )}
            </div>
            <span
              className={
                item.posted ? styles.dayDmsActive : styles.dayDmsMissed
              }
            >
              {item.posted ? `${item.dms} DMs` : "0 DMs"}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.autopilotWidget}>
        <div className={styles.autopilotHeader}>
          <div className={styles.autopilotPulse}>
            <span className={styles.liveIndicator} />
            <Zap size={14} className="text-[#A24BE0]" />
            <strong>24/7 Conversion Loop</strong>
          </div>
          <span className={styles.autopilotTag}>Never Miss a Lead</span>
        </div>
        <p className={styles.autopilotDesc}>
          Even on the 4 days you didn&apos;t post, FreshDM continues replying to
          past viral Reels while you sleep.
        </p>
      </div>
    </div>
  );
}

export function ProblemSection() {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "80px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".problem-reveal", {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        });

        gsap.from(".problem-tab", {
          opacity: 0,
          y: 18,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 74%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const changeTab = (event: React.KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (index + 1) % challenges.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (index + challenges.length - 1) % challenges.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = challenges.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const ActiveIcon = challenges[active].icon;

  return (
    <section
      id="problem-section"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="problem-heading"
      data-onscreen={onScreen ? "true" : "false"}
    >
      <div className={styles.inner}>
        <div className={`${styles.header} problem-reveal`}>
          <h2 id="problem-heading">
            Great content,{" "}
            <span className={styles.headingAccent}>but no real growth?</span>
          </h2>
          <div className={styles.headerAside}>
            <p>
              You&apos;re spending hours creating videos, but the results just
              don&apos;t match the effort. The problem isn&apos;t your content
              — it&apos;s what happens after people hit play.
            </p>
            <div className={styles.headerMeta}>
              <span>
                <span className={styles.metaDot} aria-hidden="true" />
                3 growth leaks
              </span>
              <span aria-hidden="true" className={styles.metaDivider} />
              <span>
                <span className={styles.metaDot} aria-hidden="true" />
                0.4s auto-reply fix
              </span>
            </div>
          </div>
        </div>

        <div className={styles.workspace}>
          <div
            className={styles.challenges}
            role="tablist"
            aria-label="Growth challenges"
            aria-orientation="vertical"
          >
            {challenges.map((challenge, index) => {
              const isSelected = index === active;
              const Icon = challenge.icon;
              return (
                <button
                  key={challenge.title}
                  ref={(element) => {
                    tabs.current[index] = element;
                  }}
                  id={`problem-tab-${index}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls="problem-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => changeTab(event, index)}
                  className={`${styles.challenge} problem-tab`}
                >
                  <div className={styles.challengeHeader}>
                    <span className={styles.challengeIcon}>
                      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className={styles.challengeBadge}>
                      <span className={styles.badgeNum}>
                        {challenge.step}
                      </span>
                      <span aria-hidden="true" className={styles.badgeSlash}>
                        /
                      </span>
                      <span>{challenge.tag}</span>
                    </span>
                    <span className={styles.challengeState} aria-hidden="true">
                      {isSelected ? (
                        <>
                          <span
                            className={styles.stateDot}
                            aria-hidden="true"
                          />
                          Viewing
                        </>
                      ) : (
                        <ArrowRight size={14} aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <div className={styles.challengeCopy}>
                    <strong>{challenge.title}</strong>
                    <p>{challenge.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            ref={panelRef}
            id="problem-panel"
            className={`${styles.panel} ${entered ? styles.live : ""} problem-reveal`}
            role="tabpanel"
            aria-labelledby={`problem-tab-${active}`}
            tabIndex={0}
          >
            <span aria-hidden="true" className={`${styles.corner} ${styles.cornerTL}`} />
            <span aria-hidden="true" className={`${styles.corner} ${styles.cornerTR}`} />
            <span aria-hidden="true" className={`${styles.corner} ${styles.cornerBL}`} />
            <span aria-hidden="true" className={`${styles.corner} ${styles.cornerBR}`} />

            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                <span className={styles.panelIcon}>
                  <ActiveIcon size={14} strokeWidth={1.8} aria-hidden="true" />
                </span>
                {challenges[active].label}
              </span>
              <span className={styles.panelMeta}>
                <span className={styles.panelMetaDot} aria-hidden="true" />
                Example analytics
              </span>
            </div>

            <div
              key={active}
              className={`${styles.panelContent} ${styles.panelEnter}`}
            >
              {active === 0 ? (
                <ViewsExample play={entered} />
              ) : active === 1 ? (
                <EngagementExample play={entered} />
              ) : (
                <ConsistencyExample play={entered} />
              )}
            </div>

            <div className={styles.panelInsight}>
              <AlertTriangle size={14} aria-hidden="true" />
              <span>{challenges[active].insight}</span>
            </div>
          </div>
        </div>

        <div className={`${styles.footer} problem-reveal`}>
          <p>Turn every like into a conversation.</p>
          <a href="#how-it-works">
            See how FreshDM works
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
