import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const demoEmail = "creator@autodm.local";
    let user = await prisma.user.findUnique({ where: { email: demoEmail } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: demoEmail,
          name: "Creator",
          image: "/avatars/owner.png",
        },
      });
    }

    const response = NextResponse.json({ success: true, user });

    // Set demo session cookie
    response.cookies.set("autodm_demo_session", user.id, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 3600,
    });

    return response;
  } catch (err: unknown) {
    console.error("[demo-login] Failed to create demo session:", err);
    return NextResponse.json(
      { error: "Failed to create demo session. Make sure your database is connected." },
      { status: 500 }
    );
  }
}
