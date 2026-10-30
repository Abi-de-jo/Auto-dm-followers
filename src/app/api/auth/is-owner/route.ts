import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { isOwnerEmail } from "@/lib/owner";

/**
 * Checks if the current request belongs to the configured platform owner.
 * Ownership requires a verified session for an allowlisted email.
 */
export async function GET() {
  try {
    const userSession = await getAppUser();
    const isOwner = isOwnerEmail(userSession?.email);

    return NextResponse.json({ isOwner });
  } catch {
    return NextResponse.json({ isOwner: false });
  }
}
