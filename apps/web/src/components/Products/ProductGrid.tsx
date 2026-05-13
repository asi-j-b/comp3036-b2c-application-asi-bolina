"use client";

import { useMemo, useState } from "react";
import { filterByCategory, getCategories, searchProducts, type Product } from "../../data/mockProducts";
import { ProductCard } from "./ProductCard";
import { useCart } from "../../hooks/useCart";
import { TopMenu } from "../Layout/TopMenu";

export function ProductGrid({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart, cartCount, cartItems, cartTotal, removeFromCart, clearCart } = useCart(products);

  const categories = useMemo(() => getCategories(products), [products]);

  const filteredProducts = useMemo(() => {
    const searchedProducts = searchProducts(products, searchTerm);
    return filterByCategory(searchedProducts, selectedCategory);
  }, [products, searchTerm, selectedCategory]);

  return (
    <section className="w-full">
      <TopMenu
        products={products}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        cartCount={cartCount}
      />

      <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <div className="inline-flex w-fit rounded-full border border-[var(--ring)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Iteration 1 storefront
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-primary sm:text-6xl">
            Browse products, filter by category, and search by name.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-secondary">
            Static mock data is powering the first storefront pass so the UI can move ahead before the backend is swapped in.
          </p>
        </header>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--ring)] bg-[var(--surface)] py-12 text-center">
            <p className="text-lg text-secondary">No products found</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-sm text-wsu hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}