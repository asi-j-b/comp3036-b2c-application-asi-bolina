import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const slug = String(body.slug ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/-+/g, "-");
    const price = Number(body.price);
    const stock = Number(body.stock);

    if (!name || !slug || !Number.isInteger(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description: String(body.description ?? "").trim(),
        imageUrl: String(body.imageUrl ?? "").trim(),
        category: String(body.category ?? "").trim(),
        price,
        stock,
        featured: Boolean(body.featured),
        active: body.active === undefined ? true : Boolean(body.active),
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: "Could not create product" }, { status: 400 });
  }
}
