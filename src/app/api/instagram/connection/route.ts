import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connection = await prisma.instagramConnection.findFirst({
    where: {
      userId: userSession.id,
      status: "active",
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      status: true,
    },
  });

  return NextResponse.json({ connection: connection || null });
}
