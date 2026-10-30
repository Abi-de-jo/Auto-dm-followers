import React from "react";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import HeroSection from "@/components/ui/glassmorphism-trust-hero";
import HowToConnectSection from "@/components/ui/how-to-connect-section";
import PricingSection from "@/components/ui/pricing-section";
import FAQSection from "@/components/ui/faq-section";
import Footer from "@/components/ui/footer";

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#F6FAF7] text-[#132A1F] font-sans antialiased overflow-x-clip selection:bg-[#10B981] selection:text-white">
        <Navbar />
        <main className="w-full">
          {/* 1. Hero Section */}
          <HeroSection />

          {/* 2. How to Connect Section (Photo of Abi & setup steps) */}
          <HowToConnectSection />

          {/* 3. Pricing Section */}
          <PricingSection />

          {/* 4. Common FAQs */}
          <FAQSection />
        </main>
        {/* 5. Footer with codebyabi signature */}
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
