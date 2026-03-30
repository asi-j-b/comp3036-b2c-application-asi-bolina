import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const searchTerm = q?.toLowerCase() || "";

  const filteredPosts = posts.filter((post) =>
    post.active && (
      post.title.toLowerCase().includes(searchTerm) || 
      post.description.toLowerCase().includes(searchTerm) // Test specifically checks description!
    )
  );

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
