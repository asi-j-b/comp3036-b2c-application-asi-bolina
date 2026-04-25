import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();

  return forwardedFor || realIp || "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { postId?: number };
    const postId = Number(body.postId);

    if (!Number.isInteger(postId)) {
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userIP = getRequestIp(request);
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userIP,
      },
    });

    if (existingLike) {
      await prisma.like.deleteMany({
        where: {
          postId,
          userIP,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userIP,
        },
      });
    }

    const likes = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({
      likes,
      liked: !existingLike,
    });
  } catch {
    return NextResponse.json({ error: "Unable to update like" }, { status: 400 });
  }
}
