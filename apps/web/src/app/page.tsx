import { AppLayout } from "../components/Layout/AppLayout";
import { ProductGrid } from "../components/Products/ProductGrid";
import { mockProducts } from "../data/mockProducts";

export default function Home() {
  return (
    <AppLayout>
      <ProductGrid products={mockProducts} />
    </AppLayout>
  );
}