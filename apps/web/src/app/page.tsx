import { AppLayout } from "../components/Layout/AppLayout";
import { ProductGrid } from "../components/Products/ProductGrid";
import { mockProducts } from "@repo/db/data";

export default function Home() {
  return (
    <AppLayout>
      <ProductGrid products={mockProducts} />
    </AppLayout>
  );
}