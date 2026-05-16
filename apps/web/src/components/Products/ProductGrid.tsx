"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { filterByCategory, searchProducts } from "../../functions/products";
import type { Product } from "@repo/db/data";
import { ProductCard } from "./ProductCard";
import { useCart } from "../../hooks/useCart";
import { TopMenu } from "../Layout/TopMenu";

export function ProductGrid({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFiltering, setIsFiltering] = useState(false);
  const isFirstRender = useRef(true);
  const { addToCart, cartCount } = useCart(products);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsFiltering(true);
    const timer = window.setTimeout(() => setIsFiltering(false), 320);

    return () => window.clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

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

        {isFiltering ? (
          <div className="inline-flex items-center gap-2 rounded-md border border-[var(--ring)] bg-[var(--surface)] px-3 py-2 text-sm text-secondary">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--ring)] border-t-wsu" aria-hidden="true" />
            Updating results...
          </div>
        ) : null}

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