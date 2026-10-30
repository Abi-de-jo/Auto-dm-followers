import { NextRequest, NextResponse } from "next/server";
import { parseMetaSignedRequest } from "@/lib/meta-signed-request";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  let signedRequest: string | null = null;
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    const value = formData.get("signed_request");
    if (typeof value === "string") {
      signedRequest = value;
    }
  } else {
    try {
      const json = (await req.json()) as { signed_request?: string };
      signedRequest = json.signed_request || null;
    } catch {
      // ignore
    }
  }

  if (!signedRequest) {
    return NextResponse.json({ error: "Missing signed_request" }, { status: 400 });
  }

  const payload = parseMetaSignedRequest(signedRequest);
  if (!payload || !payload.user_id) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const igUserId = String(payload.user_id);
  const confirmationCode = `del_${Date.now()}_${igUserId.slice(-6)}`;

  // Delete all user connections & associated automations
  await prisma.instagramConnection.deleteMany({
    where: { igUserId },
  });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin ||
    "http://localhost:3000";

  return NextResponse.json({
    url: `${appUrl}/deletion-status?code=${confirmationCode}`,
    confirmation_code: confirmationCode,
  });
}
