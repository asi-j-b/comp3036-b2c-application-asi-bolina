"use client";

import { type Product } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";
import { useState, useEffect } from "react";
  
export function TagList({
  selectedTag,
  products,
}: {
  selectedTag?: string;
  products: Product[];
}) {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      const result = await tags(products);
      setData(result);
    };
    
    loadTags();
  }, [products]);

  return (
    <LinkList title="Tags">
      {data.map((tag) => (
        <SummaryItem
          key={tag.name}
          name={tag.name}
          count={tag.count}
          isSelected={toUrlPath(tag.name) === selectedTag?.toLowerCase()}
          link={`/tags/${toUrlPath(tag.name)}`}
          title={`Tag / ${tag.name}`}
        />
      ))}
    </LinkList>
  );
}