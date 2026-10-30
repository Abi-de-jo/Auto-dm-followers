"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Inline SVGs (No icon libraries)
function HelpCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-safe",
    question: "Is FreshDM safe for my Instagram account? Could I get banned or shadowbanned?",
    answer:
      "Yes, 100% safe. AutoDM connects exclusively through official Meta Graph API endpoints with automated human pacing jitter (1.2s–2.8s) and strict rate limit compliance. We never use unofficial browser bots, phone scrapers, or password sharing, ensuring zero risk of bans or spam strikes.",
  },
  {
    id: "faq-password",
    question: "Do I need to share my Instagram password?",
    answer:
      "Never. You authorize access through Meta's secure Login for Business dialog. FreshDM never sees, asks for, or stores your Instagram account password.",
  },
  {
    id: "faq-account-type",
    question: "What type of Instagram account do I need?",
    answer:
      "You need a free Instagram Professional account (either Creator or Business). You can switch any personal profile to a Professional account in Instagram settings in 10 seconds at no cost.",
  },
  {
    id: "faq-delivery-speed",
    question: "How fast are automated DMs delivered to followers?",
    answer:
      "Messages arrive in under 0.4 to 2 seconds. When someone comments on your Reel or post with your trigger keyword, our cloud webhook engine dispatches the DM instantly while their intent is highest.",
  },
  {
    id: "faq-offline",
    question: "Does it work when my phone or computer is offline?",
    answer:
      "Yes. FreshDM operates 24/7 on dedicated cloud infrastructure. Your automations continuously reply to comments and send DMs even when your personal devices are powered off or you are asleep.",
  },
  {
    id: "faq-media-types",
    question: "Can I auto-reply to Instagram Reels, Posts, and Stories?",
    answer:
      "Yes. You can trigger automations across any Reel, Feed post, Carousel, or Story tag. You can monitor specific media items or enable global keyword triggers for all future content.",
  },
  {
    id: "faq-cancel",
    question: "Can I cancel or change my plan anytime?",
    answer:
      "Yes, anytime with zero penalty. There are no contracts or hidden cancellation fees. You can upgrade, downgrade, or cancel your subscription with one click directly inside your dashboard.",
  },
  {
    id: "faq-safety-guarantee",
    question: "How do you protect creators against Instagram spam flags and action blocks?",
    answer:
      "We implement randomized human timing delays, multi-variant comment rotation (spintax), and strict single-reply deduplication according to Meta's Developer Policies to ensure maximum safety.",
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq-safe");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-[#F6FAF7] py-20 sm:py-28 lg:py-32 overflow-clip font-sans border-t border-[#D5EAE0] select-none text-[#11271D]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 h-[350px] w-[750px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(122,34,176,0.11), transparent)" }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Heading + Support Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#059669]/30 bg-[#E8F7F0] px-3 py-1 text-xs font-semibold text-[#059669] mb-4">
                <HelpCircleIcon className="h-3.5 w-3.5 text-[#059669]" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>

              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-[52px] tracking-[-0.035em] leading-[1.02] text-[#11271D]">
                Have more questions?
              </h2>

              <p className="mt-3.5 font-inter text-sm sm:text-base text-[#4E7361] leading-relaxed">
                Everything you need to know about setting up official Instagram comment-to-DM automations with zero stress.
              </p>
            </div>

            <div className="rounded-[24px] bg-white border border-[#D5EAE0] p-6 sm:p-7 shadow-md hover:border-[#059669]/40 transition-all duration-300">
              <h3 className="font-sans text-lg sm:text-xl font-bold text-[#11271D] tracking-tight">
                Can&apos;t find your answer?
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#4E7361] leading-relaxed">
                Need help setting up your Instagram connection or custom keyword automations? Get in touch directly.
              </p>
              <div className="mt-6">
                <Link
                  href="mailto:support@codebyabi.com"
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#059669] hover:bg-[#047857] text-white font-inter text-xs sm:text-[13px] font-bold px-6 py-2.5 transition-all shadow-md shadow-[#059669]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                >
                  <span>support@codebyabi.com</span>
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 space-y-3.5 text-left">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`rounded-[20px] border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#059669] bg-white ring-2 ring-[#059669]/20 shadow-md"
                      : "border-[#D5EAE0] bg-white shadow-sm hover:border-[#059669]/40"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-[#11271D] leading-snug">
                      {faq.question}
                    </span>

                    <span
                      className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center transition-transform duration-200 ${
                        isOpen
                          ? "bg-[#059669] text-white rotate-180"
                          : "bg-[#E8F7F0] border border-[#10B981]/30 text-[#059669]"
                      }`}
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-[13px] text-[#4E7361] leading-relaxed border-t border-[#D5EAE0] mt-1">
                          <p className="pt-3">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export default FAQSection;
