import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Anton } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { NeonAuthSync } from "@/components/NeonAuthSync";
import { GlobalAuthSync } from "@/components/GlobalAuthSync";
import { Toaster } from "@/components/ui/sonner";
import { CreatorFollowModal } from "@/components/CreatorFollowModal";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoDM Followers — Reply to Instagram Followers Automatically",
  description:
    "AutoDM automatically replies to Instagram comments and DMs with human speed, converting followers into conversations when you're away.",
  icons: {
    icon: "/logo/favicon.ico",
    shortcut: "/logo/favicon.ico",
    apple: "/logo/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${jetbrainsMono.variable} ${anton.variable} font-sans bg-[#F6FAF7] text-[#11271D]`}
      data-theme="light"
      style={{ letterSpacing: "0em" }}
    >
      <head>
        <noscript>
          <style>{`[data-intro]{visibility:visible!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-background text-content font-sans antialiased">
        <SessionProvider>
          <GlobalAuthSync />
          <NeonAuthSync />
          {children}
          <CreatorFollowModal />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
