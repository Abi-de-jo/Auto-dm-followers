import { NextRequest, NextResponse } from "next/server";
import { getAppUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createAutomationSchema = z.object({
  connectionId: z.string().min(1),
  name: z.string().optional(),
  mediaId: z.string().nullable().optional(),
  mediaThumbnail: z.string().nullable().optional(),
  mediaCaption: z.string().nullable().optional(),
  keywords: z.array(z.string()).default(["ACCESS"]),
  matchMode: z.enum(["contains", "exact", "any_comment"]).default("contains"),
  dmText: z.string().min(1, "DM text is required").max(1000, "Max 1000 characters"),
  dmVariantB: z.string().max(1000).optional().nullable(),
  captureEmail: z.boolean().default(false),
  linkUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  linkLabel: z.string().max(40).optional().nullable().or(z.literal("")),
  publicReply: z.string().max(300).optional().nullable().or(z.literal("")),
  listenOnStories: z.boolean().default(false),
  storyDmText: z.string().max(1000).optional().nullable().or(z.literal("")),
  replyToReelShares: z.boolean().default(false),
  reelShareDmText: z.string().max(1000).optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
});
export async function GET() {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connections = await prisma.instagramConnection.findMany({
    where: { userId: userSession.id },
    select: { id: true },
  });

  const connectionIds = connections.map((c) => c.id);

  const automations = await prisma.automation.findMany({
    where: {
      connectionId: { in: connectionIds },
    },
    include: {
      _count: {
        select: { events: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ automations });
}

export async function POST(req: NextRequest) {
  const userSession = await getAppUser();
  if (!userSession?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as unknown;
  const parseResult = createAutomationSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.format() },
      { status: 400 }
    );
  }

  const data = parseResult.data;

  // Authorize: ensure connection belongs to logged-in user
  const connection = await prisma.instagramConnection.findFirst({
    where: { id: data.connectionId, userId: userSession.id },
  });

  if (!connection) {
    return NextResponse.json(
      { error: "Forbidden: connection does not belong to user" },
      { status: 403 }
    );
  }

  const automation = await prisma.automation.create({
    data: {
      connectionId: connection.id,
      name: data.name || (data.mediaId ? `Post Automation` : `Global Automation`),
      mediaId: data.mediaId || null,
      mediaThumbnail: data.mediaThumbnail || null,
      mediaCaption: data.mediaCaption || null,
      keywords: data.keywords.map((k) => k.trim()).filter(Boolean),
      matchMode: data.matchMode,
      dmText: data.dmText,
      dmVariantB: data.dmVariantB || null,
      captureEmail: data.captureEmail,
      linkUrl: data.linkUrl || null,
      linkLabel: data.linkLabel || null,
      publicReply: data.publicReply || null,
      listenOnStories: data.listenOnStories,
      storyDmText: data.storyDmText || null,
      replyToReelShares: data.replyToReelShares,
      reelShareDmText: data.reelShareDmText || null,
      isActive: data.isActive,
    },
  });

  return NextResponse.json({ automation }, { status: 201 });
}
