import { prisma } from "@repo/db/client";
import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "../components/LoginForm";
// import { AdminList } from "../components/AdminList";
import styles from "./page.module.css";

export default async function Home(props: {
  searchParams: Promise<{ query?: string; tag?: string; sort?: string }>;
}) {
  const filters = await props.searchParams;

  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className={styles.main}>
        <LoginForm />
      </main>
    );
  }

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        filters.query ? {
          OR: [
            { title: { contains: filters.query } },
            { content: { contains: filters.query } }
          ]
        } : {},
        filters.tag ? { tags: { contains: filters.tag } } : {}
      ]
    }
  });

  return (
    <main className={styles.main}>
      <h1>Admin of Full Stack Blog</h1>
    </main>
  );
}