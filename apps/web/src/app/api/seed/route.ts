import { NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET() {
  const productCount = await prisma.product.count();

  return NextResponse.json({
    ok: true,
    message: "Database product data is available.",
    productCount,
  });
}
