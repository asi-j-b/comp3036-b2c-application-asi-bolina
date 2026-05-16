import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

// POST handles the Login (Requirement: Check password on server)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.password === env.ADMIN_PASSWORD) {
      // Create the JWT (Requirement: JWT Issue & Validation)
      const jwtToken = jwt.sign(
        { role: "admin" },
        env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const cookieStore = await cookies();

      cookieStore.set("auth_token", jwtToken, {
        path: "/",
        httpOnly: true,      // Security: Prevents XSS
        sameSite: "strict",  // Security: Prevents CSRF
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ message: "Logged in" });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }
}

// DELETE handles the Logout (Requirement: DELETE method is used for logout)
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ message: "Logged out" });
}