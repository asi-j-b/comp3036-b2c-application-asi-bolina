// import { posts, type Post } from "../components/data";

export async function tags(posts: { tags: string; active: boolean }[]) {
  // TODO: Implement per specification

  /* Function logic
    1. Filter active posts
    2. Split and Flatten: if a post has "react, CSS" you need to split it by the comma and flatten it so you just have a big list of individual words
    3. Count: just like categories, you'll likely want to count how many times each tag appears
  */
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
  return [];
}
