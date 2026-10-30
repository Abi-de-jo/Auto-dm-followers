import { z } from "zod";
import { create } from "zustand";

// --- ZOD SCHEMAS FOR USER & SESSION ---
export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  image: z.string().nullable().optional(),
});

export type UserType = z.infer<typeof UserSchema>;

export interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserType | null) => void;
  fetchSession: () => Promise<UserType | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    if (!user) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    const parsed = UserSchema.safeParse(user);
    if (parsed.success) {
      set({ user: parsed.data, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  fetchSession: async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = (await res.json()) as { user?: unknown };
        if (!data?.user) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return null;
        }
        const parsed = UserSchema.safeParse(data.user);
        if (parsed.success) {
          set({ user: parsed.data, isAuthenticated: true, isLoading: false });
          return parsed.data;
        }
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false, isLoading: false });

    // 1. Client-side sign out from Neon Auth client (kills Neon session token)
    try {
      const { authClient } = await import("@/lib/neon");
      if (authClient && typeof (authClient as { signOut?: () => Promise<unknown> }).signOut === "function") {
        await (authClient as { signOut: () => Promise<unknown> }).signOut();
      }
    } catch {}

    // 2. Client-side NextAuth sign out
    try {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: false });
    } catch {}

    // 3. Server-side logout endpoint to clear all HTTP cookies
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}

    // 4. Clear non-httpOnly compatibility cookies directly
    try {
      if (typeof document !== "undefined") {
        const cookiesToClear = [
          "freshdm_user_id",
          "freshdev_user_id",
          "freshdm_user_email",
          "better-auth.session_token",
          "__Secure-better-auth.session_token",
          "next-auth.session-token",
          "__Secure-next-auth.session-token",
          "next-auth.csrf-token",
          "__Host-next-auth.csrf-token",
          "next-auth.callback-url",
          "__Secure-next-auth.callback-url",
        ];
        for (const name of cookiesToClear) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
        }
      }
    } catch {}
  },
}));

export async function logoutAndRedirect(callbackUrl = "/") {
  try {
    const store = useAuthStore.getState();
    await store.logout();
  } catch {}

  if (typeof window !== "undefined") {
    window.location.replace(callbackUrl);
  }
}
