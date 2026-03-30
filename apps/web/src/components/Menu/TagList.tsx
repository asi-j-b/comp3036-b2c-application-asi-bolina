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
      {/* Change 'flex-wrap' to 'flex-col' */}
      <div className="flex flex-col gap-2 mt-2">
        {tagItems.map((tag) => (
          <Link 
            key={tag.name} 
            href={`/tag/${tag.name.toLowerCase()}`}
            className="block py-1 hover:text-blue-600 border-b border-gray-50 text-sm"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}