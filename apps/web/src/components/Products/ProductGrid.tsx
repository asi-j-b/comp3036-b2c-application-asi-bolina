"use client";

import { useMemo, useState } from "react";
import { filterByCategory, searchProducts } from "../../functions/products";
import type { Product } from "@repo/db/data";
import { ProductCard } from "./ProductCard";
import { useCart } from "../../hooks/useCart";
import { TopMenu } from "../Layout/TopMenu";

export function ProductGrid({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart, cartCount } = useCart(products);
  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filteredProducts = useMemo(() => {
    const searchedProducts = searchProducts(products, searchTerm);
    return filterByCategory(searchedProducts, selectedCategory);
  }, [products, searchTerm, selectedCategory]);

  return (
    <section className="w-full">
      <TopMenu
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartCount={cartCount}
      />

      <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max items-center gap-2 rounded-full border border-[var(--ring)] bg-[var(--surface-muted)] p-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-primary shadow-sm"
                      : "text-secondary hover:bg-white/70 hover:text-primary"
                  }`}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
