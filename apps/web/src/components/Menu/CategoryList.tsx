"use client";

import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";
import { useState, useEffect } from "react";

export function CategoryList({ posts }: { posts: Post[] }) {

  const [data, setData] = useState<{ name: string; count: number}[]>([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      const result = await categories(posts);
      setData(result);
    };
    loadCategories();
  }, [posts]);

  // TODO: Implement proper category list
  return (
    <>
      {categories(posts).map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={false}
          link={`/category/${toUrlPath(item.name)}`}
          title=""
        />
      ))}
    </>
  );
}