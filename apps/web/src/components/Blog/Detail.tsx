import type { Post } from "@repo/db/data";
import { marked } from "marked";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);

  return (
    <article data-test-id={`blog-post-${post.id}`}>
      <h1>{post.title}</h1>
      <p>{post.category}</p>
      <p>{post.views} views</p> 
      <p>{post.likes} likes</p>
      <p>{format(new Date(post.date), 'dd MMM yyyy')}</p> {/* Use a formatter for 18 Apr 2022 */}
      
      <div data-testid="content-markdown" dangerouslySetInnerHTML={{ __html: content }} />
      
      <button data-testid="like-button">Like</button>
    </article>
  );
}
