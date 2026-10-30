import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/crypto";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mockIgUserId = `ig_freshdm_mock_${userSession.id}`;
  const mockUsername = "freshdev.official";
  const mockAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces";
  const mockToken = "mock_long_lived_token_" + Date.now();
  const encryptedToken = encryptToken(mockToken);
  const tokenExpiresAt = new Date(Date.now() + 60 * 24 * 3600 * 1000);

  const connection = await prisma.instagramConnection.upsert({
    where: { igUserId: mockIgUserId },
    update: {
      userId: userSession.id,
      username: mockUsername,
      avatar: mockAvatar,
      accessToken: encryptedToken,
      tokenExpiresAt,
      status: "active",
    },
    create: {
      userId: userSession.id,
      igUserId: mockIgUserId,
      username: mockUsername,
      avatar: mockAvatar,
      accessToken: encryptedToken,
      tokenExpiresAt,
      status: "active",
    },
  });

  return NextResponse.json({
    success: true,
    connection: {
      id: connection.id,
      username: connection.username,
      avatar: connection.avatar,
      status: connection.status,
      tokenExpiresAt: connection.tokenExpiresAt,
    },
  });
}
