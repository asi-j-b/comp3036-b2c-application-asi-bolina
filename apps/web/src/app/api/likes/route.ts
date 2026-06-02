import { NextResponse } from "next/server";

const deprecated = {
  error: "Deprecated endpoint",
  message: "Likes endpoint is no longer used. Use cart and orders endpoints instead.",
};

export async function GET() {
  return NextResponse.json(deprecated, { status: 410 });
}

export async function POST() {
  return NextResponse.json(deprecated, { status: 410 });
}
