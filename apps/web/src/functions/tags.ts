import type { Post } from "@repo/db/data";

export async function tags(posts: Post[]) {
  return posts
    .filter((p) => p.active)
    .flatMap((p) => p.tags.split(","))
    .map((tag) => tag.trim())
    .reduce((acc, tag) => {
      const existing = acc.find((t) => t.name === tag);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: tag, count: 1 });
      }
      return acc;
    }, [] as { name: string; count: number }[]);
}
