"use client";

import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";
import { useState, useEffect } from "react";

export function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      const result = await tags(posts);
      setData(result);
    };
    
    loadTags();
  }, [posts]);

  return (
    <LinkList title="Tags">
      {data.map((tag) => (
        <SummaryItem
          key={tag.name}
          name={tag.name}
          count={tag.count}
          isSelected={toUrlPath(tag.name) === selectedTag?.toLowerCase()}
          link={`/tag/${toUrlPath(tag.name)}`}
          title={`Tag / ${tag.name}`}
        />
      ))}
    </LinkList>
  );
}