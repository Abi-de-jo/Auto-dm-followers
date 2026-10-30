"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/chart-colors";

const EASE = [0.16, 1, 0.3, 1] as const;

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 720,
  className,
  compact = false,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = React.useState(reduced ? value : 0);

  React.useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const from = display;
    const delta = value - from;
    if (delta === 0) return;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(from + delta * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, reduced]);

  const formatted = compact && Math.abs(display) >= 10000
    ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(display)
    : display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function LiveDot({
  tone = "violet",
  size = "md",
  className,
}: {
  tone?: "violet" | "success" | "warning" | "danger" | "muted";
  size?: "sm" | "md";
  className?: string;
}) {
  const colors = {
    violet: "bg-[#A24BE0] shadow-[0_1px_6px_rgba(162,75,224,0.5)]",
    success: "bg-emerald-400 shadow-[0_1px_6px_rgba(52,211,153,0.45)]",
    warning: "bg-amber-400 shadow-[0_1px_6px_rgba(251,191,36,0.45)]",
    danger: "bg-rose-400 shadow-[0_1px_6px_rgba(251,113,133,0.45)]",
    muted: "bg-white/25",
  } as const;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 rounded-full",
        size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
        colors[tone],
        className
      )}
    >
      {tone !== "muted" && (
        <span
          className={cn(
            "absolute inset-0 rounded-full motion-safe:animate-ping",
            tone === "violet" && "bg-[#A24BE0]/40",
            tone === "success" && "bg-emerald-400/35",
            tone === "warning" && "bg-amber-400/35",
            tone === "danger" && "bg-rose-400/35"
          )}
        />
      )}
    </span>
  );
}

export function SignalPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("signal-page", className)}>{children}</div>;
}

export function SignalHeader({
  title,
  description,
  badge,
  actions,
  meta,
}: {
  title: string;
  description: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="signal-header"
    >
      <div className="min-w-0">
        <div className="signal-title-row">
          <h1 className="signal-display signal-title">{title}</h1>
          {badge}
        </div>
        <p className="signal-subtitle">{description}</p>
      </div>
      {actions && <div className="signal-actions">{actions}</div>}
      {meta && <div className="signal-header-meta">{meta}</div>}
    </motion.header>
  );
}

export function SignalPanel({
  children,
  className,
  as: Tag = "section",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "aside";
}) {
  return <Tag className={cn("signal-panel", className)}>{children}</Tag>;
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("signal-section-head", className)}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="signal-icon-chip" aria-hidden="true">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="signal-section-title">{title}</h2>
          {description && <p className="signal-section-copy">{description}</p>}
        </div>
      </div>
      {action && <div className="signal-section-action">{action}</div>}
    </div>
  );
}

