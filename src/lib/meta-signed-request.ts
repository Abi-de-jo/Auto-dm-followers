import crypto from "crypto";

export interface MetaSignedRequestPayload {
  user_id?: string;
  algorithm?: string;
  issued_at?: number;
  [key: string]: unknown;
}

/**
 * Parses and verifies Meta signed_request.
 */
export function parseMetaSignedRequest(
  signedRequest: string
): MetaSignedRequestPayload | null {
  const secret = process.env.INSTAGRAM_APP_SECRET;
  if (!secret) return null;

  try {
    const [encodedSig, payloadStr] = signedRequest.split(".");
    if (!encodedSig || !payloadStr) return null;

    const sig = Buffer.from(encodedSig, "base64url");
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(payloadStr)
      .digest();

    if (!crypto.timingSafeEqual(sig, expectedSig)) {
      return null;
    }

    const payloadJson = Buffer.from(payloadStr, "base64url").toString("utf8");
    return JSON.parse(payloadJson) as MetaSignedRequestPayload;
  } catch {
    return null;
  }
}
