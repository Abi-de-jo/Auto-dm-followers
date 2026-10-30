import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      connections: {
        select: {
          id: true,
          igUserId: true,
          username: true,
          avatar: true,
          status: true,
          tokenExpiresAt: true,
          createdAt: true,
        },
      },
    },
  });
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}

export async function DELETE() {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Cascades delete User, Accounts, Sessions, Connections, Automations
    await prisma.user.delete({
      where: { id: userSession.id },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
