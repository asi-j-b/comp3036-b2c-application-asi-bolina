import { posts } from "@repo/db/data";
import { BlogDetail } from "@/components//Blog/Detail"; 
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Find the post where the urlId matches the slug in the URL
  const post = posts.find((p) => p.urlId === id);

  if (!post) return notFound();

  return (
    <main className="container mx-auto py-10">
      <BlogDetail post={post} />
    </main>
  );
}