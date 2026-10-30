import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import {
  FileText,
  ShieldCheck,
  Ban,
  Clock,
  CreditCard,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — FreshDM",
  description:
    "Review FreshDM's Terms of Service, Meta compliance requirements, permitted automation guidelines, and subscription policies.",
};

const TERMS_SECTIONS = [
  {
    id: "acceptance",
    icon: FileText,
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p>
          By creating an account, connecting your Instagram account, or accessing FreshDM (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>
        <p className="mt-2.5">
          If you do not agree with any of these terms, you are prohibited from using or accessing our software. FreshDM integrates with Meta Platforms, Inc. services and requires strict compliance with Meta&apos;s developer terms.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    icon: ShieldCheck,
    title: "2. Account Eligibility & Connection",
    content: (
      <>
        <p>
          To use FreshDM to automate replies, you must meet the following criteria:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-[#8C8890]">
          <li>You must be at least 18 years old or possess legal authority to enter into these terms.</li>
          <li>You must own or manage an authorized <strong className="text-white">Instagram Professional Account (Creator or Business)</strong>.</li>
          <li>You must authenticate through official Meta Business Login dialogs without impersonating others.</li>
        </ul>
      </>
    ),
  },
  {
    id: "permitted-automation",
    icon: Clock,
    title: "3. Permitted Automation & Rate Limits",
    content: (
      <>
        <p>
          FreshDM is built to respond to genuine follower intent. You agree that:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-[#8C8890]">
          <li><strong className="text-white">Intent-Driven Triggering:</strong> Automations may only be configured to trigger when followers explicitly ask for links, prices, or guides by commenting chosen keywords.</li>
          <li><strong className="text-white">Meta Rate Limits:</strong> Meta enforces hourly rate limits on Instagram Private Replies (approximately 750 calls per hour). FreshDM automatically throttles requests to protect your account standing.</li>
          <li><strong className="text-white">7-Day Messaging Window:</strong> In accordance with Instagram API policies, automated direct messages can only be sent to users within 7 days of their comment.</li>
        </ul>
      </>
    ),
  },
  {
    id: "prohibited",
    icon: Ban,
    title: "4. Prohibited Activities & Anti-Spam Rules",
    content: (
      <>
        <p>
          We maintain a zero-tolerance policy for abuse. You may NOT use FreshDM to:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-[#8C8890]">
          <li>Send unsolicited bulk commercial spam, scam messages, or deceptive phishing links.</li>
          <li>Harass, stalk, threaten, or distribute defamatory content to Instagram users.</li>
          <li>Bypass Instagram rate limits or simulate fake social engagement through coordinated networks.</li>
          <li>Violate copyright, intellectual property, or trade secrets of third parties.</li>
        </ul>
        <p className="mt-3 text-[#A24BE0] text-xs font-semibold">
          Violation of these rules will result in immediate account termination without refund.
        </p>
      </>
    ),
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "5. Subscription Plans, Billing & Cancellations",
    content: (
      <>
        <p>
          FreshDM offers monthly and annual subscription plans:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-[#8C8890]">
          <li><strong className="text-white">Billing Cycles:</strong> Subscriptions are billed in advance on a recurring monthly or yearly cycle. Yearly plans receive an automatic 20% discount.</li>
          <li><strong className="text-white">1-Click Cancellation:</strong> You can cancel your subscription at any time from your account settings. You retain access until the end of the current paid billing cycle.</li>
          <li><strong className="text-white">Currency &amp; Taxes:</strong> Localized pricing (₹ INR or $ USD) is determined by geographic location. Users are responsible for applicable local sales taxes.</li>
        </ul>
      </>
    ),
  },
  {
    id: "disclaimer",
    icon: AlertTriangle,
    title: "6. Disclaimer of Warranties & Liability",
    content: (
      <>
        <p>
          FreshDM is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied.
        </p>
        <p className="mt-2.5">
          While we adhere 100% to official Meta API rules, we are not liable for actions taken by Meta Platforms, Inc. regarding your Instagram profile (including restrictions or policy changes) resulting from user misuse of automated messaging.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#0A080C] text-[#E6E3E8] font-sans antialiased overflow-x-hidden">
        <Navbar />

        <main className="w-full pt-28 sm:pt-36 pb-20 sm:pb-28 relative">
          {/* Ambient Violet Aura */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#7A22B0]/[0.06] rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14 relative z-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7A22B0]/30 bg-[#7A22B0]/15 px-3.5 py-1 text-xs font-semibold text-[#D8B4FE] mb-4">
                <FileText className="h-3.5 w-3.5 text-[#A24BE0]" />
                <span className="font-mono text-[11px] uppercase tracking-wider">PLATFORM TERMS</span>
              </div>

              <h1 className="font-bebas text-4xl sm:text-5xl lg:text-[52px] tracking-[-0.035em] leading-[1.02] text-white">
                Terms of Service
              </h1>

              <p className="mt-4 font-inter text-sm sm:text-base text-[#8C8890] leading-relaxed">
                The rules, guidelines, and acceptable automation practices for using FreshDM and our official Instagram integrations.
              </p>

              {/* Status Pills */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs text-[#8C8890]">
                <span className="px-3.5 py-1 rounded-full bg-[#0E0C12] border border-white/[0.08]">
                  Effective: October 2026
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#0E0C12] border border-white/[0.08]">
                  Version 2.4
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#7A22B0]/15 text-[#D8B4FE] border border-[#7A22B0]/30 font-semibold">
                  Meta Developer Terms Compliant
                </span>
              </div>
            </div>

            {/* Detailed Terms Sections */}
            <div className="space-y-6">
              {TERMS_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.id}
                    className="rounded-[22px] bg-[#0E0C12] border border-white/[0.08] p-6 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/15 transition-all text-left"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A24BE0] shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        {section.title}
                      </h2>
                    </div>

                    <div className="text-xs sm:text-sm text-[#8C8890] leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Navigation */}
            <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8890]">
              <Link href="/privacy" className="hover:text-white underline transition">
                Read Privacy Policy
              </Link>
              <Link href="/" className="hover:text-white flex items-center gap-1 transition">
                <span>Back to Home</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
