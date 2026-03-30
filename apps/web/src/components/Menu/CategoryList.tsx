import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({
  posts,
  selectedCategory,
}: {
  posts: Post[];
  selectedCategory?: string;
}) {
  // TODO: Implement proper category list
  return (
    <>
      {categories(posts).map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={toUrlPath(item.name) === selectedCategory?.toLowerCase()}
          link={`/category/${toUrlPath(item.name)}`}
          title=""
        />
      ))}
    </>
  );
}
