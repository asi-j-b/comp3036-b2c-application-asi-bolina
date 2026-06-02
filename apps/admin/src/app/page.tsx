import { isLoggedIn } from "../utils/auth";
import { AdminLoginForm } from "../components/auth/AdminLoginForm";
import { redirect } from "next/navigation";
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

  redirect("/admin-dashboard");
}