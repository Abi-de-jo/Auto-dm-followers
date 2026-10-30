import { NextRequest, NextResponse } from "next/server";
import {
  verifySignedOAuthState,
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  getInstagramAccountDetails,
  subscribeToWebhooks,
} from "@/lib/instagram";
import { encryptToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rawCode = url.searchParams.get("code");
  const code = rawCode ? rawCode.replace(/#_.*$/, "").trim() : null;
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin ||
    "http://localhost:3000";

  if (error) {
    const errorMsg = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(`${appUrl}/instagram?error=${errorMsg}`);
  }

  if (!code) {
    return NextResponse.redirect(
      `${appUrl}/instagram?error=${encodeURIComponent("Missing authorization code")}`
    );
  }

  // 1. Resolve the user strictly from the signed, short-lived OAuth state.
  // Never fall back to a session or "newest user": that would let an
  // unsolicited callback attach an Instagram account to the wrong tenant.
  const userId = state ? verifySignedOAuthState(state) : null;

  if (!userId) {
    return NextResponse.redirect(
      `${appUrl}/instagram?error=${encodeURIComponent(
        "This connection link is invalid or has expired. Please start the connection again."
      )}`
    );
  }

  const owner = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!owner) {
    return NextResponse.redirect(
      `${appUrl}/login?error=${encodeURIComponent("Please log in before connecting your Instagram account.")}`
    );
  }

  const redirectUri = `${appUrl}/api/instagram/callback`;

  try {
    // 2. Exchange code for short-lived token
    const shortLived = await exchangeCodeForShortLivedToken(code, redirectUri);

    // 3. Exchange for 60-day long-lived token
    const longLived = await exchangeForLongLivedToken(shortLived.accessToken);

    // 4. Fetch Instagram account details & assert Business/Creator account
    const accountDetails = await getInstagramAccountDetails(longLived.accessToken);

    // 5. Subscribe to Webhooks
    await subscribeToWebhooks(longLived.accessToken);

    // 6. Encrypt token at rest using AES-256-GCM
    const encryptedToken = encryptToken(longLived.accessToken);
    const tokenExpiresAt = new Date(Date.now() + longLived.expiresIn * 1000);

    // 7. Store or update connection
    await prisma.instagramConnection.upsert({
      where: { igUserId: accountDetails.id },
      update: {
        userId,
        username: accountDetails.username,
        avatar: accountDetails.profilePic || null,
        accessToken: encryptedToken,
        tokenExpiresAt,
        status: "active",
      },
      create: {
        userId,
        igUserId: accountDetails.id,
        username: accountDetails.username,
        avatar: accountDetails.profilePic || null,
        accessToken: encryptedToken,
        tokenExpiresAt,
        status: "active",
      },
    });

    return NextResponse.redirect(`${appUrl}/instagram?success=connected`);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to complete Instagram connection";
    return NextResponse.redirect(
      `${appUrl}/instagram?error=${encodeURIComponent(message)}`
    );
  }
}
