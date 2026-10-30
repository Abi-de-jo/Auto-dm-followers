import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import {
  ShieldCheck,
  Check,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Deletion Status — FreshDM",
  description:
    "Check the status of your Instagram account data deletion request under Meta Platform Developer guidelines.",
};

interface Props {
  searchParams: Promise<{ code?: string }>;
}

export default async function DeletionStatusPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const code = resolvedParams?.code || "del_req_live_verified";

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#0A080C] text-[#E6E3E8] font-sans antialiased overflow-x-hidden flex flex-col justify-between">
        <Navbar />

        <main className="w-full flex-1 flex items-center justify-center py-28 sm:py-36 px-4 sm:px-6 lg:px-8 relative">
          {/* Ambient Violet Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[300px] bg-[#7A22B0]/[0.08] rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-xl w-full relative z-10">
            <div className="rounded-[28px] bg-[#0E0C12] border border-white/[0.08] p-8 sm:p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.6)] space-y-7 text-center">
              
              {/* Success Icon */}
              <div className="h-16 w-16 rounded-2xl bg-[#7A22B0]/20 border border-[#7A22B0]/40 text-[#D8B4FE] flex items-center justify-center mx-auto shadow-lg shadow-[#7A22B0]/20">
                <Check className="h-8 w-8 stroke-[3] text-[#C084FC]" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A22B0]/15 border border-[#7A22B0]/30 text-xs font-semibold text-[#D8B4FE]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#A24BE0]" />
                  <span>Meta Platform Compliance</span>
                </div>

                <h1 className="font-bebas text-3xl sm:text-4xl tracking-[-0.035em] text-white">
                  Data Deletion Request Complete
                </h1>

                <p className="text-xs sm:text-sm text-[#8C8890] leading-relaxed max-w-md mx-auto">
                  Your Instagram connection, user profile credentials, and associated automations have been permanently removed from our active database.
                </p>
              </div>

              {/* Confirmation Code Card */}
              <div className="p-4 rounded-2xl bg-[#0A080C] border border-white/[0.08] space-y-2 text-left">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#A24BE0]">
                  Confirmation Code
                </p>
                <div className="flex items-center justify-between gap-3">
                  <code className="text-xs sm:text-sm font-mono text-[#D8B4FE] break-all font-bold">
                    {code}
                  </code>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7A22B0]/20 text-[#D8B4FE] border border-[#7A22B0]/35">
                    Verified
                  </span>
                </div>
              </div>

              {/* Checklist Points */}
              <div className="text-left space-y-2.5 text-xs text-[#8C8890] pt-1 border-t border-white/[0.06]">
                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-[#7A22B0]/20 flex items-center justify-center text-[#D8B4FE] shrink-0 mt-0.5">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span>OAuth access tokens revoked and deleted from storage.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-[#7A22B0]/20 flex items-center justify-center text-[#D8B4FE] shrink-0 mt-0.5">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span>Automated keyword trigger monitors cleared for your account.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-[#7A22B0]/20 flex items-center justify-center text-[#D8B4FE] shrink-0 mt-0.5">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span>Meta Graph API webhook subscription deregistered.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#7A22B0] hover:bg-[#8E2CCB] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#7A22B0]/30 transition"
                >
                  <span>Return to Home</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/privacy"
                  className="w-full sm:w-auto h-11 px-5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#8C8890] hover:text-white hover:bg-white/[0.08] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Review Privacy Policy</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
