import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "../components/LoginForm";
import { AdminList } from "../components/AdminList";
import { LogoutButton } from "../components/LogoutButton";
import { getAllPosts } from "../utils/posts";
import styles from "./page.module.css";

export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className={styles.main}>
        <LoginForm />
      </main>
    );
  }

  const posts = getAllPosts().map((post) => ({
    ...post,
    date: post.date.toISOString(),
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