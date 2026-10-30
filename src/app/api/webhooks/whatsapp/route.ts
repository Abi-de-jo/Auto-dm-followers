import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * GET: Verification handshake from Meta
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const expectedToken = process.env.VERIFY_TOKEN;

  if (mode === "subscribe" && token === expectedToken && challenge) {
    console.log("[WhatsApp Webhook] Handshake verified successfully");
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST: Receive inbound WhatsApp messages & events from Meta
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");

    // Optional validation with app secret if present
    const appSecret = process.env.INSTAGRAM_APP_SECRET || process.env.META_APP_SECRET;
    if (appSecret && signature && signature.startsWith("sha256=")) {
      const expected = crypto
        .createHmac("sha256", appSecret)
        .update(rawBody, "utf8")
        .digest("hex");
      const provided = signature.substring("sha256=".length);
      try {
        if (!crypto.timingSafeEqual(Buffer.from(provided, "hex"), Buffer.from(expected, "hex"))) {
          console.warn("[WhatsApp Webhook] Invalid signature. Dropping.");
          return NextResponse.json({ received: true }, { status: 200 });
        }
      } catch {
        return NextResponse.json({ received: true }, { status: 200 });
      }
    }

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Process WhatsApp events
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry ?? []) {
        for (const change of entry.changes ?? []) {
          const value = change.value;
          if (value?.messages) {
            for (const msg of value.messages) {
              const from = msg.from; // Sender phone number
              const text = msg.text?.body; // Text body if text message
              const type = msg.type; // "text", "image", "button", etc.
              const msgId = msg.id;

              console.log(
                `[WhatsApp Inbound] Received message from ${from} | Type: ${type} | Text: "${text}" | ID: ${msgId}`
              );

              // Message is received for free here.
              // Store to database or trigger business logic.
            }
          }
        }
      }
    }

    // Meta expects 200 OK immediately
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[WhatsApp Webhook] Error processing event:", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
