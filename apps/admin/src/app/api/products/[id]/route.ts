import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { active: body.active },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (
    !body ||
    typeof body.name !== "string" ||
    body.name.trim() === "" ||
    typeof body.slug !== "string" ||
    body.slug.trim() === "" ||
    !Number.isInteger(price) ||
    price <= 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: String(body.name ?? "").trim(),
        slug: String(body.slug ?? "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/-+/g, "-"),
        description: String(body.description ?? "").trim(),
        imageUrl: String(body.imageUrl ?? "").trim(),
        category: String(body.category ?? "").trim(),
        price,
        stock,
        featured: Boolean(body.featured),
        active: Boolean(body.active),
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}