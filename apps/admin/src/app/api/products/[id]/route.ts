import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

// 🟢 LECTURE SECURE DEFENSIIVE SYNTAX: Clean malicious inline script elements out of strings
function cleanInput(source: string): string {
  if (!source) return "";
  return source
    .replace(/[<>]/g, "") // Prevents raw HTML embedding
    .replace(/\s+on\w+=\s*(['"][^'"]*['"]|[^\s>]+)/gi, ""); // Strips execution triggers (onerror, onload)
}

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

  // 🟢 FIXED VALIDATION: Changed Number.isInteger(price) to standard number constraints to support cents/decimals
  if (
    !body ||
    typeof body.name !== "string" ||
    body.name.trim() === "" ||
    typeof body.slug !== "string" ||
    body.slug.trim() === "" ||
    isNaN(price) ||
    price <= 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    // 🟢 LECTURE SECURITY FIX: Apply defensive sanitization wrappers against Stored XSS vectors
    const safeName = cleanInput(body.name);
    const safeDescription = cleanInput(body.description ?? "");
    const safeCategory = cleanInput(body.category ?? "");
    const safeImageUrl = String(body.imageUrl ?? "").replace(/[<>"]/g, ""); // Strip brackets to neutralize URL injections

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: safeName.trim(),
        slug: String(body.slug ?? "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/-+/g, "-"),
        description: safeDescription.trim(),
        imageUrl: safeImageUrl.trim(),
        category: safeCategory.trim(),
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