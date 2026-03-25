export function history(posts: { date: Date; active: boolean }[]): string[] {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts

  /* Function logic
  1. Filter active posts
  2. Map the dates into a string format like "January 2026"
  3. Uniqueify: Use a set or reduce to ensure January 2026 only appears once even if there 10 posts in that month
  4. Sort: Ensure the most recent dates are at the top
  */
  .filter((p) => p.active)
  date.localeString
  return [];
}
