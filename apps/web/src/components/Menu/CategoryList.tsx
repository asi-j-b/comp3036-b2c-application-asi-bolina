"use client";

import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";
import { useState, useEffect } from "react";
import { LinkList } from "./LinkList";

export function CategoryList({ posts }: { posts: Post[] }) {

  const [data, setData] = useState<{ name: string; count: number}[]>([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      const result = await categories(posts);
      setData(result);
    };
    loadCategories();
  }, [posts]);

  return (
    <LinkList title="Categories">
      {data.map((item) => (
        <SummaryItem
          key={item.name}
          name={item.name}
          count={item.count}
          isSelected={false}
          link={`/category/${item.name.toLowerCase().trim()}`}
          title={`Category / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}