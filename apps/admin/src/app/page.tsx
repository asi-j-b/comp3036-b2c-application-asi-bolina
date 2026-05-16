import { isLoggedIn } from "../utils/auth";
import { AdminLoginForm } from "../components/auth/AdminLoginForm";
import { LogoutButton } from "../components/auth/LogoutButton";
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

  return (
    <main className={styles.main}>
      <header className="mb-6 flex w-full max-w-5xl items-center justify-between gap-4">
        <h1>Admin Dashboard</h1>
        <LogoutButton />
      </header>
    </main>
  );
}