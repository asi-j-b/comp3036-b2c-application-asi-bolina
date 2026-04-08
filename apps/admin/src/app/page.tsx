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
}
