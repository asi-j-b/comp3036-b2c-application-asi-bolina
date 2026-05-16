import { isLoggedIn } from "../utils/auth";
import { LoginForm } from "@repo/ui/auth/LoginForm";
import { LogoutButton } from "@repo/ui/auth/LogoutButton";
import styles from "./page.module.css";

export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className={styles.main}>
        <LoginForm actionUrl="/api/auth" isAdmin={true} />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className="mb-6 flex w-full max-w-5xl items-center justify-between gap-4">
        <h1>Admin Dashboard</h1>
        <LogoutButton />
      </header>
    </main>
  );
}