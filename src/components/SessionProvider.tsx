"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthEntry = pathname === "/login";

  // The login page can start either auth flow without prefetching a NextAuth
  // session. Supplying a known null session here avoids a noisy client fetch
  // when the dev compiler is rebuilding an auth route. The keyed provider
  // remounts after navigation so protected pages still load the real session.
  return (
    <NextAuthSessionProvider
      key={isAuthEntry ? "auth-entry" : "session-aware"}
      session={isAuthEntry ? null : undefined}
      refetchOnWindowFocus={!isAuthEntry}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
