import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPrivateReply, sendPublicReply } from "@/lib/instagram";

/**
 * Validates the X-Hub-Signature-256 header using the raw request body.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secrets = [
    process.env.META_APP_SECRET,
    process.env.INSTAGRAM_APP_SECRET,
    process.env.INSTAGRAM_CLIENT_SECRET,
  ].filter(Boolean) as string[];

  if (secrets.length === 0) {
    return false;
  }

  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const providedSignature = signatureHeader.substring("sha256=".length);

  for (const secret of secrets) {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");

    try {
      if (
        crypto.timingSafeEqual(
          Buffer.from(providedSignature, "hex"),
          Buffer.from(expectedSignature, "hex")
        )
      ) {
        return true;
      }
    } catch {
      // Continue to next secret
    }
  }

  return false;
}

export interface WebhookCommentChange {
  id: string; // Comment ID
  text: string;
  from: {
    id: string;
    username?: string;
  };
  media?: {
    id: string;
    media_product_type?: string;
  };
}

export interface WebhookMessageAttachment {
  type: "image" | "video" | "audio" | "file" | "share" | "story_mention" | "ig_reel" | "reel" | string;
  payload: {
    url?: string;
  };
}

export interface WebhookMessagingItem {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    attachments?: WebhookMessageAttachment[];
    is_echo?: boolean;
    is_deleted?: boolean;
    is_unsupported?: boolean;
    quick_reply?: { payload: string };
    reply_to?: { mid?: string; story?: { url?: string; id?: string } };
  };
  reaction?: {
    mid: string;
    action: "react" | "unreact";
    reaction?: string;
    emoji?: string;
  };
  postback?: {
    mid?: string;
    title?: string;
    payload: string;
  };
  read?: {
    mid: string;
  };
}

export interface WebhookEntry {
  id: string; // Instagram Account ID
  time: number;
  changes?: Array<{
    field: string;
    value: WebhookCommentChange;
  }>;
  messaging?: WebhookMessagingItem[];
}

export interface WebhookPayload {
  object: string;
  entry?: WebhookEntry[];
}
/**
 * Tests if comment text matches automation trigger conditions.
 */
export function testKeywordMatch(
  commentText: string,
  keywords: string[],
  matchMode: string
): boolean {
  if (matchMode === "any_comment") {
    return true;
  }
  // Normalize unicode, collapse whitespace, strip accents
  const normalizedComment = commentText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Strip leading/trailing non-alphanumeric punctuation for exact match
  const strippedComment = normalizedComment.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

  if (matchMode === "exact") {
    return keywords.some((kw) => {
      const target = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
      return normalizedComment === target || strippedComment === target;
    });
  }

  // Default: "contains" (case-insensitive, accent-insensitive, punctuation-tolerant)
  return keywords.some((kw) => {
    const target = kw
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    if (!target) return false;
    return normalizedComment.includes(target);
  });
}

/**
 * Processes an individual comment event asynchronously with idempotency.
 */
