import { LoginForm } from "../../../components/LoginForm";
import { PostEditorForm } from "../../../components/PostEditorForm";
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
      <h1 className="mb-4 text-2xl font-bold">Create Post</h1>
      <PostEditorForm />
    </main>
  );
}
