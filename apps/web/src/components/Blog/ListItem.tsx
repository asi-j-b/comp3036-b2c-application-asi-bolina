import type { Post } from "@repo/db/data";
import Image from 'next/image';
import Link from 'next/link';

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article data-test-id={`blog-post-${post.id}`}>
      <Link href={`/post/${post.urlId}`}>{post.title}</Link>
      <p>{post.description}</p>
      <span>{post.views} views</span>
      <span>{post.likes} likes</span>
      <span>18 Apr 2022</span> {}
      <div>
        {post.tags.split(',').map(tag => (
          <span key={tag}>#{tag.trim()}</span>
        ))}
      </div>
    </article>
  );
}