export function SignalCell({
  label,
  value,
  hint,
  tone = "violet",
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: {
  label: string;
  value: number;
  hint?: React.ReactNode;
  tone?: "violet" | "pale" | "white" | "success" | "warning" | "danger";
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const toneClass = {
    violet: "text-[#D8B4FE]",
    pale: "text-[#C084FC]",
    white: "text-[#F4EFF6]",
    success: "text-emerald-300",
    warning: "text-amber-300",
    danger: "text-rose-300",
  }[tone];

  return (
    <div className={cn("signal-cell", className)}>
      <span className="signal-label">{label}</span>
      <div className={cn("signal-cell-value", toneClass)}>
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} prefix={prefix} compact={value >= 10000} />
      </div>
      {hint && <div className="signal-cell-hint">{hint}</div>}
    </div>
  );
}

export function SignalFact({
  label,
  value,
  hint,
  tone = "violet",
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "violet" | "pale" | "white" | "success" | "warning" | "danger";
  className?: string;
}) {
  const toneClass = {
    violet: "text-[#D8B4FE]",
    pale: "text-[#C084FC]",
    white: "text-[#F4EFF6]",
    success: "text-emerald-300",
    warning: "text-amber-300",
    danger: "text-rose-300",
  }[tone];

  return (
    <div className={cn("signal-cell", className)}>
      <span className="signal-label">{label}</span>
      <div className={cn("signal-cell-value signal-fact-value", toneClass)}>{value}</div>
      {hint && <div className="signal-cell-hint">{hint}</div>}
    </div>
  );
}

export function SignalMeter({
  value,
  label,
  caption,
  tone = "violet",
  className,
}: {
  value: number;
  label: string;
  caption?: React.ReactNode;
  tone?: "violet" | "pale" | "success" | "warning";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const fill = {
    violet: "from-[#7A22B0] via-[#A24BE0] to-[#D8B4FE]",
    pale: "from-[#7A22B0] to-[#C084FC]",
    success: "from-emerald-600 to-emerald-300",
    warning: "from-amber-600 to-amber-300",
  }[tone];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="signal-label">{label}</span>
        <span className="text-[0.8125rem] font-semibold text-[#F4EFF6] tabular-nums">
          {Math.round(value)}%
        </span>
      </div>
      <div className="signal-track">
        <motion.div
          className={cn("signal-track-fill bg-gradient-to-r", fill)}
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${Math.max(2, Math.min(100, value))}%` }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </div>
      {caption && <div className="signal-meter-caption">{caption}</div>}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Array<{ value: T; label: string; count?: number }>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  const id = React.useId().replace(/:/g, "");
  return (
    <div className="signal-segmented" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn("signal-segment", active && "is-active")}
          >
            {active && (
              <motion.span
                layoutId={`segment-${id}`}
                className="signal-segment-bg"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
            {typeof option.count === "number" && (
              <span className="relative z-10 signal-segment-count">{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function StatusChip({
  children,
  tone = "violet",
  className,
}: {
  children: React.ReactNode;
  tone?: "violet" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}) {
  const toneClass = {
    violet: "border-[#A24BE0]/30 bg-[#7A22B0]/14 text-[#D8B4FE]",
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    warning: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    danger: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    neutral: "border-white/10 bg-white/[0.04] text-[#B8B1C0]",
  }[tone];

  return (
    <span className={cn("signal-chip", toneClass, className)}>
      {children}
    </span>
  );
}

export function EmptySignal({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="signal-empty">
      <div className="signal-empty-icon" aria-hidden="true">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-[#F4EFF6]">{title}</h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[#B8B1C0]">{description}</p>
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

export function MetaItem({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "violet" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "text-[#E7E1EA]",
    violet: "text-[#D8B4FE]",
    success: "text-emerald-300",
    warning: "text-amber-300",
    danger: "text-rose-300",
  }[tone];

  return (
    <div className="signal-meta-item">
      <span className="signal-label">{label}</span>
      <span className={cn("text-xs font-semibold", toneClass)}>{value}</span>
    </div>
  );
}

export function SignalMountains({
  values,
  secondary,
  className,
}: {
  values: number[];
  secondary?: number[];
  className?: string;
}) {
  const rawId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const primary = values.length ? values : [0, 0, 0, 0, 0, 0, 0];
  const secondarySafe = secondary?.length ? secondary : primary;
  const max = Math.max(...primary, ...secondarySafe, 1);
  const width = 100;
  const height = 44;

  const toPoints = (series: number[]) =>
    series.map((value, index) => ({
      x: (index / Math.max(1, series.length - 1)) * width,
      y: height - (value / max) * 34 - 3,
    }));

  const smoothPath = (points: Array<{ x: number; y: number }>) =>
    points.reduce((path, point, index, all) => {
      if (index === 0) return `M${point.x},${point.y}`;
      const previous = all[index - 1];
      const controlX = (previous.x + point.x) / 2;
      return `${path} C${controlX},${previous.y} ${controlX},${point.y} ${point.x},${point.y}`;
    }, "");

  const primaryPoints = toPoints(primary);
  const secondaryPoints = toPoints(secondarySafe);
  const primaryLine = smoothPath(primaryPoints);
  const secondaryLine = smoothPath(secondaryPoints);
  const last = primaryPoints[primaryPoints.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("signal-mountains", className)}
    >
      <defs>
        <linearGradient id={`${rawId}-primary`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CHART_COLORS.delivered} stopOpacity="0.42" />
          <stop offset="62%" stopColor={CHART_COLORS.delivered} stopOpacity="0.1" />
          <stop offset="100%" stopColor={CHART_COLORS.delivered} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${rawId}-secondary`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CHART_COLORS.comments} stopOpacity="0.22" />
          <stop offset="100%" stopColor={CHART_COLORS.comments} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${rawId}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7A22B0" />
          <stop offset="55%" stopColor={CHART_COLORS.delivered} />
          <stop offset="100%" stopColor={CHART_COLORS.comments} />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((ratio) => (
        <line
          key={ratio}
          x1="0"
          x2={width}
          y1={height * ratio}
          y2={height * ratio}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      <path d={`${secondaryLine} L${width},${height} L0,${height} Z`} fill={`url(#${rawId}-secondary)`} />
      <path
        d={secondaryLine}
        fill="none"
        stroke={CHART_COLORS.comments}
        strokeOpacity="0.55"
        strokeWidth="1.1"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path d={`${primaryLine} L${width},${height} L0,${height} Z`} fill={`url(#${rawId}-primary)`} />
      <path
        d={primaryLine}
        fill="none"
        stroke={`url(#${rawId}-line)`}
        strokeWidth="2.1"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={last.x}
        cy={last.y}
        r="1.6"
        fill={CHART_COLORS.delivered}
        stroke="#0E0C12"
        strokeWidth="0.7"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function SignalWave({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const safe = values.length ? values : [0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...safe, 1);
  const points = safe.map((value, index) => {
    const x = (index / Math.max(1, safe.length - 1)) * 100;
    const y = 34 - (value / max) * 30;
    return `${x},${y}`;
  });
  const line = `M${points.join(" L")}`;
  const area = `${line} L100,40 L0,40 Z`;

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("signal-wave", className)}
    >
      <defs>
        <linearGradient id="signal-wave-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A24BE0" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#A24BE0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="signal-wave-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7A22B0" stopOpacity="0.2" />
          <stop offset="55%" stopColor="#C084FC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#signal-wave-fill)" />
      <motion.path
        d={line}
        fill="none"
        stroke="url(#signal-wave-stroke)"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </svg>
  );
}
