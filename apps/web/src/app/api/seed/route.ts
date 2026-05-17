import { NextResponse } from "next/server";
import { mockProducts } from "@repo/db/data";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Static mock product data is already available for Iteration 1.",
    productCount: mockProducts.length,
  });
}
