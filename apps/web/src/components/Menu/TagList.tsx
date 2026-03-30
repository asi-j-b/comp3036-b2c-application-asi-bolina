import { type Post } from "@repo/db/data";
import { tags as tag } from "@/functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";
import { useEffect, useState } from "react";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {

  const [data, setData] = useState<{ name: string; count: number}[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      const postTags = await tag(posts);
      setData(postTags);
    };
    loadTags();
  }, [posts]);

  return (
    <LinkList title="Tags">
      Tags {/* Todo implement, use the summary item */}
      {data.map((tag) => (
        <SummaryItem
          key={tag.name}
          name={tag.name}
          count={tag.count}
          isSelected={toUrlPath(tag.name) === selectedTag?.toLowerCase()}
          link={`/tag/${toUrlPath(tag.name)}`}
          title={tag.name}
        />  
      ))}
    </LinkList>
  );
}