import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { mockProducts } from "@repo/db/data";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const searchTerm = q?.toLowerCase() || "";

  const filteredProducts = mockProducts.filter((product) =>
    product.active && (
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) // Test specifically checks description!
    )
  );

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
