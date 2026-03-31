import type { Post } from "@repo/db/data";
import { marked } from "marked";
import Link from "next/link";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);
  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      data-test-id={`blog-post-${post.id}`}
      className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8"
    >
      <h1 className="text-3xl font-bold leading-tight text-primary">
        <Link href={`/post/${post.urlId}`}>
          {post.title}
        </Link>
      </h1>
      <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-secondary">
        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.split(",").map((tag) => (
          <span
            key={tag.trim()}
            className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-secondary dark:border-gray-700"
          >
            #{tag.trim()}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-secondary">
        <p>{post.views + 1} views</p>
        <p>{post.likes} likes</p>
        <p>{formattedDate}</p>
      </div>
      
      <div
        data-test-id="content-markdown"
        className="content-markdown mt-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <button
        data-test-id="like-button"
        className="mt-8 rounded-xl bg-wsu px-4 py-2 text-sm font-semibold text-white transition hover:bg-wsu-light"
      >
        Like
      </button>
    </article>
  );
}
