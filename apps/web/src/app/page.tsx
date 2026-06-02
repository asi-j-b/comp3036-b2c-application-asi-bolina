import { AppLayout } from "../components/Layout/AppLayout";
import { ProductGrid } from "../components/Products/ProductGrid";
import { prisma } from "@repo/db";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return (
    <AppLayout>
      <ProductGrid products={products} />
    </AppLayout>
  );
}
