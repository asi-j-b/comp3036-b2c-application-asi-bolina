// import { hashPassword } from '@/utils/hash';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "@repo/env/web";
import { verifyCustomerToken } from "@/utils/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (body.email === env.USER_EMAIL && body.password === env.USER_PASSWORD) {
      const token = jwt.sign(
        { email, role: Role.CUSTOMER },
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
