import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import FeaturesSection from "@/components/ui/features-section";

export const metadata: Metadata = {
  title: "Features — FreshDM Instagram Automation",
  description:
    "Explore FreshDM's powerful Instagram API automation features: instant comment-to-DM, story mention responders, and live conversion analytics.",
};

export default function FeaturesPage() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#0A080C] text-[#E6E3E8] font-sans antialiased overflow-x-hidden">
        <Navbar />

        <main className="w-full pt-16">
          <FeaturesSection />

          {/* Bottom Conversion CTA Section */}
          <section className="relative w-full py-20 sm:py-24 border-t border-white/[0.08] overflow-hidden bg-gradient-to-b from-[#0A080C] to-[#0E0C12]">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7A22B0]/40 bg-[#7A22B0]/15 px-3.5 py-1 text-xs font-semibold text-[#D8B4FE] mb-5">
                <span className="w-2 h-2 rounded-full bg-[#A24BE0] animate-pulse" />
                <span>Ready to Grow Your Instagram?</span>
              </div>

              <h2 className="font-bebas text-4xl sm:text-5xl tracking-[-0.035em] text-[#E6E3E8]">
                Connect your Instagram account in 60 seconds
              </h2>

              <p className="mt-3.5 font-inter text-sm sm:text-base text-[#8C8890] max-w-xl mx-auto leading-relaxed">
                No complex bot builders or coding required. Connect your Instagram Creator or Business account, set a trigger keyword, and start capturing sales automatically.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="h-11 px-7 rounded-[14px] bg-[#7A22B0] hover:bg-[#8E2CCB] text-white font-inter text-[13.5px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#7A22B0]/30 transition-all hover:scale-[1.02]"
                >
                  <span>Connect with Instagram</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
