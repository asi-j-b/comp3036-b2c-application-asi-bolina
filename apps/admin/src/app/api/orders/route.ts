import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { isLoggedIn } from "../../../utils/auth";

export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
