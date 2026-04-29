import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

// Requirement: Logged in user can activate / deactivate a post (PATCH)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Security Check
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  try {
    const { id } = await params;
    const body = await request.json(); // Expecting { active: boolean }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { active: body.active },
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
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

  try {
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        imageUrl: body.imageUrl,
        category: body.category,
        tags: body.tags,
      },
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}