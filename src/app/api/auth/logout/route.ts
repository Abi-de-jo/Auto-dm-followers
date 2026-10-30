import { NextResponse } from "next/server";

import { cookies } from "next/headers";

const COOKIES_TO_CLEAR = [
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

export async function POST() {
  const response = NextResponse.json({ success: true });

  // 1. Clear known cookies explicitly
  for (const name of COOKIES_TO_CLEAR) {
    response.cookies.set(name, "", { path: "/", maxAge: 0, expires: new Date(0) });
  }

  // 2. Clear any active request cookies dynamically
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      if (
        cookie.name.includes("auth") ||
        cookie.name.includes("session") ||
        cookie.name.includes("freshdm") ||
        cookie.name.includes("freshdev")
      ) {
        response.cookies.set(cookie.name, "", { path: "/", maxAge: 0, expires: new Date(0) });
      }
    }
  } catch {
    // Continue
  }

  return response;
}
