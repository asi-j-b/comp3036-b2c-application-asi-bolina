import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { hashPassword } from '@/utils/hash';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;
  const hashedPassword = hashPassword(password);

  // Simulated Database Check using Environment Variables
  const isAdmin = password === process.env.ADMIN_PASSWORD;
  const isUser1 = email === process.env.USER1_EMAIL && password === process.env.USER1_PASSWORD;
  const isUser2 = email === process.env.USER2_EMAIL && password === process.env.USER2_PASSWORD;

  if (isAdmin || isUser1 || isUser2) {
    const role = isAdmin ? 'admin' : 'user';
    const userEmail = isAdmin ? 'admin@store.com' : email;

    // Issue JWT with role-based payload
    const token = jwt.sign(
      { email: userEmail, role }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '24h' }
    );

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true, // Prevents XSS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Prevents CSRF
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
}