// Create post requirement, new record in the SQL database
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

// Requirement: Logged in user can create a new post to the database (POST)
export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    // Generate a urlId from the title (Slugify)
    const urlId = body.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        urlId: urlId,
        description: body.description,
        content: body.content,
        imageUrl: body.imageUrl,
        category: body.category,
        tags: body.tags,
        active: true, // Default to active for new posts
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: "Could not create post" }, { status: 400 });
  }
}