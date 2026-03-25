import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem"; // Importing the item component

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className="py-6">
      {posts.map((post) => (
        <BlogListItem key = {post.id} post={post} />
      ))}
      </div>
  );
}

export default BlogList;
