import type { Product } from "@repo/db/data";
import { ProductGrid } from "./Products/ProductGrid";

export function Main({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <main className={`px-4 py-7 sm:px-8 ${className ?? ""}`}>
      <header className="mb-8">
        <h2 className="text-5xl font-semibold tracking-tight text-primary">From the products</h2>
        <p className="mt-2 text-lg text-secondary">
          Feel free to browse (or purchase) our selected products.
        </p>
      </header>
      <ProductGrid products={products} />
    </main>
  );
}
