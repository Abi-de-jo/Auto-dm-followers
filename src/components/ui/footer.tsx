"use client";

import React from "react";
import Link from "next/link";
import { Mail, Heart } from "lucide-react";

export function Footer() {
  const links = [
    { label: "How to Connect", href: "/#how-to-connect" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Common FAQs", href: "/#faq" },
    { label: "Sign In", href: "/login" },
  ];

  return (
    <footer className="relative bg-[#F2F9F5] border-t border-[#D5EAE0] text-[#1D3B2D] font-sans overflow-hidden select-none">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 py-12 relative z-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#D5EAE0]">
          {/* Brand Info */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex items-baseline font-sans font-black tracking-tight text-[24px] leading-none">
                <span className="text-[#132A1F]">Auto</span>
                <span className="text-[#059669]">DM</span>
              </div>
              <span className="rounded-md bg-[#059669]/15 border border-[#10B981]/30 px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-[#059669]">
                Followers
              </span>
            </Link>
            <p className="text-xs text-[#527060] max-w-md">
              Reply to Instagram followers with human speed. Official Meta Graph API integration.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-[#416151]">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-[#059669] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact & Credit */}
          <div className="space-y-1.5 text-left md:text-right">
            <Link
              href="mailto:support@codebyabi.com"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>support@codebyabi.com</span>
            </Link>
            <p className="text-[11px] text-[#628172]">
              Free open Instagram automation platform
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#628172]">
          <p>© {new Date().getFullYear()} AutoDM Followers. All rights reserved.</p>

          <p className="flex items-center gap-1 text-[12px] font-medium text-[#132A1F]">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 fill-emerald-500 text-emerald-500" />
            <span>by</span>
            <a
              href="https://codebyabi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#059669] hover:underline"
            >
              codebyabi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
