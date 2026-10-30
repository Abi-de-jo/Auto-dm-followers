import React from "react";
import type { Metadata } from "next";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import PricingSection from "@/components/ui/pricing-section";
import Footer from "@/components/ui/footer";

export const metadata: Metadata = {
  title: "Pricing Plans — FreshDM Instagram Automation",
  description:
    "Flexible pricing plans for Instagram creators and brands. Automated comment-to-DM, story mentions, and AI replies.",
};

export default function PricingPage() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#0A080C] text-[#E6E3E8] font-sans antialiased overflow-x-hidden">
        <Navbar />

        <main className="w-full pt-16">
          <PricingSection />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
