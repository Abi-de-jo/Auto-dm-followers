import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAppUser, getUserFromNeonSessionToken } from "@/lib/session";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  image: z.string().url().max(2048).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      user?: { name?: unknown; image?: unknown };
      session?: { token?: unknown };
    };

    // Only accept identity that can be proven by a verified session. Prefer
    // the explicit session token so we can persist it as an httpOnly cookie,
    // then fall back to any session the request already carries.
    const authHeader = req.headers.get("authorization");
    const bearerToken =
      authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    const bodyToken =
      typeof body.session?.token === "string" ? body.session.token : null;
    const sessionToken = bodyToken || bearerToken;

    let user = sessionToken
      ? await getUserFromNeonSessionToken(sessionToken)
      : null;
    let verifiedSessionToken: string | null = user ? sessionToken : null;

    if (!user) {
      user = await getAppUser();
    }

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Profile fields may be refreshed for the authenticated user only.
    const parsedProfile = profileSchema.safeParse(body.user ?? {});
    if (parsedProfile.success && (parsedProfile.data.name || parsedProfile.data.image)) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: parsedProfile.data.name ?? undefined,
          image: parsedProfile.data.image ?? undefined,
        },
      });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: dbUser });

    // Persist the verified Neon session so later requests can authenticate
    // even if the auth client did not set a same-site cookie. The value was
    // validated above, and remains valid only while Neon accepts it.
    if (verifiedSessionToken) {
      const isSecure =
        req.nextUrl.protocol === "https:" ||
        req.headers.get("x-forwarded-proto") === "https";
      response.cookies.set("better-auth.session_token", verifiedSessionToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 3600,
      });
      if (isSecure) {
        response.cookies.set("__Secure-better-auth.session_token", verifiedSessionToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 3600,
        });
      }
    }

    return response;
  } catch (err: unknown) {
    console.error("[sync-session] Failed to sync session:", err);
    return NextResponse.json({ error: "Failed to sync session" }, { status: 500 });
  }
}
