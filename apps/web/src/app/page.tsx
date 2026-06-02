import { AppLayout } from "../components/Layout/AppLayout";
import { ProductGrid } from "../components/Products/ProductGrid";
import { prisma } from "@repo/db";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      category: true,
      stock: true,
      imageUrl: true,
      rating: true,
      reviews: true,
      featured: true,
      active: true,
    },
  });

  return (
    <AppLayout>
      <ProductGrid products={products} />
    </AppLayout>
  );
}
