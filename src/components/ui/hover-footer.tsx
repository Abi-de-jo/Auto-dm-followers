"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text = "AUTODM",
  duration,
  className,
}: {
  text?: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1000 240"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer w-full overflow-visible", className)}
    >
      <defs>
        {/* Emerald Neon Multi-Stop Linear Gradient on Hover */}
        <linearGradient
          id="neonVioletGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="30%" stopColor="#34D399" />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="85%" stopColor="#059669" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>

        {/* Dynamic Interactive Flashlight Mask */}
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="26%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>

        {/* Soft Neon Glow Filter */}
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Base Static Outlines (Deep violet hairline like the user image) */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1.2"
        className="fill-transparent stroke-[#059669]/30 font-anton tracking-[0.06em] text-[180px] sm:text-[210px] md:text-[230px]"
        style={{ letterSpacing: "0.04em" }}
      >
        {text}
      </text>

      {/* 2. Delicate Overlap Stroke Line */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.8"
        className="fill-transparent stroke-[#10B981]/40 font-anton tracking-[0.06em] text-[180px] sm:text-[210px] md:text-[230px]"
        style={{ letterSpacing: "0.04em" }}
      >
        {text}
      </text>

      {/* 3. Interactive Neon Glow Lines revealed on hover under mouse position */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#neonVioletGradient)"
        strokeWidth="2.5"
        mask="url(#textMask)"
        filter="url(#neonGlow)"
        className="fill-transparent font-anton tracking-[0.06em] text-[180px] sm:text-[210px] md:text-[230px]"
        style={{ letterSpacing: "0.04em" }}
      >
        {text}
      </text>

      {/* 4. Crisp White Core Stroke highlighted by the mask */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="#ffffff"
        strokeWidth="1.4"
        mask="url(#textMask)"
        className="fill-transparent font-anton tracking-[0.06em] text-[180px] sm:text-[210px] md:text-[230px]"
        style={{ letterSpacing: "0.04em" }}
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, rgba(8,12,10,0.95) 45%, rgba(16,185,129,0.18) 100%)",
      }}
    />
  );
};
