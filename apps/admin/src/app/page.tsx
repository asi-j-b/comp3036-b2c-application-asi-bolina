import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import { isLoggedIn } from "../utils/auth";
import styles from "./page.module.css";
import { AdminFilters } from "../components/AdminFilters";

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string; tag?: string; sort?: string };
} ) {
  
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <main>Not logged in</main>;
  }
  
  return (
    <main className={styles.main}>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </main>
  );
}
