import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete connection and associated automations & events cascade
    await prisma.instagramConnection.deleteMany({
      where: { userId: userSession.id },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to disconnect Instagram account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
