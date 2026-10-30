import React from "react";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import Navbar from "@/components/ui/navbar";
import HeroSection from "@/components/ui/glassmorphism-trust-hero";
import Reels3DCarouselSection from "@/components/ui/reels-3d-carousel";
import ProblemSection from "@/components/ui/problem-section";
import TrustedCreators from "@/components/ui/trusted-creators";
import HowItWorksSection from "@/components/ui/how-it-works-section";
import ResultsSection from "@/components/ui/results-section";
import HowToConnectSection from "@/components/ui/how-to-connect-section";
import FeaturesSection from "@/components/ui/features-section";
import PricingSection from "@/components/ui/pricing-section";
import FAQSection from "@/components/ui/faq-section";
import Cta69 from "@/components/ui/cta69";
import Footer from "@/components/ui/footer";

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#0A080C] text-[#E6E3E8] font-sans antialiased overflow-x-clip">
        <Navbar />
        <main className="w-full">
          <HeroSection />
          <Reels3DCarouselSection />
          <ProblemSection />
          <TrustedCreators />
          <HowItWorksSection />
          {/* Results section placed immediately after How it works, before pricing */}
          <ResultsSection />
          <HowToConnectSection />
          <FeaturesSection />
          <PricingSection />
          <FAQSection />
          {/* Post-FAQ Giant Marquee Backdrop CTA */}
          <Cta69
            badge={{ label: "START AUTOMATING" }}
            heading="Turn every comment into a paying customer."
            button={{
              label: "Connect your Instagram",
              href: "/login",
            }}
            labels={{
              marqueePhrase: "AUTODM ON AUTOPILOT",
              note: "No complex bot builders, no password needed. Official Meta Graph API compliance in 60 seconds.",
              footnote: "Free edition. Connect your Instagram in 60 seconds.",
            }}
          />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
