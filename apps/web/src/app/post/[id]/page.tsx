import { prisma } from "@repo/db";
import { BlogDetail } from "@/components/Blog/Detail";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      urlId: id,
    },
    include: {
      Likes: true,
    },
  });

  if (!post) return notFound();

  const updatedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      Likes: true,
    },
  });

  const detailPost = {
    ...updatedPost,
    likes: updatedPost.Likes.length,
  };

  return (
    <main className="container mx-auto py-10">
      <BlogDetail post={detailPost} />
    </main>
  );
}