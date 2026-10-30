"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore, logoutAndRedirect } from "@/lib/auth-store";
import { UserNavDropdown } from "@/components/ui/dropdown-menu-07";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full h-[76px] transition-all duration-200 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#D5EAE0]" : "bg-[#F6FAF7]/80 backdrop-blur-sm"
      }`}
    >
      <div className="h-full w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] items-center">
        
        {/* --- LEFT: LOGO --- */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-inter text-[20px] font-black tracking-[-0.03em] text-[#11271D] leading-none">
              Auto<span className="text-[#059669]">DM</span>
            </span>
            <span className="rounded-md bg-[#059669]/10 border border-[#10B981]/30 px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-[#059669]">
              Followers
            </span>
          </Link>
        </div>

        {/* --- CENTER: LINKS --- */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          <Link
            href="/#how-to-connect"
            className="font-inter font-semibold text-[14px] text-[#3B5D4D] hover:text-[#059669] transition-colors"
          >
            How to connect
          </Link>
          <Link
            href="/#pricing"
            className="font-inter font-semibold text-[14px] text-[#3B5D4D] hover:text-[#059669] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#faq"
            className="font-inter font-semibold text-[14px] text-[#3B5D4D] hover:text-[#059669] transition-colors"
          >
            Common FAQs
          </Link>
        </nav>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="flex items-center justify-end gap-5">
          {isAuthenticated && user ? (
            <div className="hidden sm:flex items-center gap-4">
              <UserNavDropdown user={user} />
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="/login"
                className="font-inter font-semibold text-[14px] text-[#3B5D4D] hover:text-[#059669] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="btn-nav-sweep"
              >
                Get started
              </Link>
            </div>
          )}

          {/* Mobile Right Block: Get started + 2-line Hamburger */}
          <div className="flex sm:hidden items-center gap-3">
            <Link
              href="/login"
              className="btn-nav-sweep !h-[36px] !px-3.5 !text-[13px]"
            >
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#11271D] hover:text-[#059669]"
              aria-label="Toggle navigation menu"
            >
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="1" y1="3" x2="19" y2="3" />
                <line x1="1" y1="11" x2="19" y2="11" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE COLLAPSED MENU --- */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[#D5EAE0] bg-white px-6 pt-4 pb-6 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="font-inter text-[15px] text-[#8C8890] hover:text-[#E6E3E8]"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="font-inter text-[15px] text-[#8C8890] hover:text-[#E6E3E8]"
            >
              How it works
            </Link>
            <Link
              href="/#how-to-connect"
              onClick={() => setMobileOpen(false)}
              className="font-inter text-[15px] text-[#8C8890] hover:text-[#E6E3E8]"
            >
              How to connect
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileOpen(false)}
              className="font-inter text-[15px] text-[#8C8890] hover:text-[#E6E3E8]"
            >
              Pricing
            </Link>

            <div className="pt-4 border-t border-[rgba(255,255,255,0.12)] flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="font-inter text-[15px] text-[#E6E3E8]"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      logoutAndRedirect("/");
                    }}
                    className="text-left font-inter text-[14px] text-red-400"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="font-inter text-[15px] text-[#8C8890] hover:text-[#E6E3E8]"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
