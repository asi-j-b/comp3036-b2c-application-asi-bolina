import { NextResponse } from "next/server";
import { mockProducts } from "@repo/db/data";

const likedProducts = new Set<number>();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { productId?: number };
    const productId = Number(body.productId);

    if (!Number.isInteger(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const product = mockProducts.find((item) => item.id === productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (likedProducts.has(productId)) {
      likedProducts.delete(productId);
    } else {
      likedProducts.add(productId);
    }

    return NextResponse.json({
      liked: likedProducts.has(productId),
      likeCount: likedProducts.has(productId) ? 1 : 0,
    });
  } catch {
    return NextResponse.json({ error: "Unable to update like" }, { status: 400 });
  }
}
