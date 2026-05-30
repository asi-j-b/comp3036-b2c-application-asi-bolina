import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "@repo/db";
import { env } from "@repo/env/web";
import { verifyCustomerToken } from "@/utils/auth";
import { verifyPassword } from "@/utils/hash";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const normalizedEmail = String(email ?? "").trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (
      user &&
      user.active &&
      user.role === Role.CUSTOMER &&
      await verifyPassword(user.password, String(password ?? ""))
    ) {
      const token = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        env.JWT_SECRET, 
        { expiresIn: '24h' }
      );

      const cookieStore = await cookies();
      cookieStore.set('auth_token', token, {
        path: '/',
        httpOnly: true, // Prevents XSS
        sameSite: 'strict', // Prevents CSRF
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 15, // 15 minutes
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ email: null, role: null });
  }

  const session = verifyCustomerToken(token);

  if (!session) {
    cookieStore.delete("auth_token");
    return NextResponse.json({ email: null, role: null });
  }

  return NextResponse.json(session);
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ success: true });
}
