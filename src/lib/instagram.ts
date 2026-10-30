import crypto from "crypto";
import { encryptToken, decryptToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

const GRAPH_API_VERSION = "v21.0";
const GRAPH_BASE = "https://graph.instagram.com";

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_product_type?: "REELS" | "FEED" | "STORY" | "AD" | string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
}

/**
 * Creates a signed state string tied to the logged-in user to prevent CSRF.
 */
export function createSignedOAuthState(userId: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required to sign OAuth state");
  }
  const timestamp = Date.now().toString();
  const payload = `${userId}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

/**
 * Verifies the OAuth state string and returns the userId if valid and within 15 minutes.
 */
export function verifySignedOAuthState(state: string): string | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return null;
    }
    const decoded = Buffer.from(state, "base64url").toString("utf-8");
    const [userId, timestampStr, signature] = decoded.split(":");
    if (!userId || !timestampStr || !signature) {
      return null;
    }

    const payload = `${userId}:${timestampStr}`;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const providedBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    if (
      providedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
      return null;
    }

    const timestamp = Number(timestampStr);
    if (!Number.isFinite(timestamp)) {
      return null;
    }

    const ageMs = Date.now() - timestamp;
    if (ageMs < 0 || ageMs > 15 * 60 * 1000) {
      // Invalid future timestamp or expired after 15 minutes
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

/**
 * Generates appsecret_proof for Meta Graph API calls.
 * Calculated as: hash_hmac('sha256', access_token, app_secret).
 * Resolves from INSTAGRAM_APP_SECRET or META_APP_SECRET.
 */
export function generateAppSecretProof(accessToken: string): string | null {
  const secret = process.env.INSTAGRAM_APP_SECRET || process.env.META_APP_SECRET;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(accessToken).digest("hex");
}

/**
 * Returns the official OAuth authorization URL for Instagram Business Login.
 * Meta Official Endpoint: https://www.instagram.com/oauth/authorize
 */
export function getInstagramAuthorizeUrl(userId: string, redirectUri: string): string {
  const appId = process.env.INSTAGRAM_CLIENT_ID || process.env.INSTAGRAM_APP_ID;
  if (!appId) {
    throw new Error("INSTAGRAM_APP_ID is not configured");
  }

  const state = createSignedOAuthState(userId);
  const scopes = [
    "instagram_business_basic",
    "instagram_business_manage_messages",
    "instagram_business_manage_comments",
    "instagram_business_manage_insights",
  ].join(",");

  const params = new URLSearchParams({
    enable_fb_login: "0",
    force_authentication: "1",
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes,
    state,
  });

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
}

/**
 * Exchanges auth code for a token using either Instagram Direct API or Facebook Graph API.
 */
export async function exchangeCodeForShortLivedToken(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; userId: string }> {
  const appId = process.env.INSTAGRAM_CLIENT_ID || process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_CLIENT_SECRET || process.env.INSTAGRAM_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("Instagram App ID or Secret missing");
  }

  // Clean any #_ or trailing fragment added by Meta redirects
  const cleanCode = code.replace(/#_.*$/, "").trim();

  // 1. Try direct Instagram token exchange with x-www-form-urlencoded body (standard Meta OAuth)
  try {
    const body = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code: cleanCode,
    });

    const res = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = (await res.json()) as {
      access_token?: string;
      user_id?: string | number;
      error_message?: string;
      error?: { message: string };
    };

    if (res.ok && data.access_token) {
      return {
        accessToken: data.access_token,
        userId: data.user_id ? String(data.user_id) : "",
      };
    }
  } catch {
    // Fall back to Facebook Graph API
  }
  // 2. Fallback to Facebook Graph API exchange
  const url = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("code", cleanCode);

  const res = await fetch(url.toString(), {
    method: "GET",
  });

  const data = (await res.json()) as {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    error?: { message: string };
  };

  if (!res.ok || !data.access_token) {
    throw new Error(data.error?.message || "Failed to exchange authorization code");
  }

  return {
    accessToken: data.access_token,
    userId: "",
  };
}

/**
 * Exchanges a token for a 60-day long-lived token via graph.instagram.com or graph.facebook.com.
 */
export async function exchangeForLongLivedToken(
  shortLivedToken: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const appId = process.env.INSTAGRAM_CLIENT_ID || process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_CLIENT_SECRET || process.env.INSTAGRAM_APP_SECRET;

  if (!appSecret) {
    throw new Error("INSTAGRAM_APP_SECRET is not configured");
  }

  // 1. Direct Instagram Graph API exchange
  try {
    const url = new URL("https://graph.instagram.com/access_token");
    url.searchParams.set("grant_type", "ig_exchange_token");
    url.searchParams.set("client_secret", appSecret);
    url.searchParams.set("access_token", shortLivedToken);

    const res = await fetch(url.toString(), { method: "GET" });
    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
    };

    if (res.ok && data.access_token) {
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in ?? 5184000,
      };
    }
  } catch {
    // Fallback to graph.facebook.com
  }

  // 2. Facebook Graph API exchange
  if (appId) {
    const url = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
    url.searchParams.set("grant_type", "fb_exchange_token");
    url.searchParams.set("client_id", appId);
    url.searchParams.set("client_secret", appSecret);
    url.searchParams.set("fb_exchange_token", shortLivedToken);

    const res = await fetch(url.toString(), { method: "GET" });
    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: { message: string };
    };

    if (res.ok && data.access_token) {
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in ?? 5184000,
      };
    }
  }

  return {
    accessToken: shortLivedToken,
    expiresIn: 5184000,
  };
}

/**
 * Refreshes an existing long-lived token.
 */
export async function refreshLongLivedToken(
  token: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const url = new URL(`${GRAPH_BASE}/refresh_access_token`);
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), { method: "GET" });
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: { message: string };
  };

  if (!res.ok || !data.access_token) {
    throw new Error(data.error?.message || "Failed to refresh long-lived token");
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in ?? 5184000,
  };
}

/**
 * Fetches user profile from either graph.facebook.com (Page-linked IG) or graph.instagram.com.
 */
export async function getInstagramAccountDetails(accessToken: string): Promise<{
  id: string;
  username: string;
  name?: string;
  profilePic?: string;
  accountType?: string;
}> {
  // 1. Try querying Facebook Graph API for linked Instagram Business/Creator Account
  try {
    const fbUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account{id,username,profile_picture_url}&access_token=${accessToken}`;
    const fbRes = await fetch(fbUrl);
    if (fbRes.ok) {
      const fbData = await fbRes.json();
      const pages = fbData.data || [];
      for (const page of pages) {
        if (page.instagram_business_account?.id) {
          const ig = page.instagram_business_account;
          return {
            id: ig.id,
            username: ig.username,
            name: page.name,
            profilePic: ig.profile_picture_url,
            accountType: "BUSINESS",
          };
        }
      }
    }
  } catch {
    // Fall back to direct Instagram graph endpoint
  }

  // 2. Direct Instagram Graph API fallback
  const url = new URL(`${GRAPH_BASE}/${GRAPH_API_VERSION}/me`);
  url.searchParams.set(
    "fields",
    "id,username,name,profile_picture_url,account_type"
  );
  url.searchParams.set("access_token", accessToken);
  const proof = generateAppSecretProof(accessToken);
  if (proof) url.searchParams.set("appsecret_proof", proof);

  const res = await fetch(url.toString());
  const data = (await res.json()) as {
    id?: string;
    username?: string;
    name?: string;
    profile_picture_url?: string;
    account_type?: string;
    error?: { message: string };
  };

  if (!res.ok || !data.id || !data.username) {
    throw new Error(data.error?.message || "Failed to fetch Instagram account details");
  }

  return {
    id: data.id,
    username: data.username,
    name: data.name,
    profilePic: data.profile_picture_url,
    accountType: data.account_type || "CREATOR",
  };
}

