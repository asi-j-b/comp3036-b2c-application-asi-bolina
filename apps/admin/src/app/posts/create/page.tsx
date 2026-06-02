import { AdminLoginForm } from "../../../components/auth/AdminLoginForm";
import { ProductEditorForm } from "../../../components/ProductEditorForm";
import { isLoggedIn } from "../../../utils/auth";
import styles from "../../page.module.css";

export default async function CreatePage() {
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
      <h1 className="mb-4 text-2xl font-bold">Create Product</h1>
      <ProductEditorForm />
    </main>
  );
}
