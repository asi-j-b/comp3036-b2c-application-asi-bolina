import { type Post } from "@repo/db/data";

export async function history(posts: Post[]) {
  return posts
    .filter((p) => p.active)
    .reduce((acc, post) => {
      const d = new Date(post.date);
      const m = d.getMonth() + 1; // getMonth() is 0-indexed (Jan=0), so we add 1
      const y = d.getFullYear();

      // Find if this month/year combo already exists in our list
      const existing = acc.find((h) => h.month === m && h.year === y);

      if (existing) {
        existing.count++;
      } else {
        acc.push({ month: m, year: y, count: 1 });
      }

      return acc;
    }, [] as { month: number; year: number; count: number }[])
    // Sort by Year first (descending), then Month (descending)
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });
}