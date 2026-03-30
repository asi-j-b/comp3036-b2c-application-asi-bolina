import type { Post } from "@repo/db/data";
import { marked } from "marked";
import Link from "next/link";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);

  return (
    <article data-test-id={`blog-post-${post.id}`}>
      <h1>
        <Link href={`/post/${post.urlId}`}>
          {post.title}
        </Link>
      </h1>
      <p>{post.category.charAt(0).toUpperCase() + post.category.slice(1)}</p>

      <div>
        {post.tags.split(",").map((tag) => (
          <span key={tag.trim()}>#{tag.trim()}</span>
        ))}
      </div>

      <p>{post.views} views</p> 
      <p>{post.likes} likes</p>
      <p>18 Apr 2022</p>
      
      <div data-test-id="content-markdown" 
      dangerouslySetInnerHTML={{ __html: content }} />
      
      <button data-test-id="like-button">Like</button>
    </article>
  );
}
