import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem"; // Importing the item component

export function BlogList({ posts }: { posts: Post[] }) {
  
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-800/40">
        <p className="text-sm text-secondary">0 Posts</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2 sm:py-4">
      {posts.map((post) => (
        <BlogListItem key={post.id} post={post} />
      ))}
    </div>
  );
}

export default BlogList;
