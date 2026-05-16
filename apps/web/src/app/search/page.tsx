import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { products } from "@repo/db/data";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const searchTerm = q?.toLowerCase() || "";

  const filteredProducts = products.filter((product) =>
    product.active && (
      product.title.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) // Test specifically checks description!
    )
  );

  return (
    <AppLayout query={q}>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}
