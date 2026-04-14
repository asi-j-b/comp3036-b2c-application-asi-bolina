import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.password === "123") {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "123", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ message: "Logged in" });
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ message: "Logged out" });
}
