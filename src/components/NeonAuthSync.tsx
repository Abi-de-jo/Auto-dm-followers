"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/neon";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { safeInternalPath } from "@/lib/safe-redirect";

export function NeonAuthSync() {
  const router = useRouter();
  const pathname = usePathname();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    async function sync() {
      // A verified app session is already active; avoid repeating the Neon
      // session exchange on every client-side navigation.
      const currentAuth = useAuthStore.getState().isAuthenticated;
      if (currentAuth && pathname !== "/login") return;
      try {
        const result = await authClient.getSession();
        if (result?.data?.user) {
          const user = result.data.user;
          const session = result.data.session;
          const rawSession = session as
            | { token?: unknown; access_token?: unknown }
            | null;
          const sessionToken =
            typeof rawSession?.token === "string"
              ? rawSession.token
              : typeof rawSession?.access_token === "string"
                ? rawSession.access_token
                : null;

          // Sync only profile fields. The server proves identity from the
          // verified Neon session (cookie or bearer token), never from the body.
          const res = await fetch("/api/auth/sync-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
            },
            body: JSON.stringify({
              user: { name: user.name, image: user.image },
              ...(sessionToken ? { session: { token: sessionToken } } : {}),
            }),
          });

          if (res.ok) {
            const data = (await res.json()) as { user?: any };
            if (data?.user) {
              useAuthStore.getState().setUser(data.user);
            }
            await useAuthStore.getState().fetchSession();

            if (!hasSyncedRef.current) {
              hasSyncedRef.current = true;
              if (pathname === "/login") {
                const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
                window.location.replace(safeInternalPath(params?.get("callbackUrl") ?? null));
              }
            }
          }
        }
      } catch {
        // No session to sync
      }
    }

    sync();
  }, [pathname, router]);

  return null;
}
