import { notFound } from "next/navigation";
import { AdminLoginForm } from "../../../components/auth/AdminLoginForm";
import { ProductEditorForm } from "../../../components/ProductEditorForm";
import { isLoggedIn } from "../../../utils/auth";
import { mockProducts } from "@repo/db/data";
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
        <AdminLoginForm />
      </main>
    );
  }

  const { urlId } = await params;
  const products = mockProducts.filter((p) => p.urlId === urlId);

  if (!products.length) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <h1 className="mb-4 text-2xl font-bold">Update Post</h1>
      <ProductEditorForm
        productId={products[0].id}
        initialValues={{
          title: products[0].title,
          category: products[0].category,
          description: products[0].description,
          content: products[0].content,
          imageUrl: products[0].imageUrl,
          tags: products[0].tags,
        }}
      />
    </main>
  );
}
