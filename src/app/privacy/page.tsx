import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import {
  ShieldCheck,
  Lock,
  Trash2,
  Eye,
  Server,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — FreshDM",
  description:
    "Learn how FreshDM protects your privacy, encrypts tokens with AES-256-GCM, and adheres to official Meta Graph API developer policies.",
};

const SECTIONS = [
  {
    id: "scope",
    icon: ShieldCheck,
    title: "1. Scope & Meta Platform Compliance",
    content: (
      <>
        <p>
          Welcome to FreshDM (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). This Privacy Policy governs the manner in which FreshDM collects, uses, encrypts, and protects data gathered through our Instagram comment-to-DM automation software.
        </p>
        <p className="mt-2.5">
          FreshDM connects exclusively through official Meta Graph API endpoints and Meta Webhook subscriptions. We comply fully with Meta&apos;s Platform Terms, Developer Policies, and Commercial Terms.
        </p>
      </>
    ),
  },
  {
    id: "data-collection",
    icon: Eye,
    title: "2. Information We Access & Collect",
    content: (
      <>
        <p>
          When you connect your Instagram Professional account (Creator or Business) to FreshDM, we request only the permissions strictly required to deliver automated message workflows:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-[#8C8890]">
          <li><strong className="text-white">Account Identification:</strong> Your Instagram username, account ID, profile picture, and follower count.</li>
          <li><strong className="text-white">Published Media Metadata:</strong> Post IDs, media URLs, and captions for published Reels, Posts, and Carousels to enable keyword trigger monitoring.</li>
          <li><strong className="text-white">Public Comment Webhooks:</strong> Comment text, commenter username, comment ID, and timestamp dispatched by Meta when a user comments on your monitored media.</li>
          <li><strong className="text-white">What We NEVER Access:</strong> We never access personal private messages outside of automated replies, passwords, payment credentials, or personal device data.</li>
        </ul>
      </>
    ),
  },
  {
    id: "token-security",
    icon: Lock,
    title: "3. Token Security & Cryptographic Protection",
    content: (
      <>
        <p>
          We employ defense-in-depth security standards to protect your authorization tokens and credentials:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-[#8C8890]">
          <li><strong className="text-white">AES-256-GCM Encryption:</strong> All Instagram user access tokens and long-lived tokens are encrypted at rest using industry-grade AES-256-GCM authenticated encryption before database storage.</li>
          <li><strong className="text-white">Cryptographic Webhook Verification:</strong> Every incoming webhook payload from Meta is validated using SHA-256 HMAC (X-Hub-Signature-256) before processing.</li>
          <li><strong className="text-white">Zero Client Exposure:</strong> Access tokens are strictly isolated in server-side runtimes and are never exposed in client bundles or public APIs.</li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party",
    icon: Server,
    title: "4. Third-Party Sharing & Data Selling",
    content: (
      <>
        <p>
          <strong className="text-white">We do not sell, rent, or monetize your personal data or your followers&apos; data under any circumstances.</strong>
        </p>
        <p className="mt-2.5">
          Data is exchanged strictly with Meta Platforms, Inc. servers to execute user-configured actions (such as sending direct message replies and public comments) as authorized by your account.
        </p>
      </>
    ),
  },
  {
    id: "retention-deletion",
    icon: Trash2,
    title: "5. Data Retention & Right to Deletion",
    content: (
      <>
        <p>
          You maintain full ownership and control over your connection and stored data at all times:
        </p>
        <ul className="mt-3 space-y-2 list-disc list-inside text-[#8C8890]">
          <li><strong className="text-white">1-Click Disconnect:</strong> You can disconnect your Instagram account at any time from your Account Settings. Upon disconnection, stored access tokens are immediately revoked and deleted.</li>
          <li><strong className="text-white">Complete Account Deletion:</strong> Deleting your account permanently deletes all user records, connection history, automations, and event logs.</li>
          <li><strong className="text-white">Meta Data Deletion Callback:</strong> We support Meta&apos;s automatic Data Deletion Request callback, providing users with a confirmation code and status tracking at <Link href="/deletion-status" className="text-[#A24BE0] underline hover:text-[#C084FC]">/deletion-status</Link>.</li>
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    icon: Mail,
    title: "6. Questions & Data Protection Officer",
    content: (
      <>
        <p>
          If you have questions, feedback, or inquiries regarding this Privacy Policy or our data practices, our team is available to assist:
        </p>
        <div className="mt-4 p-4 rounded-2xl bg-[#0A080C] border border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">Privacy &amp; Compliance Team</p>
            <p className="text-xs text-[#A24BE0] mt-0.5">privacy@freshdm.io / support@freshdm.io</p>
          </div>
          <Link
            href="mailto:support@freshdm.io"
            className="px-4 py-2 rounded-xl bg-[#7A22B0] hover:bg-[#8E2CCB] text-xs font-semibold text-white shadow-md transition"
          >
            Email Support
          </Link>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
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
                <ShieldCheck className="h-3.5 w-3.5 text-[#A24BE0]" />
                <span className="font-mono text-[11px] uppercase tracking-wider">LEGAL &amp; DATA SECURITY</span>
              </div>

              <h1 className="font-bebas text-4xl sm:text-5xl lg:text-[52px] tracking-[-0.035em] leading-[1.02] text-white">
                Privacy Policy
              </h1>

              <p className="mt-4 font-inter text-sm sm:text-base text-[#8C8890] leading-relaxed">
                How FreshDM collects, encrypts, and handles your data while maintaining 100% compliance with official Meta platform guidelines.
              </p>

              {/* Status Pills */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs text-[#8C8890]">
                <span className="px-3.5 py-1 rounded-full bg-[#0E0C12] border border-white/[0.08]">
                  Effective: October 2026
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#0E0C12] border border-white/[0.08]">
                  Version 2.4
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#7A22B0]/15 text-[#D8B4FE] border border-[#7A22B0]/30 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#A24BE0]" />
                  AES-256-GCM Encrypted
                </span>
              </div>
            </div>

            {/* Quick Commitments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-12">
              <div className="rounded-[22px] bg-[#0E0C12] border border-white/[0.08] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-[#7A22B0]/35 transition-all">
                <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A24BE0] mb-3">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Zero Password Storage</h3>
                <p className="text-xs text-[#8C8890] mt-1.5 leading-relaxed">
                  We authenticate through official Meta OAuth. We never ask for, view, or store your Instagram password.
                </p>
              </div>

              <div className="rounded-[22px] bg-[#0E0C12] border border-white/[0.08] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-[#7A22B0]/35 transition-all">
                <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A24BE0] mb-3">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Encrypted at Rest</h3>
                <p className="text-xs text-[#8C8890] mt-1.5 leading-relaxed">
                  All authorization tokens are encrypted with authenticated AES-256-GCM encryption before database write.
                </p>
              </div>

              <div className="rounded-[22px] bg-[#0E0C12] border border-white/[0.08] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-[#7A22B0]/35 transition-all">
                <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A24BE0] mb-3">
                  <Trash2 className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Instant Right to Delete</h3>
                <p className="text-xs text-[#8C8890] mt-1.5 leading-relaxed">
                  Revoke access in 1 click anytime. We permanently wipe all connection and token records immediately.
                </p>
              </div>
            </div>

            {/* Detailed Policy Sections */}
            <div className="space-y-6">
              {SECTIONS.map((section) => {
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
              <Link href="/terms" className="hover:text-white underline transition">
                Read Terms of Service
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
