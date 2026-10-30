import { createAuthClient } from "@neondatabase/neon-js/auth";
import { createRemoteJWKSet, jwtVerify } from "jose";

export const NEON_AUTH_URL =
  process.env.NEXT_PUBLIC_NEON_AUTH_URL ||
  process.env.NEON_AUTH_URL ||
  "https://ep-orange-wildflower-b52we6r4.neonauth.c-7.us-east-2.aws.neon.tech/neondb/auth";

export const NEON_JWKS_URL =
  process.env.NEON_JWKS_URL ||
  `${NEON_AUTH_URL}/.well-known/jwks.json`;

// Client-side Neon Auth client
export const authClient = createAuthClient(NEON_AUTH_URL);

// Server-side JWKS verifier
const JWKS = createRemoteJWKSet(new URL(NEON_JWKS_URL));

export interface NeonAuthenticatedUser {
  id: string;
  email?: string;
  name?: string;
  emailVerified: boolean;
}

/**
 * Verify JWT from Neon Auth using JWKS endpoint
 */
export async function verifyNeonToken(token: string): Promise<NeonAuthenticatedUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS);
    return {
      id: (payload.sub || (payload.id as string)) as string,
      email: (payload.email as string) || undefined,
      name: (payload.name as string) || undefined,
      emailVerified:
        payload.email_verified === true || payload.emailVerified === true,
    };
  } catch (error) {
    return null;
  }
}
