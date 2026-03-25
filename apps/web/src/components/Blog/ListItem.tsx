import type { Post } from "@repo/db/data";
import Image from 'next/image';
import Link from 'next/link';

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article
      key={post.id}
      className="flex flex-row gap-8"
      data-test-id={`blog-post-${post.id}`}
    >
      <div>
        <Link href={`/posts/${post.urlId}`}>
          <h1>{post.title}</h1>
        </Link>
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={300}
          height={200}
        />
      </div>
    </article>
  );
}