export async function processCommentEvent(
  igAccountId: string,
  change: WebhookCommentChange
): Promise<void> {
  const commentId = change.id;
  const commenterId = change.from?.id;
  const commenterUsername = change.from?.username || "unknown";
  const commentText = change.text || "";
  const mediaId = change.media?.id || null;

  if (!commentId || !commenterId) {
    return;
  }
  console.log(`[Webhook] Processing comment: ${commentId} from @${commenterUsername} on account ${igAccountId}`);

  // 1. Find connected account in DB (by igUserId or mediaId fallback)
  let connection = await prisma.instagramConnection.findFirst({
    where: {
      OR: [{ igUserId: igAccountId }, { id: igAccountId }],
      status: "active",
    },
  });

  if (!connection && mediaId) {
    const autoWithConn = await prisma.automation.findFirst({
      where: { mediaId, isActive: true },
      include: { connection: true },
    });
    if (autoWithConn?.connection) {
      connection = autoWithConn.connection;
    }
  }

  if (!connection || connection.status !== "active") {
    console.log(`[Webhook] No active connection found for account ${igAccountId}`);
    return;
  }
  console.log(`[Webhook] Connection active: @${connection.username} (${connection.id})`);

  // 2. Prevent self-comment reply loop: completely drop comments from the creator themselves
  if (
    commenterId === connection.igUserId ||
    commenterUsername.toLowerCase() === connection.username.toLowerCase()
  ) {
    console.log(`[Webhook] Self-comment ignored: @${commenterUsername} commented on their own post.`);
    return;
  }

  // 3. Check for existing event to guarantee strict idempotency
  const existingEvent = await prisma.event.findUnique({
    where: { commentId },
  });

  if (existingEvent) {
    // Already processed or in progress
    return;
  }

  // 4. Find matching active automation for this connection
  // Media ID can match specific post or null ("Any post")
  const automations = await prisma.automation.findMany({
    where: {
      connectionId: connection.id,
      isActive: true,
      OR: [{ mediaId: mediaId }, { mediaId: null }],
    },
    orderBy: {
      // Prioritize specific media match over "any post"
      mediaId: "desc",
    },
  });

  const matchingAutomation = automations.find((auto) =>
    testKeywordMatch(commentText, auto.keywords, auto.matchMode)
  );
  console.log(`[Webhook] Matching automation: ${matchingAutomation ? matchingAutomation.id : "none"}`);

  // 5. Create event row
  let eventRecord;
  try {
    const trackingSlug = matchingAutomation?.linkUrl
      ? crypto.randomBytes(6).toString("hex")
      : null;

    const matchedKeyword = matchingAutomation?.keywords.find((kw) =>
      commentText.toLowerCase().includes(kw.toLowerCase())
    ) || matchingAutomation?.keywords[0] || null;

    eventRecord = await prisma.event.create({
      data: {
        commentId,
        connectionId: connection.id,
        mediaId,
        commenterId,
        commenterUsername,
        commentText,
        commentCreatedAt: new Date(),
        matchedKeyword,
        matchStatus: matchingAutomation ? "matched" : "ignored",
        trackingSlug,
        automationId: matchingAutomation?.id || null,
        status: matchingAutomation ? "matched" : "skipped",
        error: matchingAutomation ? null : "No matching keywords or post filter",
      },
    });
  } catch (err: unknown) {
    console.error("[Webhook] Failed to create event record:", err);
    return;
  }

  if (!matchingAutomation) {
    return;
  }

  // 6. Send private reply (DM) with short link and measure exact response time
  const startTime = Date.now();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://freshdm.io";
  const trackedLink = eventRecord.trackingSlug
    ? `${appUrl}/r/${eventRecord.trackingSlug}`
    : matchingAutomation.linkUrl;

  // Anti-Spam Safety: Natural human jitter delay (1.2 to 2.8 seconds)
  // Prevents instant robotic burst timing that triggers Instagram spam algorithms
  const humanJitterMs = Math.floor(Math.random() * 1600) + 1200;
  await new Promise((resolve) => setTimeout(resolve, humanJitterMs));

  try {
    // Option 4: A/B variant selection (Alternates between dmText and dmVariantB if provided)
    let selectedText = matchingAutomation.dmText;
    let variantUsed = "A";
    if (matchingAutomation.dmVariantB) {
      // 50/50 randomized split testing
      if (Math.random() > 0.5) {
        selectedText = matchingAutomation.dmVariantB;
        variantUsed = "B";
      }
    }

    // If captureEmail is enabled, do NOT send the link yet — first wait for them to give their email!
    const linkToSend = matchingAutomation.captureEmail ? null : trackedLink;
    const labelToSend = matchingAutomation.captureEmail ? null : matchingAutomation.linkLabel;

    const { messageId } = await sendPrivateReply({
      connectionId: connection.id,
      commentId,
      commenterUsername,
      text: selectedText,
      linkUrl: linkToSend,
      linkLabel: labelToSend,
    });
    const responseTimeMs = Date.now() - startTime;

    await prisma.event.update({
      where: { id: eventRecord.id },
      data: {
        status: "sent",
        apiResponseId: messageId,
        responseTimeMs,
        variantUsed,
      },
    });

    // 7. Send optional public comment reply if configured (supports randomized human alternative replies)
    if (matchingAutomation.publicReply) {
      try {
        // Human spacing: wait 1.5 to 3 seconds before posting the public comment
        const publicDelayMs = Math.floor(Math.random() * 1500) + 1500;
        await new Promise((resolve) => setTimeout(resolve, publicDelayMs));

        const rawReplies = matchingAutomation.publicReply.split("|").map((r) => r.trim()).filter(Boolean);
        const pickedReply = rawReplies[Math.floor(Math.random() * rawReplies.length)] || rawReplies[0];

        const publicText = pickedReply.replace(
          /\{\{username\}\}/gi,
          commenterUsername ? `@${commenterUsername}` : "there"
        );
        const { replyId } = await sendPublicReply({
          connectionId: connection.id,
          commentId,
          replyText: publicText,
        });
        await prisma.event.update({
          where: { id: eventRecord.id },
          data: {
            publicReplyStatus: "sent",
            publicReplySentAt: new Date(),
            publicReplyId: replyId,
          },
        });
      } catch {
        await prisma.event.update({
          where: { id: eventRecord.id },
          data: {
            publicReplyStatus: "failed",
          },
        });
      }
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    await prisma.event.update({
      where: { id: eventRecord.id },
      data: {
        status: "failed",
        error: errorMessage,
        retryCount: { increment: 1 },
      },
    });
  }
  return;
}

/**
 * Top-level processor for incoming webhook payload.
 */
export async function processWebhookPayload(payload: WebhookPayload): Promise<void> {
  if (payload.object !== "instagram" || !Array.isArray(payload.entry)) {
    return;
  }
  console.log(`[Webhook] Received payload for object: ${payload.object}, entries: ${payload.entry.length}`);

  for (const entry of payload.entry) {
    const igAccountId = entry.id;

    // 1. Process public comments changes
    if (entry.changes && Array.isArray(entry.changes)) {
      for (const change of entry.changes) {
        if (change.field === "comments" && change.value) {
          await processCommentEvent(igAccountId, change.value);
        }
      }
    }

    // 2. Process Instagram Direct Messages, story mentions & quick replies
    if (entry.messaging && Array.isArray(entry.messaging)) {
      for (const msgItem of entry.messaging) {
        await processDirectMessageEvent(igAccountId, msgItem);
      }
    }
  }
}

/**
 * Handles incoming direct messages, story mentions, and keyword trigger DMs.
 */
export async function processDirectMessageEvent(
  igAccountId: string,
  item: WebhookMessagingItem
): Promise<void> {
  // Ignore echoes sent by our own business account
  if (item.message?.is_echo) {
    return;
  }

  const senderId = item.sender?.id;
  const messageId = item.message?.mid;
  const text = item.message?.text || "";
  // Strictly distinguish between real Story Mentions vs. forwarded Reels/Shares
  const isRealStoryMention =
    item.message?.attachments?.some((a) => a.type === "story_mention") ||
    Boolean(item.message?.reply_to?.story);

  const isSharedPostOrReel =
    item.message?.attachments?.some(
      (a) => a.type === "share" || a.type === "ig_reel" || a.type === "reel" || a.type === "ig_post"
    );

  if (!senderId || !messageId) {
    return;
  }
  console.log(
    `[Webhook DM] Inbound message from IGSID: ${senderId}, mid: ${messageId}, isStoryMention: ${isRealStoryMention}, isSharedMedia: ${isSharedPostOrReel}`
  );
  // Find the connection that actually received this message. Never fall back
  // to an arbitrary account: doing so could process one tenant's DM with
  // another tenant's connection.
  const recipientId = item.recipient?.id;
  const connection = await prisma.instagramConnection.findFirst({
    where: {
      OR: [
        { igUserId: igAccountId },
        { id: igAccountId },
        ...(recipientId ? [{ igUserId: recipientId }] : []),
      ],
      status: "active",
    },
  });

  if (!connection) {
    console.log(`[Webhook DM] No active connection for ${igAccountId}`);
    return;
  }
  // Prevent loops
  if (senderId === connection.igUserId) {
    return;
  }
  // Deduplication
  const existing = await prisma.event.findUnique({
    where: { commentId: messageId },
  });
  if (existing) {
    return;
  }

  // 1. Check for Active Human Handover for this sender
  const recentHandover = await prisma.event.findFirst({
    where: {
      commenterId: senderId,
      isHumanHandover: true,
      humanHandoverAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) }, // 24-hr pause
    },
  });

  if (recentHandover) {
    console.log(`[Human Handover] Suppressing bot reply for IGSID ${senderId} - Human in control.`);
    return;
  }

  // 2. Check if follower is requesting human help (Option 7 Trigger)
  const lowerText = text.toLowerCase().trim();
  const isHumanHelpRequest =
    lowerText === "human" ||
    lowerText === "help" ||
    lowerText === "agent" ||
    lowerText === "support" ||
    lowerText.includes("talk to human") ||
    lowerText.includes("real person");

  if (isHumanHelpRequest) {
    console.log(`[Human Handover Triggered] User ${senderId} requested human support.`);
    await prisma.event.create({
      data: {
        commentId: messageId,
        commenterId: senderId,
        commenterUsername: "instagram_user",
        commentText: text,
        isHumanHandover: true,
        humanHandoverAt: new Date(),
        status: "sent",
      },
    });

    const { sendDirectMessage } = await import("@/lib/instagram");
    await sendDirectMessage({
      connectionId: connection.id,
      recipientIgSid: senderId,
      text: "👋 I've paused automated replies for you. The creator has been notified and will message you directly shortly!",
      replyToMid: messageId,
    });
    return;
  }

  // 3. Check for In-Chat Email Capture (Option 6)
  // If the user replies with an email pattern (e.g. name@example.com)
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = text.match(emailRegex);

  if (emailMatch) {
    const extractedEmail = emailMatch[1].toLowerCase().trim();
    console.log(`[Email Captured] Captured lead email: ${extractedEmail} from IGSID: ${senderId}`);

    await prisma.event.create({
      data: {
        commentId: messageId,
        commenterId: senderId,
        commenterUsername: "instagram_user",
        commentText: text,
        capturedEmail: extractedEmail,
        status: "sent",
      },
    });
    // Find the active automation to get the promised resource/link to deliver
    const activeAuto = await prisma.automation.findFirst({
      where: { connectionId: connection.id, captureEmail: true, isActive: true },
    });

    // 1. Dispatch real email to their Gmail inbox via Resend
    try {
      const { sendLeadDeliveryEmail } = await import("@/lib/resend");
      await sendLeadDeliveryEmail({
        toEmail: extractedEmail,
        creatorName: connection.username ? `@${connection.username}` : "Creator",
        automationName: activeAuto?.name || "Your Requested Guide",
        linkUrl: activeAuto?.linkUrl || null,
        linkLabel: activeAuto?.linkLabel || "Tap to Open",
      });
    } catch (emailErr) {
      console.error("[Email Delivery Error] Failed to send email via Resend:", emailErr);
    }

    // 2. Reply in Instagram Chat with confirmation + instant link access
    let confirmationText = `🎉 Thank you! We've saved ${extractedEmail} and sent your guide directly to your email inbox!`;
    if (activeAuto?.linkUrl) {
      const label = activeAuto.linkLabel ? `${activeAuto.linkLabel}: ` : "Here is your instant access link: ";
      confirmationText += `\n\n${label}${activeAuto.linkUrl}`;
    }

    const { sendDirectMessage } = await import("@/lib/instagram");
    await sendDirectMessage({
      connectionId: connection.id,
      recipientIgSid: senderId,
      text: confirmationText,
      replyToMid: messageId,
    });
    return;
  }

  // 4. Find matching automation
  const automations = await prisma.automation.findMany({
    where: {
      connectionId: connection.id,
      isActive: true,
    },
  });
  // 1. If this is a real Story Mention: match automations listening on Stories
  // 2. If this is a forwarded Reel/Post: match automations with replyToReelShares enabled
  // 3. Otherwise: match standard keyword DM automations
  const matching = automations.find((a) => {
    if (isRealStoryMention) {
      return a.listenOnStories || a.keywords.some((k) => k.toLowerCase() === "story");
    }
    if (isSharedPostOrReel && !text.trim()) {
      return a.replyToReelShares;
    }
    return testKeywordMatch(text, a.keywords, a.matchMode);
  });

  // Record event
  const eventRecord = await prisma.event.create({
    data: {
      commentId: messageId,
      commenterId: senderId,
      commenterUsername: "instagram_user",
      commentText: isRealStoryMention
        ? "Tagged you in their Story"
        : isSharedPostOrReel
        ? "Forwarded a Reel/Post in DM"
        : text,
      automationId: matching?.id || null,
      status: matching ? "matched" : "skipped",
      error: matching ? null : "No matching rule for incoming DM",
    },
  });

  if (!matching) {
    return;
  }

  // Dispatch automated reply back to the conversation
  try {
    let replyText = matching.dmText;
    let shouldAttachLink = Boolean(matching.linkUrl);

    if (isRealStoryMention && matching.storyDmText) {
      replyText = matching.storyDmText;
    } else if (isSharedPostOrReel && matching.reelShareDmText) {
      replyText = matching.reelShareDmText;
      // Do NOT attach the promotion link to simple forwarded reels/shares
      shouldAttachLink = false;
    }

    if (shouldAttachLink && matching.linkUrl) {
      const label = matching.linkLabel ? `${matching.linkLabel}: ` : "Link: ";
      replyText += `\n\n${label}${matching.linkUrl}`;
    }
    const { sendDirectMessage } = await import("@/lib/instagram");
    const { messageId: sentId } = await sendDirectMessage({
      connectionId: connection.id,
      recipientIgSid: senderId,
      text: replyText,
      replyToMid: messageId,
    });

    await prisma.event.update({
      where: { id: eventRecord.id },
      data: {
        status: "sent",
        apiResponseId: sentId,
      },
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await prisma.event.update({
      where: { id: eventRecord.id },
      data: {
        status: "failed",
        error: errMsg,
      },
    });
  }
}
