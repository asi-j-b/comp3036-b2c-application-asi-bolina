import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { tags as getTags } from "../../functions/tags";
import Link from "next/link";

export async function TagList({ posts, selectedTag }: { posts: any[]; selectedTag: string }) {
  // 1. Get the counted, unique tags
  const tagItems = await getTags(posts);

  return (
    <div className="mt-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Popular Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tagItems.map((tag) => (
          <Link
            key={tag.name}
            href={`/tag/${tag.name.toLowerCase()}`}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              tag.name.toLowerCase() === selectedTag?.toLowerCase()
                ? "bg-blue-600 text-white" // Highlight if selected
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            #{tag.name} <span className="opacity-50 ml-1">{tag.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}