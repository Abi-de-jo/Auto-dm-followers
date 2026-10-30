import React from "react";
import type { Metadata } from "next";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import HowItWorksSection from "@/components/ui/how-it-works-section";
import SignUpButton from "@/components/ui/sign-up-button";

export const metadata: Metadata = {
  title: "How It Works — FreshDM Instagram Automation",
  description:
    "Learn how FreshDM automates your Instagram comments, direct messages, and story mentions in 4 simple steps.",
};

export default function HowItWorksPage() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#191F1B] text-[#F2F2EE] font-sans antialiased overflow-x-hidden">
        <Navbar />

        <main className="w-full pt-16">
          <HowItWorksSection />

          {/* Quick CTA Bottom Banner */}
          <section className="py-16 border-t border-[#3A4540]/40 text-center bg-[#161B18]">
            <div className="max-w-xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-[#F2F2EE]">
                Ready to automate your Instagram?
              </h3>
              <p className="mt-2 text-sm text-[#A7ACA6]">
                Set up your first comment-to-DM trigger in under 60 seconds.
              </p>
              <div className="mt-6 flex justify-center">
                <SignUpButton href="/login" className="px-7 py-3 text-sm">
                  Start Free Setup
                </SignUpButton>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
