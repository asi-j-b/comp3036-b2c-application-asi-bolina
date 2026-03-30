import type { Post } from "@repo/db/data";

export async function categories(posts: Post[]) {
  return posts
    .filter((p) => p.active)
    .sort((a, b) => a.category.localeCompare(b.category))
    .reduce(
      (acc, post) => {
        const category = acc.find((c) => c.name === post.category);
        if (category) {
          category.count++;
        } else {
          acc.push({ name: post.category, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );
}
