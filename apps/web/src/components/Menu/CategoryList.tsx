"use client";

import { categories } from "@/functions/categories";
import type { Product } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";
import { useState, useEffect } from "react";
import { LinkList } from "./LinkList";

const BASE_CATEGORIES = ["React", "Node", "Mongo", "DevOps"];

export function CategoryList({ products }: { products: Product[] }) {

  const [data, setData] = useState<{ name: string; count: number}[]>([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      const result = await categories(products);
      const merged = BASE_CATEGORIES.map((name) => {
        const existing = result.find((item) => item.name === name);
        return { name, count: existing?.count ?? 0 };
      });
      setData(merged);
    };
    loadCategories();
  }, [products]);

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