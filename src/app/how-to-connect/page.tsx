import React from "react";
import type { Metadata } from "next";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import HowToConnectSection from "@/components/ui/how-to-connect-section";

export const metadata: Metadata = {
  title: "How to Connect Your Instagram — FreshDM",
  description:
    "Connect your Instagram Creator or Business account to FreshDM in 4 simple steps with official Meta authorization.",
};

export default function HowToConnectPage() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#0A080C] text-[#E6E3E8] font-sans antialiased overflow-x-hidden">
        <Navbar />

        <main className="w-full pt-16">
          <HowToConnectSection />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
