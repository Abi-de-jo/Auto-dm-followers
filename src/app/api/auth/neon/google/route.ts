import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const neonAuthUrl =
    process.env.NEON_AUTH_URL ||
    "https://ep-orange-wildflower-b52we6r4.neonauth.c-7.us-east-2.aws.neon.tech/neondb/auth";

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin ||
    "http://localhost:3000";

  try {
    // Request social sign-in initiation from Neon Managed Better Auth
    const res = await fetch(`${neonAuthUrl}/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: appUrl,
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL: `${appUrl}/dashboard`,
      }),
    });

    const data = (await res.json()) as { url?: string; error?: string; message?: string };

    if (res.ok && data.url) {
      return NextResponse.redirect(data.url);
    }

    const errorMsg = data.error || data.message || "Failed to initiate Neon Google Auth";
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(errorMsg)}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to connect to Neon Auth";
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(message)}`);
  }
}
