import { LoginForm } from "@repo/ui/auth/LoginForm";
import { ProductEditorForm } from "../../../components/ProductEditorForm";
import { isLoggedIn } from "../../../utils/auth";
import styles from "../../page.module.css";

export default async function CreatePage() {
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
      <h1 className="mb-4 text-2xl font-bold">Create Product</h1>
      <ProductEditorForm />
    </main>
  );
}
