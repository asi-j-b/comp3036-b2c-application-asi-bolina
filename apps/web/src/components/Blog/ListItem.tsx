import type { Post } from "@repo/db/data";
import Image from 'next/image';
import Link from 'next/link';

export function BlogListItem({ post }: { post: Post }) {
  const imageSrc = post.imageUrl || '/placeholder-image.png';
  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="border-b border-gray-200 pb-8 last:border-b-0"
    >
      <div className="grid gap-6 sm:grid-cols-[320px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
        <Image 
          src={imageSrc} 
          alt={post.title} 
          width={400} 
          height={200} 
          className="h-full w-full object-cover"
        />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-5 text-sm text-secondary">
            <span>{formattedDate}</span>
            <span>{post.category}</span>
          </div>

          <Link
            href={`/post/${post.urlId}`}
            className="line-clamp-2 text-4xl font-semibold leading-tight text-primary transition hover:text-primaryHover"
          >
            {post.title}
          </Link>

          <p className="line-clamp-3 text-2xl text-secondary">{post.description}</p>

          <div className="flex flex-wrap gap-2">
            {post.tags.split(',').map(tag => (
              <span
                key={tag.trim()}
                className="text-sm text-secondary"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-8 border-t border-gray-200 pt-4 text-lg text-secondary">
            <span>{post.views} views</span>
            <span>{post.likes} likes</span>
          </div>
        </div>
      </div>
    </article>
  );
}
