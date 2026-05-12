"use client";

import { useMemo, useState } from "react";
import { filterByCategory, getCategories, searchProducts, type Product } from "@/data/mockProducts";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/hooks/useCart";

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
    <section className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <div className="inline-flex w-fit rounded-full border border-[var(--ring)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Iteration 1 storefront
        </div>
        <div className="space-y-3">
          <h1 className="text-5xl font-semibold tracking-tight text-primary sm:text-6xl">
            Browse products, filter by category, and search by name.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-secondary">
            Static mock data is powering the first storefront pass so the UI can move ahead before the backend is swapped in.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ring)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-primary">
          <span aria-hidden="true">Cart</span>
          <span data-testid="cart-count" className="rounded-full bg-wsu px-2 py-0.5 text-xs text-white">
            {cartCount}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-6 rounded-[2rem] border border-[var(--ring)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:shadow-none">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Refine results</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Use a category filter or type in the search box to narrow the catalog.
            </p>
          </div>

          <label className="block">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products"
              className="w-full rounded-2xl border border-[var(--ring)] bg-transparent px-4 py-3 text-sm text-primary outline-none transition focus:border-wsu"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-wsu text-white"
                      : "border border-[var(--ring)] text-primary hover:border-wsu hover:text-wsu"
                  }`}
                  aria-pressed={isSelected}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
            <p className="text-sm font-medium text-primary">Current filters</p>
            <p className="mt-1 text-sm text-secondary">
              {selectedCategory === "All" ? "All categories" : selectedCategory}
              {searchTerm ? ` · matching "${searchTerm}"` : ""}
            </p>
          </div>
        </aside>

        <div>
          {filteredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[var(--ring)] bg-[var(--surface)] px-6 py-16 text-center">
              <p className="text-lg font-semibold text-primary">No products found</p>
              <p className="mt-2 text-sm text-secondary">
                Try a different category or search term.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-8 rounded-[2rem] border border-[var(--ring)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">Cart summary</h2>
            <p className="mt-1 text-sm text-secondary">
              Items are stored in local state until we wire the backend.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-[var(--ring)] px-4 py-2 text-sm font-semibold text-primary transition hover:border-wsu hover:text-wsu"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-5 space-y-3 border-t border-[var(--ring)] pt-4">
          {cartItems.length === 0 ? (
            <p className="text-sm text-secondary">Your cart is empty.</p>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-primary">{product.name}</p>
                  <p className="text-secondary">{quantity} x ${product.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="rounded-full border border-[var(--ring)] px-3 py-1 text-xs font-semibold text-primary transition hover:border-wsu hover:text-wsu"
                    aria-label={`Remove one ${product.name} from cart`}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-primary">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                    className="rounded-full border border-[var(--ring)] px-3 py-1 text-xs font-semibold text-primary transition hover:border-wsu hover:text-wsu"
                    aria-label={`Add one more ${product.name} to cart`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[var(--ring)] pt-4">
          <p className="text-sm font-medium text-secondary">Subtotal</p>
          <p className="text-2xl font-semibold text-primary">${cartTotal}</p>
        </div>
      </section>
    </section>
  );
}