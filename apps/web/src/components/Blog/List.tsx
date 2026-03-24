import type { Post } from "@repo/db/data";

export function BlogList({ posts }: { posts: Post[] }) {
  return <div className="py-6">List (source file: List.tsx)</div>;
}

export default BlogList;
