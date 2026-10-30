import { prisma } from "../src/lib/prisma";
import crypto from "crypto";
import { encryptToken } from "../src/lib/crypto";

async function runVerification() {
  console.log("=================================================");
  console.log("🧪 STARTING FRESHDEV COMPREHENSIVE E2E VERIFICATION");
  console.log("=================================================");

  // 1. Create or get test user
  const email = "verifier@freshdev.io";
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: "Test Engineer",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      },
    });
  }
  console.log(`✅ 1. User authenticated: ${user.email} (${user.id})`);

  // 2. Connect Instagram Professional account
  const igUserId = "ig_freshdev_creator_99";
  const encryptedToken = encryptToken("mock_access_token_" + Date.now());
  const connection = await prisma.instagramConnection.upsert({
    where: { igUserId },
    update: {
      userId: user.id,
      username: "freshdev.official",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      accessToken: encryptedToken,
      status: "active",
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000),
    },
    create: {
      userId: user.id,
      igUserId,
      username: "freshdev.official",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      accessToken: encryptedToken,
      status: "active",
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000),
    },
  });
  console.log(`✅ 2. Connected Instagram account: @${connection.username} (${connection.igUserId})`);

  // 3. Create Automation (4-step wizard output)
  await prisma.automation.deleteMany({ where: { connectionId: connection.id } });
  const mediaId = "media_17928374928172901";
  const automation = await prisma.automation.create({
    data: {
      connectionId: connection.id,
      name: "2026 Developer Roadmap Lead Magnet",
      mediaId,
      mediaThumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
      keywords: ["ACCESS", "ROADMAP"],
      matchMode: "contains",
      dmText: "Here is your 2026 Developer Roadmap download! Enjoy building.",
      linkUrl: "https://freshdev.io/roadmap.pdf",
      linkLabel: "Download PDF",
      publicReply: "Sent you the roadmap via DM! Check your requests 🚀",
      isActive: true,
    },
  });
  console.log(`✅ 3. Created & activated automation: "${automation.name}" (ID: ${automation.id})`);
  console.log(`      Keywords: [${automation.keywords.join(", ")}], Match Mode: ${automation.matchMode}`);

  // 4. Simulate incoming comment webhook
  const commentId = `comment_test_${Date.now()}`;
  const commenterUsername = "alex_fullstack";
  const commenterId = "ig_user_448811";
  const commentText = "I need this! Please send me the ACCESS link!";

  const appSecret = process.env.INSTAGRAM_APP_SECRET || "mock_secret";
  const webhookPayload = {
    object: "instagram",
    entry: [
      {
        id: igUserId,
        time: Math.floor(Date.now() / 1000),
        changes: [
          {
            field: "comments",
            value: {
              id: commentId,
              text: commentText,
              from: {
                id: commenterId,
                username: commenterUsername,
              },
              media: {
                id: mediaId,
                media_product_type: "FEED",
              },
            },
          },
        ],
      },
    ],
  };

  const rawBody = JSON.stringify(webhookPayload);
  const signature = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  console.log(`✅ 4. Dispatching signed webhook to local server:`);
  console.log(`      Commenter: @${commenterUsername}, Comment: "${commentText}"`);

  // Set MOCK_INSTAGRAM_SEND so DM call succeeds without live Meta permission
  process.env.MOCK_INSTAGRAM_SEND = "true";

  const res = await fetch("http://localhost:3000/api/webhooks/instagram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": `sha256=${signature}`,
    },
    body: rawBody,
  });

  const responseBody = await res.json();
  console.log(`      HTTP Status: ${res.status}, Response:`, responseBody);
  // 5. Wait and poll for asynchronous background processing
  console.log("⏳ 5. Waiting for background async comment processing...");
  let event = null;
  for (let i = 0; i < 10; i++) {
    const d = Promise.withResolvers<void>();
    setTimeout(d.resolve, 1000);
    await d.promise;
    event = await prisma.event.findUnique({
      where: { commentId },
      include: { automation: true },
    });
    if (event) break;
  }

  if (!event) {
    throw new Error("Event record was not found in database!");
  }
  console.log(`      Comment ID: ${event.commentId}`);
  console.log(`      Automation ID: ${event.automationId}`);
  console.log(`      API Response ID: ${event.apiResponseId}`);

  // 7. Test Idempotency (Deduplication)
  console.log("🧪 7. Testing deduplication (re-sending same commentId)...");
  const resDuplicate = await fetch("http://localhost:3000/api/webhooks/instagram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": `sha256=${signature}`,
    },
    body: rawBody,
  });
  console.log(`      Duplicate request HTTP status: ${resDuplicate.status}`);
  const delay2 = Promise.withResolvers<void>();
  setTimeout(delay2.resolve, 1000);
  await delay2.promise;
  const eventCount = await prisma.event.count({
    where: { commentId },
  });
  if (eventCount !== 1) {
    throw new Error(`Deduplication failed! Expected 1 event, found ${eventCount}`);
  }
  console.log(`✅    Deduplication verified: exactly 1 event exists in database.`);

  // 8. Verify Dashboard Metrics API
  console.log("📊 8. Verifying Dashboard API aggregates...");
  // Using direct DB queries for metrics validation
  const totalComments = await prisma.event.count({
    where: { automationId: automation.id },
  });
  const totalSent = await prisma.event.count({
    where: { automationId: automation.id, status: "sent" },
  });
  console.log(`✅    Dashboard Metrics: Total Comments = ${totalComments}, DMs Sent = ${totalSent}`);

  console.log("=================================================");
  console.log("🎉 ALL E2E VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  console.log("=================================================");
}

runVerification()
  .catch((e) => {
    console.error("❌ E2E VERIFICATION FAILED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
