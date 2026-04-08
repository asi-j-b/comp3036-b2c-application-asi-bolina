import { prisma } from "@repo/db";
import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "../components/LoginForm";
import { AdminList } from "../components/AdminList";
import styles from "./page.module.css";

// Next.js passes searchParams automatically to Server Components
export default async function AdminPage({
  searchParams,
}: {
  searchParams: { query?: string; tag?: string; sort?: string };
}) {
  // 1. Requirement: Authorization Check
  const loggedIn = await isLoggedIn();

  // If not logged in, show the login form immediately
  if (!loggedIn) {
    return (
      <main className={styles.main}>
        <LoginForm />
      </main>
    );
  }

  // 2. Logic for Sorting (Playwright tests look for date and title sorting)
  const sortParam = searchParams.sort || "date-desc";
  const [field, order] = sortParam.includes("-") 
    ? sortParam.split("-") 
    : ["date", "desc"];

  // 3. Requirement: Relational/Filtered Data Fetching
  const posts = await prisma.post.findMany({
    where: {
      AND: [
        // Filter by Content (Title or Content)
        searchParams.query
          ? {
              OR: [
                { title: { contains: searchParams.query } },
                { content: { contains: searchParams.query } },
              ],
            }
          : {},
        // Filter by Tag (Since tags is a String in your schema)
        searchParams.tag
          ? {
              tags: { contains: searchParams.tag },
            }
          : {},
      ],
    },
    orderBy: {
      // This dynamically sets the sort field (e.g., date: 'desc')
      [field]: order as "asc" | "desc",
    },
  });

  // 4. Requirement: Shows List screen if logged in
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Admin of Full Stack Blog</h1>
      </header>
      
      {/* Pass the fetched posts to the list component */}
      <AdminList posts={posts} />
    </main>
  );
}