import { prisma } from "@repo/db";
import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "../app/components/LoginForm";
import styles from "./page.module.css";

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string; tag?: string; sort?: string };
}) {
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
        searchParams.query ? {
          OR: [
            { title: { contains: searchParams.query } },
            { content: { contains: searchParams.query } }
          ]
        } : {},
        searchParams.tag ? { tags: { contains: searchParams.tag } } : {}
      ]
    }
  });

  return (
    <main className={styles.main}>
      <h1>Admin of Full Stack Blog</h1>
    </main>
  );
}