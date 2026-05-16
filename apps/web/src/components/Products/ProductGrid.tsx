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
