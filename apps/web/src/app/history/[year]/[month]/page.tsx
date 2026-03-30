import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const filteredPosts = posts.filter((post) => {
    const d = new Date(post.date);
    const postYear = d.getFullYear().toString();
    const postMonth = (d.getMonth() + 1).toString();

    return (
      post.active && 
      postYear === year && 
      postMonth === month
    );
  });

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}