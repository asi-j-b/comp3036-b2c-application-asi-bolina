import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "@repo/db";
import { env } from "@repo/env/admin";
import { verifyPassword } from "../../../utils/hash";

const ADMIN_AUTH_COOKIE = "admin_auth_token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (
      user &&
      user.active &&
      user.role === Role.ADMIN &&
      await verifyPassword(user.password, password)
    ) {
      const jwtToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const cookieStore = await cookies();

      cookieStore.set(ADMIN_AUTH_COOKIE, jwtToken, {
        path: "/",
        httpOnly: true,      // Security: Prevents XSS
        sameSite: "strict",  // Security: Prevents CSRF
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15, // 15 minutes
      });
      return NextResponse.json({ message: "Logged in" });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ email: null, role: null });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { email: string; role: string };
    return NextResponse.json({ email: decoded.email, role: decoded.role });
  } catch (error) {
    cookieStore.delete(ADMIN_AUTH_COOKIE);
    return NextResponse.json({ email: null, role: null });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_AUTH_COOKIE);
  return NextResponse.json({ message: "Logged out" });
}
