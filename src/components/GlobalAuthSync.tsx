"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function GlobalAuthSync() {
  const pathname = usePathname();
  const { status, data: session } = useSession();
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      setUser({
        id: (session.user as { id?: string }).id || "",
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
      });
      fetchSession();
      return;
    }

    if (status === "unauthenticated") {
      fetchSession();
      return;
    }

    const isProtectedRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/instagram") ||
      pathname.startsWith("/account");

    if (isProtectedRoute || isAuthenticated) {
      fetchSession();
    }
  }, [status, session, pathname, isAuthenticated, fetchSession, setUser]);

  useEffect(() => {
    const onFocus = () => {
      if (useAuthStore.getState().isAuthenticated) {
        fetchSession();
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchSession]);

  return null;
}

export default GlobalAuthSync;
