import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyNeonToken } from "@/lib/neon";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin ||
    "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(error)}`);
  }

  // 1. If JWT token is provided directly
  if (token) {
    const verified = await verifyNeonToken(token);
    if (verified?.email && verified.emailVerified) {
      await prisma.user.upsert({
        where: { email: verified.email },
        update: { name: verified.name },
        create: {
          email: verified.email,
          name: verified.name || verified.email.split("@")[0],
        },
      });
      return NextResponse.redirect(`${appUrl}/dashboard`);
    }

    return NextResponse.redirect(
      `${appUrl}/login?error=${encodeURIComponent("This sign-in link is invalid or has expired.")}`
    );
  }

  return NextResponse.redirect(
    `${appUrl}/login?error=${encodeURIComponent(code ? "Complete sign-in from the original browser window." : "This sign-in link is incomplete.")}`
  );
}
