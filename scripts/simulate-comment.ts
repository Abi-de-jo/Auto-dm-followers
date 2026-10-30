import crypto from "crypto";
import fs from "fs";
import path from "path";

// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length > 0) {
        const val = rest.join("=").replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

async function main() {
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  if (!appSecret) {
    console.error("❌ Error: INSTAGRAM_APP_SECRET is not set in environment or .env");
    process.exit(1);
  }

  // Parse command line arguments
  const args = process.argv.slice(2);
  const getArg = (name: string, fallback: string): string => {
    const idx = args.indexOf(`--${name}`);
    if (idx !== -1 && args[idx + 1]) {
      return args[idx + 1];
    }
    return fallback;
  };

  const targetUrl = getArg("url", "http://localhost:3000/api/webhooks/instagram");
  const commentText = getArg("text", "ACCESS please! Send me the link");
  const commenterUsername = getArg("user", "sarah_growth");
  const commenterId = getArg("user-id", "ig_user_87236412");
  const igAccountId = getArg("account", "ig_freshdev_creator_99");
  const mediaId = getArg("media", "media_17928374928172901");
  const commentId = getArg("comment-id", `comment_${Date.now()}`);

  const payload = {
    object: "instagram",
    entry: [
      {
        id: igAccountId,
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

  const rawBody = JSON.stringify(payload);

  // Compute HMAC-SHA256 signature with app secret
  const signature = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  console.log("=================================================");
  console.log("🚀 FreshDev Webhook Comment Simulation");
  console.log("=================================================");
  console.log(`Target:      ${targetUrl}`);
  console.log(`Account ID:  ${igAccountId}`);
  console.log(`Commenter:   @${commenterUsername} (${commenterId})`);
  console.log(`Comment ID:  ${commentId}`);
  console.log(`Text:        "${commentText}"`);
  console.log(`Media ID:    ${mediaId}`);
  console.log(`Signature:   sha256=${signature.slice(0, 16)}...`);
  console.log("-------------------------------------------------");

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hub-signature-256": `sha256=${signature}`,
      },
      body: rawBody,
    });

    const body = await res.text();
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    console.log(`Response:    ${body}`);

    if (res.ok) {
      console.log("-------------------------------------------------");
      console.log("✅ Success! Webhook accepted with valid signature.");
      console.log("Next: Check your FreshDev dashboard (/dashboard) to view");
      console.log("the recorded event and DM dispatch status!");
      console.log("=================================================");
    } else {
      console.log("❌ Webhook was rejected by the server.");
      process.exit(1);
    }
  } catch (err: unknown) {
    console.error("❌ Failed to send request:", err instanceof Error ? err.message : err);
    console.log("Make sure your Next.js server is running: `pnpm dev`");
    process.exit(1);
  }
}

main();
