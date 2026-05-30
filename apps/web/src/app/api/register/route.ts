import { NextResponse } from "next/server";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@repo/db";
import { hashPassword } from "@/utils/hash";
import { registerSchema, sanitizeName } from "@/utils/registration";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Request origin is not allowed" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0]?.message ?? "Invalid registration details" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: result.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    await prisma.user.create({
      data: {
        email: result.data.email,
        name: sanitizeName(result.data.name),
        password: await hashPassword(result.data.password),
        role: Role.CUSTOMER,
        active: true,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
