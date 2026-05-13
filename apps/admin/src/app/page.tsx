import { isLoggedIn } from "../utils/auth";
import { AdminLoginForm } from "../../../../packages/ui/src/auth/AdminLoginForm";
import { AdminList } from "../components/AdminList";
import { LogoutButton } from "../components/LogoutButton";
import { prisma } from "@repo/db";
import styles from "./page.module.css";

export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className={styles.main}>
        <AdminLoginForm />
      </main>
    );
  }

  const postsFromDB = await prisma.post.findMany({
    orderBy: { date: 'desc' }
  });

  const posts = postsFromDB.map((post) => ({
  ...post,
  date: post.date.toISOString(), // Converts Date object to "2026-04-25..." string
  }));

  return (
    <main className={styles.main}>
      <header className="mb-6 flex w-full max-w-5xl items-center justify-between gap-4">
        <h1>Admin of Full Stack Blog</h1>
        <LogoutButton />
      </header>
      <AdminList posts={posts} />
    </main>
  );
}