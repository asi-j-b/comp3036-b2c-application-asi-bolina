import { notFound } from "next/navigation";
import { LoginForm } from "../../../components/LoginForm";
import { PostEditorForm } from "../../../components/PostEditorForm";
import { isLoggedIn } from "../../../utils/auth";
import { prisma } from "@repo/db";
import styles from "../../page.module.css";

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className={styles.main}>
        <LoginForm />
      </main>
    );
  }

  const { urlId } = await params;

  const post = await prisma.post.findUnique({
    where: {
      urlId,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <h1 className="mb-4 text-2xl font-bold">Update Post</h1>
      <PostEditorForm
        postId={post.id}
        initialValues={{
          title: post.title,
          category: post.category,
          description: post.description,
          content: post.content,
          imageUrl: post.imageUrl,
          tags: post.tags,
        }}
      />
    </main>
  );
}
