import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  processWebhookPayload,
  WebhookPayload,
} from "@/lib/webhook-processor";
import { checkRateLimit } from "@/lib/rate-limit";

// Helper for asynchronous background task dispatching
function runAfterResponse(task: () => Promise<void> | void): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nextServer = require("next/server");
    if (typeof nextServer.after === "function") {
      nextServer.after(task);
      return;
    }
  } catch {
    // Proceed to setImmediate
  }
  setImmediate(() => {
    Promise.resolve()
      .then(task)
      .catch((err) => {
        console.error("Error processing webhook in background:", err);
      });
  });
}

/**
 * GET: Webhook verification handshake from Meta
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const expectedToken = process.env.VERIFY_TOKEN;

  console.log(`[Webhook Verification] GET mode=${mode}, tokenMatch=${token === expectedToken}`);
  if (mode === "subscribe" && token === expectedToken && challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST: Receive webhook event from Meta
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const signature = req.headers.get("x-hub-signature-256");
    console.log(`[Webhook Inbound] POST received from ${ip}, signature: ${signature ? "present" : "MISSING"}`);

    const rawBody = await req.text();

    // Validate HMAC-SHA256 signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn(`[Webhook Inbound] Invalid signature from ${ip}. Dropping payload safely without non-200 response to prevent retry storm.`);
      // Always return 200 so Meta does not retry indefinitely and penalize the app
      return NextResponse.json({ received: true }, { status: 200 });
    }

    let payload: WebhookPayload;
    try {
      payload = JSON.parse(rawBody) as WebhookPayload;
    } catch {
      console.warn(`[Webhook Inbound] Malformed JSON payload received. Dropping safely.`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Delegate processing asynchronously in the background
    runAfterResponse(async () => {
      try {
        await processWebhookPayload(payload);
      } catch (err: unknown) {
        console.error("[Webhook Background] Error processing payload:", err);
      }
    });

    // Always return HTTP 200 OK immediately
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("[Webhook Inbound] Unexpected error handling webhook:", err);
    // Always return 200 so Meta does not retry or suspend the webhook subscription
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
