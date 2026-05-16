import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { products } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const filteredProducts = products.filter((product) => {
    const d = new Date(product.date);
    const productYear = d.getFullYear().toString();
    const productMonth = (d.getMonth() + 1).toString();

    return (
      product.active && 
      productYear === year && 
      productMonth === month
    );
  });

  return (
    <AppLayout>
      <Main products={filteredProducts} />
    </AppLayout>
  );
}