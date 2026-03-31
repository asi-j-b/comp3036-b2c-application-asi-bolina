import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <main className={`px-4 py-7 sm:px-8 ${className ?? ""}`}>
      <header className="mb-8">
        <h2 className="text-5xl font-semibold tracking-tight text-primary">From the blog</h2>
        <p className="mt-2 text-lg text-secondary">
          Learn how to grow your business with our expert advice.
        </p>
      </header>
      <BlogList posts={posts} />
    </main>
  );
}