/**
 * Subscribes the Instagram account to webhooks (comments, messages).
 */
export async function subscribeToWebhooks(accessToken: string): Promise<boolean> {
  const proof = generateAppSecretProof(accessToken);
  const url = `${GRAPH_BASE}/${GRAPH_API_VERSION}/me/subscribed_apps${proof ? `?appsecret_proof=${proof}` : ""}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscribed_fields: ["comments", "messages", "mentions"],
    }),
  });

  const data = (await res.json()) as { success?: boolean; error?: { message: string } };
  if (!res.ok || !data.success) {
    // Non-fatal warning if subscribed_apps endpoint fails in test mode
    return false;
  }
  return true;
}

/**
 * Fetches recent media posts from the Instagram account.
 */
export async function getAccountMedia(
  accessToken: string,
  limit: number = 30
): Promise<InstagramMediaItem[]> {
  const fields = "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp";

  // 1. Try Direct Instagram Graph API (/me/media)
  try {
    const igUrl = new URL(`${GRAPH_BASE}/${GRAPH_API_VERSION}/me/media`);
    igUrl.searchParams.set("fields", fields);
    igUrl.searchParams.set("limit", limit.toString());
    igUrl.searchParams.set("access_token", accessToken);
    const proof = generateAppSecretProof(accessToken);
    if (proof) igUrl.searchParams.set("appsecret_proof", proof);

    const res = await fetch(igUrl.toString());
    const data = (await res.json()) as {
      data?: InstagramMediaItem[];
      error?: { message: string };
    };

    if (res.ok && data.data && data.data.length > 0) {
      return data.data;
    }
  } catch {
    // Continue to Facebook Page fallback
  }

  // 2. Try Facebook Page Graph API (for Page-linked Instagram accounts)
  try {
    const fbAccountsUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account{id}&access_token=${accessToken}`;
    const fbAccountsRes = await fetch(fbAccountsUrl);
    if (fbAccountsRes.ok) {
      const fbAccountsData = await fbAccountsRes.json();
      const igId = fbAccountsData.data?.[0]?.instagram_business_account?.id;
      if (igId) {
        const mediaUrl = `https://graph.facebook.com/v21.0/${igId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;
        const mediaRes = await fetch(mediaUrl);
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          if (mediaData.data && mediaData.data.length > 0) {
            return mediaData.data;
          }
        }
      }
    }
  } catch {
    // Continue
  }

  return [];
}

/**
 * Sends a private reply (DM) to a comment.
 * Meta Endpoint: POST /{igUserId}/messages with recipient: { comment_id }
 */
export async function sendPrivateReply(params: {
  connectionId: string;
  commentId: string;
  text: string;
  commenterUsername?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
}): Promise<{ messageId: string }> {
  if (process.env.MOCK_INSTAGRAM_SEND === "true") {
    return { messageId: `mock_dm_${Date.now()}_${params.commentId}` };
  }

  const connection = await prisma.instagramConnection.findUnique({
    where: { id: params.connectionId },
  });

  if (!connection || connection.status !== "active") {
    throw new Error("Instagram connection not found or not active");
  }

  const decryptedToken = decryptToken(connection.accessToken);

  if (decryptedToken.startsWith("mock_")) {
    return { messageId: `mock_dm_${Date.now()}_${params.commentId}` };
  }

  // Construct message content with {{username}} personalization
  let messageText = params.text;
  if (params.commenterUsername) {
    messageText = messageText.replace(/\{\{username\}\}/gi, `@${params.commenterUsername}`);
  } else {
    messageText = messageText.replace(/\{\{username\}\}/gi, "there");
  }

  if (params.linkUrl) {
    const label = params.linkLabel ? `${params.linkLabel}: ` : "Link: ";
    messageText += `\n\n${label}${params.linkUrl}`;
  }

  const proof = generateAppSecretProof(decryptedToken);
  const url = `${GRAPH_BASE}/${GRAPH_API_VERSION}/me/messages${proof ? `?appsecret_proof=${proof}` : ""}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${decryptedToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: {
        comment_id: params.commentId,
      },
      message: {
        text: messageText,
      },
    }),
  });
  // Monitor Meta Application-Level Rate Limits (200 calls/hr * users) and BUC limits
  const appUsageHeader = res.headers.get("x-app-usage");
  const bucUsageHeader = res.headers.get("x-business-use-case-usage");

  if (appUsageHeader) {
    try {
      const usage = JSON.parse(appUsageHeader) as {
        call_count?: number;
        total_cputime?: number;
        total_time?: number;
      };
      const maxMetric = Math.max(
        usage.call_count || 0,
        usage.total_cputime || 0,
        usage.total_time || 0
      );
      if (maxMetric >= 90) {
        console.warn(`[Meta Critical Rate Limit] ${maxMetric}% consumed. Applying emergency backoff.`);
        await new Promise((r) => setTimeout(r, 2000));
      } else if (maxMetric >= 75) {
        console.warn(`[Meta Rate Limit Warning] ${maxMetric}% capacity consumed.`);
      }
    } catch {}
  }

  if (bucUsageHeader) {
    try {
      const bucMap = JSON.parse(bucUsageHeader);
      for (const accountId in bucMap) {
        const records = bucMap[accountId];
        if (Array.isArray(records)) {
          for (const item of records) {
            const usagePercent = Math.max(
              item.call_count || 0,
              item.total_cputime || 0,
              item.total_time || 0
            );
            if (usagePercent >= 90) {
              console.warn(`[Meta BUC Limit] Account ${accountId} at ${usagePercent}%. Throttling calls.`);
              await new Promise((r) => setTimeout(r, 2000));
            }
          }
        }
      }
    } catch {}
  }
  const data = (await res.json()) as {
    message_id?: string;
    error?: {
      message: string;
      code: number;
      error_subcode?: number;
    };
  };
  if (!res.ok || !data.message_id) {
    const code = data.error?.code || res.status;
    const subcode = data.error?.error_subcode;
    let errorMsg = data.error?.message || `HTTP ${res.status}`;
    const isRateLimit = code === 4 || code === 17 || code === 32 || code === 613;

    if (code === 190) {
      errorMsg = "Instagram token expired or revoked. Please reconnect your account.";
      prisma.instagramConnection.update({
        where: { id: params.connectionId },
        data: { status: "needs_reconnect" },
      }).catch(() => {});
    } else if (subcode === 2534015 || errorMsg.toLowerCase().includes("7 days")) {
      errorMsg = "Meta policy violation: Comments older than 7 days cannot receive private replies.";
    } else if (subcode === 2534014 || errorMsg.toLowerCase().includes("already been replied")) {
      errorMsg = "A private reply has already been sent to this comment (1 DM per comment limit).";
    } else if (
      code === 230 ||
      code === 10 ||
      errorMsg.toLowerCase().includes("privacy") ||
      errorMsg.toLowerCase().includes("cannot message") ||
      errorMsg.toLowerCase().includes("restricted")
    ) {
      errorMsg = "Delivery skipped: Commenter has restricted privacy settings on Instagram that prevent receiving direct messages.";
    } else if (
      errorMsg.toLowerCase().includes("cannot be found") ||
      errorMsg.toLowerCase().includes("does not exist")
    ) {
      errorMsg = "Delivery skipped: Comment was deleted on Instagram before DM could be sent.";
    } else if (isRateLimit) {
      errorMsg = `Meta Rate Limit reached (code ${code}): ${errorMsg}`;
    }
    const err = new Error(errorMsg);
    Object.assign(err, { code, subcode, isRateLimited: isRateLimit });
    throw err;
  }
  return { messageId: data.message_id };
}

