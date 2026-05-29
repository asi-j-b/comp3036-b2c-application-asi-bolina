import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { client } from "@repo/db/client";
import { env } from "@repo/env/web";
import { hashPassword, isPasswordValid } from "@/utils/hash";

type RegisterBody = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
};

function normalizeName(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizePassword(value: unknown) {
  return typeof value === "string" ? value : "";
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
    const body = (await request.json()) as RegisterBody;

    const firstName = normalizeName(body.firstName);
    const lastName = normalizeName(body.lastName);
    const email = normalizeEmail(body.email);
    const password = normalizePassword(body.password);
    const confirmPassword = normalizePassword(body.confirmPassword);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!isEmailValid(email)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
    }

    if (!isPasswordValid(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, and a special character",
        },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const existingUser = await client.db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "An account with that email already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await client.db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const token = jwt.sign(
      { email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    await setAuthCookie(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Unable to register user" }, { status: 500 });
  }
}