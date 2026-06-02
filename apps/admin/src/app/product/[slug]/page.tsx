import { notFound } from "next/navigation";
import { AdminLoginForm } from "../../../components/auth/AdminLoginForm";
import { ProductEditorForm } from "../../../components/ProductEditorForm";
import { isLoggedIn } from "../../../utils/auth";
import { prisma } from "@repo/db";
import styles from "../../page.module.css";

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className={styles.main}>
        <AdminLoginForm />
      </main>
    );
  }

  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <h1 className="mb-4 text-2xl font-bold">Update Product</h1>
      <ProductEditorForm
        productId={product.id}
        initialValues={{
          name: product.name,
          slug: product.slug,
          category: product.category,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          stock: product.stock,
          featured: product.featured,
          active: product.active,
        }}
      />
    </main>
  );
}
