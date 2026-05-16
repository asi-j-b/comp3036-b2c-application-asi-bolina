import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();

  return forwardedFor || realIp || "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { productId?: number };
    const productId = Number(body.productId);

    if (!Number.isInteger(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const userIP = getRequestIp(request);
    const existingLike = await prisma.like.findFirst({
      where: {
        productId,
        userIP,
      },
    });

    if (existingLike) {
      await prisma.like.deleteMany({
        where: {
          productId,
          userIP,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          productId,
          userIP,
        },
      });
    }

    const likes = await prisma.like.count({
      where: { productId },
    });

    return NextResponse.json({
      likes,
      liked: !existingLike,
    });
  } catch {
    return NextResponse.json({ error: "Unable to update like" }, { status: 400 });
  }
}
