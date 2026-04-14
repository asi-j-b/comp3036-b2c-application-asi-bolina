import { cookies } from "next/headers"; // Fixes 'cookies'
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // Fixes 'jwt'
import { env } from "@repo/env/admin"; // Fixes 'env'

export async function POST(request: Request) {
    const body = await request.json();

    if (body.password ==="123") {
        const jwtToken = jwt.sign(
            {role: "admin"},
            env.JWT_SECRET || "fallback_secret",
        { expiresIn: "24h" }
        );

        const cookieStore = await cookies();
        
        cookieStore.set('auth_token', jwtToken, {
            path: '/',
            httpOnly: true,       // Safe from XSS (Quiz Q2)
            sameSite: 'strict',   // Safe from CSRF (Quiz Q2)
            secure: process.env.NODE_ENV === 'production', // Safe from Snooping (Lecture)
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({ message: "Logged in" });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}