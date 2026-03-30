import { posts } from "@repo/db/data";
import { BlogDetail } from "@/components//Blog/Detail"; 
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  // Find the post where the urlId matches the slug in the URL
  const post = posts.find((p) => p.urlId === params.id);

  if (!post) return notFound();

  return (
    <main className="container mx-auto py-10">
      <BlogDetail post={post} />
    </main>
  );
}