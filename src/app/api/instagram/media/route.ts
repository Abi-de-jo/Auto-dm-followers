import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/crypto";
import { getAccountMedia, InstagramMediaItem } from "@/lib/instagram";

const DEMO_MEDIA: InstagramMediaItem[] = [
  {
    id: "media_17928374928172901",
    caption: "🚀 Our brand new 2026 Developer Roadmap just launched! Comment ACCESS to get the full free PDF guide in your DMs right now.",
    media_type: "IMAGE",
    thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
    permalink: "https://instagram.com/p/example1",
    timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: "media_17928374928172902",
    caption: "5 hidden Next.js performance optimizations you probably didn't know about. Comment OPTIMIZE for the full checklist!",
    media_type: "VIDEO",
    thumbnail_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=600&fit=crop",
    permalink: "https://instagram.com/p/example2",
    timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
  {
    id: "media_17928374928172903",
    caption: "How we scaled to 100,000 users without burning out. Drop a comment with SCALE and I'll send the case study directly to you.",
    media_type: "IMAGE",
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop",
    permalink: "https://instagram.com/p/example3",
    timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: "media_17928374928172904",
    caption: "Behind the scenes building FreshDev. Comment FRESH to test the beta version before public release!",
    media_type: "CAROUSEL_ALBUM",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop",
    permalink: "https://instagram.com/p/example4",
    timestamp: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
  },
];

export async function GET() {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connection = await prisma.instagramConnection.findFirst({
    where: { userId: userSession.id, status: "active" },
  });

  if (!connection) {
    return NextResponse.json(
      { error: "No connected Instagram account found" },
      { status: 400 }
    );
  }

  // If in mock mode or token is simulated
  if (process.env.MOCK_INSTAGRAM_SEND === "true" || connection.accessToken.startsWith("mock_")) {
    return NextResponse.json({ media: DEMO_MEDIA, data: DEMO_MEDIA });
  }

  try {
    const token = decryptToken(connection.accessToken);
    const media = await getAccountMedia(token);
    // If real account has 0 posts yet, provide fallback demo posts so user isn't stuck
    if (!media || media.length === 0) {
      return NextResponse.json({ media: DEMO_MEDIA, data: DEMO_MEDIA });
    }
    return NextResponse.json({ media, data: media });
  } catch (err: unknown) {
    // If live token fetch fails, return mock posts so user can still test wizard smoothly
    return NextResponse.json({ media: DEMO_MEDIA, data: DEMO_MEDIA });
  }
}
