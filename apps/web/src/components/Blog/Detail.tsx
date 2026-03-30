import type { Post } from "@repo/db/data";
import { marked } from "marked";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);

  return (
    <article data-test-id={`blog-post-${post.id}`} className="prose dark:prose-invert">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
