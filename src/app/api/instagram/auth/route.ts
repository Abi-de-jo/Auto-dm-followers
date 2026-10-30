import { NextRequest, NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { getInstagramAuthorizeUrl } from "@/lib/instagram";

export async function GET(req: NextRequest) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin ||
    "http://localhost:3000";

  const wantsJson =
    req.nextUrl.searchParams.get("format") === "json" ||
    req.headers.get("accept")?.includes("application/json");

  const userSession = await getAppUser();
  if (!userSession?.id) {
    if (wantsJson) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(`${appUrl}/login?callbackUrl=/instagram`);
  }

  const redirectUri = `${appUrl}/api/instagram/callback`;

  try {
    const url = getInstagramAuthorizeUrl(userSession.id, redirectUri);
    if (wantsJson) {
      return NextResponse.json({ url });
    }
    return NextResponse.redirect(url, 302);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate auth URL";
    if (wantsJson) {
      return NextResponse.json({ error: message }, { status: 500 });
    }
    return NextResponse.redirect(
      `${appUrl}/instagram?error=${encodeURIComponent(message)}`,
      302
    );
  }
}
