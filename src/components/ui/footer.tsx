"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import {
  TextHoverEffect,
  FooterBackgroundGradient,
} from "@/components/ui/hover-footer";

export function Footer() {
  const productLinks = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "How to Connect", href: "/#how-to-connect" },
    { label: "Pricing Plans", href: "/#pricing" },
    { label: "Common FAQs", href: "/#faq" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Data Deletion Status", href: "/deletion-status" },
    {
      label: "Meta Platform Rules",
      href: "https://developers.facebook.com/docs/instagram-api",
      external: true,
    },
  ];

  const supportLinks = [
    {
      label: "support@freshdm.io",
      href: "mailto:support@freshdm.io",
      icon: <Mail className="h-3.5 w-3.5 text-[#A24BE0]" />,
    },
    { label: "Account Dashboard", href: "/login" },
  ];

  return (
    <footer className="relative bg-[#0A080C] border-t border-white/[0.08] text-[#E6E3E8] font-sans overflow-hidden select-none">
      {/* Top Ambient Violet Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[140px] w-[750px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.16), transparent)" }}
      />

      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-12 relative z-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-white/[0.08]">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3 transition-transform group-hover:scale-[1.02]">
                {/* Hollow Speech Bubble with Paper Plane */}
               

                {/* Wordmark: Auto (Solid White) + DM (Solid Emerald) */}
                <div className="flex items-baseline font-sans font-black tracking-tight text-[28px] sm:text-[30px] leading-none">
                  <span className="text-white">Auto</span>
                  <span className="text-[#10B981]">DM</span>
                </div>
                <span className="rounded-md bg-[#059669]/20 border border-[#10B981]/30 px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-[#34D399]">
                  Followers
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#8C8890] leading-relaxed max-w-sm">
              Reply to followers, even when you&apos;re offline. AutoDM automatically sends direct messages to anyone who comments on your Instagram Reels, posts, and stories.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[11px] font-semibold text-[#A7F3D0]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Official Meta Graph API Compliant</span>
              </div>
            </div>
          </div>

          {/* Col 3: Product Navigation */}
          <div className="space-y-3.5 text-left">
            <p className="text-xs font-bold font-mono uppercase tracking-wider text-[#10B981]">
              Product
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#8C8890]">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal & Privacy */}
          <div className="space-y-3.5 text-left">
            <p className="text-xs font-bold font-mono uppercase tracking-wider text-[#A24BE0]">
              Legal &amp; Privacy
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#8C8890]">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>{link.label}</span>
                    {link.external && <ExternalLink className="h-3 w-3 text-zinc-500" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Support & Contact */}
          <div className="space-y-3.5 text-left">
            <p className="text-xs font-bold font-mono uppercase tracking-wider text-[#A24BE0]">
              Support
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#8C8890]">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#D8B4FE]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A24BE0] animate-pulse" />
                  <span>All Systems Operational</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Meta Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8C8890]">
          <p>© {new Date().getFullYear()} AutoDM Followers. All rights reserved.</p>

          <p className="text-center md:text-right max-w-xl text-[11px] leading-relaxed">
            AutoDM operates through the official Meta Graph API. Instagram and Meta are registered trademarks of Meta Platforms, Inc.
          </p>
        </div>
      </div>

      {/* Full-width Neon Outline FRESHDM watermark with cursor spotlight */}
      <div className="w-full h-44 sm:h-52 md:h-64 lg:h-72 -mt-10 sm:-mt-14 mb-0 relative z-10 pointer-events-auto flex items-center justify-center overflow-hidden">
        <TextHoverEffect text="AUTODM" className="w-full h-full" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default Footer;
