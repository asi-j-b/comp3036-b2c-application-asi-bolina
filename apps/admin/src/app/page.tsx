import { prisma } from "@repo/db";
import { posts } from "@repo/db/data";
import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "../components/LoginForm";
import styles from "./page.module.css";

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className={styles.main}>
        <LoginForm />
      </main>
    );
  }

  // 2. Fetch real data from the database
  const posts = await prisma.post.findMany();
  
  return (
    <main className={styles.main}>
      <h1>Admin of Full Stack Blog</h1>
      <ul>
        {posts.map((p) => (
          // Use <article> tags because the test uses page.locator("article")
          <article key={p.id}>
            <li>{p.title}</li>
          </article>
        ))}
      </ul>
      <button>Logout</button>
    </main>
  );
}