/**
 * Sends a direct message to a user by Instagram-scoped ID (IGSID)
 * Endpoint: POST https://graph.facebook.com/<API_VERSION>/me/messages
 * Body: { recipient: { id: "<IGSID>" }, message: { text: "..." }, reply_to?: { mid: "..." } }
 */
export async function sendDirectMessage(params: {
  connectionId: string;
  recipientIgSid: string;
  text: string;
  replyToMid?: string;
}): Promise<{ messageId: string }> {
  if (process.env.MOCK_INSTAGRAM_SEND === "true") {
    return { messageId: `mock_dm_${Date.now()}_${params.recipientIgSid}` };
  }

  const connection = await prisma.instagramConnection.findUnique({
    where: { id: params.connectionId },
  });

  if (!connection || connection.status !== "active") {
    throw new Error("Instagram connection not found or not active");
  }

  const decryptedToken = decryptToken(connection.accessToken);
  if (decryptedToken.startsWith("mock_")) {
    return { messageId: `mock_dm_${Date.now()}_${params.recipientIgSid}` };
  }

  const proof = generateAppSecretProof(decryptedToken);
  const url = `${GRAPH_BASE}/${GRAPH_API_VERSION}/me/messages${proof ? `?appsecret_proof=${proof}` : ""}`;

  const requestBody: {
    recipient: { id: string };
    message: { text: string };
    reply_to?: { mid: string };
  } = {
    recipient: { id: params.recipientIgSid },
    message: { text: params.text.slice(0, 1000) },
  };

  if (params.replyToMid) {
    requestBody.reply_to = { mid: params.replyToMid };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${decryptedToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = (await res.json()) as {
    message_id?: string;
    error?: { message: string; code: number };
  };

  if (!res.ok || !data.message_id) {
    throw new Error(data.error?.message || `Failed to send message: HTTP ${res.status}`);
  }

  return { messageId: data.message_id };
}

/**
 * Posts a public reply to a comment.
 * Meta Endpoint: POST /{commentId}/replies
 */
export async function sendPublicReply(params: {
  connectionId: string;
  commentId: string;
  replyText: string;
}): Promise<{ replyId: string }> {
  if (process.env.MOCK_INSTAGRAM_SEND === "true") {
    return { replyId: `mock_reply_${Date.now()}_${params.commentId}` };
  }

  const connection = await prisma.instagramConnection.findUnique({
    where: { id: params.connectionId },
  });

  if (!connection || connection.status !== "active") {
    throw new Error("Instagram connection not found or not active");
  }

  const decryptedToken = decryptToken(connection.accessToken);
  if (decryptedToken.startsWith("mock_")) {
    return { replyId: `mock_reply_${Date.now()}_${params.commentId}` };
  }
  const proof = generateAppSecretProof(decryptedToken);
  const url = `${GRAPH_BASE}/${GRAPH_API_VERSION}/${params.commentId}/replies${proof ? `?appsecret_proof=${proof}` : ""}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${decryptedToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: params.replyText,
    }),
  });

  const data = (await res.json()) as {
    id?: string;
    error?: { message: string };
  };

  if (!res.ok || !data.id) {
    throw new Error(data.error?.message || "Failed to post public reply");
  }

  return { replyId: data.id };
}

/**
 * Background job to refresh tokens expiring within 7 days.
 */
export async function refreshExpiringTokens(): Promise<{
  refreshed: number;
  failed: number;
}> {
  const threshold = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const connections = await prisma.instagramConnection.findMany({
    where: {
      status: "active",
      tokenExpiresAt: { lte: threshold },
    },
  });

  let refreshed = 0;
  let failed = 0;

  for (const conn of connections) {
    try {
      const currentToken = decryptToken(conn.accessToken);
      const updated = await refreshLongLivedToken(currentToken);
      const newExpiresAt = new Date(Date.now() + updated.expiresIn * 1000);

      await prisma.instagramConnection.update({
        where: { id: conn.id },
        data: {
          accessToken: encryptToken(updated.accessToken),
          tokenExpiresAt: newExpiresAt,
        },
      });
      refreshed++;
    } catch {
      failed++;
      await prisma.instagramConnection.update({
        where: { id: conn.id },
        data: { status: "needs_reconnect" },
      });
    }
  }

  return { refreshed, failed };
}
