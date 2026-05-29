import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/web";
import { client } from "@repo/db/client";
import { verifyPassword } from "@/utils/hash";

function createAuthToken(payload: { email: string; role: string }) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });
}

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await client.db.user.findUnique({ where: { email } });

    if (user && user.active) {
      const isValid = await verifyPassword(password, user.password);

      if (isValid) {
        const token = createAuthToken({ email: user.email, role: user.role });
        await setAuthCookie(token);
        return NextResponse.json({ success: true });
      }
    }

    // Backward-compatible fallback for env-based demo credentials.
    if (email === env.USER_EMAIL.toLowerCase() && password === env.USER_PASSWORD) {
      const token = createAuthToken({ email, role: "CUSTOMER" });
      await setAuthCookie(token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  } catch {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ email: null, role: null });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { email: string; role: string };
    return NextResponse.json({ email: decoded.email, role: decoded.role });
  } catch {
    cookieStore.delete("auth_token");
    return NextResponse.json({ email: null, role: null });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ success: true });
}
