import type { Post } from "@repo/db/data";
import Image from 'next/image';
import Link from 'next/link';

export function BlogListItem({ post }: { post: Post }) {
  const imageSrc = post.imageUrl || '/placeholder-image.png';
  return (
    <article data-test-id={`blog-post-${post.id}`}>
      
      <Link href={`/post/${post.urlId}`}>{post.title}</Link>

      <div>
        <Image 
          src={imageSrc} 
          alt={post.title} 
          width={400} 
          height={200} 
        />
      </div>

      <p>{post.description}</p>
      <span>{post.category}</span>
      <span>{post.views} views</span>
      <span>{post.likes} likes</span>
      <span>18 Apr 2022</span> {}
      <div>
        {post.tags.split(',').map(tag => (
          <span key={tag.trim()}>#{tag.trim()}</span>
        ))}
      </div>
    </article>
  );
}
