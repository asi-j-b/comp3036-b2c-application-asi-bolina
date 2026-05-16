import { mockProducts } from "@repo/db/data";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const filteredProducts = mockProducts.filter((product) => {
    return (
      product.active && product.category.toLowerCase() === name.toLowerCase()
    );
    
  });

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
