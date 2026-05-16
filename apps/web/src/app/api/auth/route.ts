import { hashPassword } from '@/utils/hash';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/web";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (body.email === env.USER_EMAIL && body.password === env.USER_PASSWORD) {

      const token = jwt.sign(
        { email, role: "user" }, 
        process.env.JWT_SECRET!, 
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

  } catch (error) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }

  
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ success: true });
}