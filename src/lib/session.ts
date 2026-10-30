import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyNeonToken } from "@/lib/neon";

export interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

function normalizeNeonSessionTokens(rawToken: string): string[] {
  // Handle cookie formats: URI encoded, signed (s:token.sig), or plain token
  const cleanToken = decodeURIComponent(rawToken).replace(/^s:/, "").split(".")[0];
  return Array.from(new Set([cleanToken, rawToken])).filter(Boolean);
}

async function upsertNeonUser(user: {
  name: string | null;
  email: string;
  image: string | null;
}): Promise<AppUser> {
  const email = user.email.toLowerCase().trim();
  const dbUser = await prisma.user.upsert({
    where: { email },
    update: {
      ...(user.name ? { name: user.name } : {}),
      ...(user.image ? { image: user.image } : {}),
    },
    create: {
      email,
      name: user.name || email.split("@")[0],
      image: user.image,
    },
  });
  return { id: dbUser.id, name: dbUser.name, email: dbUser.email, image: dbUser.image };
}

/**
 * Resolves a Neon Auth session token to an application user.
 * Accepts either an opaque Better Auth session token stored in neon_auth.session
 * or a signed Neon JWT that can be verified against the published JWKS.
 */
export async function getUserFromNeonSessionToken(rawToken: string): Promise<AppUser | null> {
  if (!rawToken) return null;

  try {
    for (const token of normalizeNeonSessionTokens(rawToken)) {
      const rows = await prisma.$queryRawUnsafe<
        Array<{ id: string; name: string | null; email: string | null; image: string | null }>
      >(
        `SELECT u.id, u.name, u.email, u.image
         FROM neon_auth.session s
         JOIN neon_auth.user u ON s."userId" = u.id
         WHERE s.token = $1
           AND s."expiresAt" > NOW()
           AND u."emailVerified" = TRUE
         LIMIT 1;`,
        token
      );

      if (rows && rows.length > 0 && rows[0].email) {
        return upsertNeonUser({
          name: rows[0].name,
          email: rows[0].email,
          image: rows[0].image,
        });
      }
    }
  } catch {
    // Fall through to JWT verification
  }

  try {
    const verified = await verifyNeonToken(rawToken);
    if (verified?.email && verified.emailVerified) {
      return upsertNeonUser({
        name: verified.name || null,
        email: verified.email,
        image: null,
      });
    }
  } catch {
    // Not a verifiable JWT
  }

  return null;
}

export async function getAppUser(): Promise<AppUser | null> {
  let cookieStore;
  try {
    cookieStore = await cookies();
  } catch {
    cookieStore = null;
  }
  // 0. Check AutoDM demo session cookie (for 1-click free mode)
  if (cookieStore) {
    const demoUserId = cookieStore.get("autodm_demo_session")?.value;
    if (demoUserId) {
      try {
        const demoUser = await prisma.user.findUnique({ where: { id: demoUserId } });
        if (demoUser) {
          return { id: demoUser.id, name: demoUser.name, email: demoUser.email, image: demoUser.image };
        }
      } catch {
        // Continue
      }
    }
  }

  // 1. Check NextAuth session (signed and verified by NextAuth)
  try {
    const nextAuthSession = await getServerSession(authOptions);
    if (nextAuthSession?.user?.id) {
      return nextAuthSession.user;
    }
    if (nextAuthSession?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: nextAuthSession.user.email.toLowerCase().trim() },
      });
      if (dbUser) {
        return { id: dbUser.id, name: dbUser.name, email: dbUser.email, image: dbUser.image };
      }
    }
  } catch {
    // Continue
  }

  // 2. Check Neon Managed Better Auth cookie (verified against Neon Auth)
  if (cookieStore) {
    try {
      const rawToken =
        cookieStore.get("better-auth.session_token")?.value ||
        cookieStore.get("__Secure-better-auth.session_token")?.value;
      if (rawToken) {
        const user = await getUserFromNeonSessionToken(rawToken);
        if (user) return user;
      }
    } catch {
      // Continue
    }
  }

  // 3. Check Bearer Token header with JWKS
  try {
    const reqHeaders = await headers();
    const authHeader = reqHeaders.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      const user = await getUserFromNeonSessionToken(token);
      if (user) return user;
    }
  } catch {
    // Continue
  }

  return null;
}
