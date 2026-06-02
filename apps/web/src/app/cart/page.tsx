import { AppLayout } from "@/components/Layout/AppLayout";
import { CartView } from "@/components/Cart/CartView";
import { prisma } from "@repo/db";

export default async function CartPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <AppLayout>
      <CartView products={products} />
    </AppLayout>
  );
}
