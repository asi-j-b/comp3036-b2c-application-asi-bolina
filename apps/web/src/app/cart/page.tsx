import { AppLayout } from "@/components/Layout/AppLayout";
import { CartView } from "@/components/Cart/CartView";
import { prisma } from "@repo/db";

export const metadata = {
  title: "Cart | FSD",
};

export default async function CartPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
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
      <CartView products={products} />
    </AppLayout>
  );
}
