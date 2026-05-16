"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import type { Product } from "@repo/db/data";
import { LogoutButton } from "../auth/LogoutButton";

export function TopMenu({
  products,
  searchTerm: initialSearchTerm,
  selectedCategory: initialSelectedCategory,
  onSearchChange,
  onCategoryChange,
  cartCount,
}: {
  products: Product[];
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  cartCount: number;
}) {
  const { toggle } = useSidebarContext();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const response = await fetch("/api/auth");

      if (!response.ok) {
        setUserEmail(null);
        return;
      }

      const data = await response.json();
      setUserEmail(data.email ?? null);
    }

    void loadUser();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchChange(searchTerm);
  };

  return (
    <header className="w-full border-b border-[var(--ring)] bg-[var(--surface)] px-4 py-3 sm:px-6">
      <div className="flex w-full flex-wrap items-center gap-3">
        <button
          onClick={toggle}
          className="rounded-md border border-[var(--ring)] px-3 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu"
          aria-label="Toggle sidebar"
        >
          Menu
        </button>

        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          Full Stack Store
        </Link>

        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(event) => handleCategoryChange(event.target.value)}
          className="rounded-md border border-[var(--ring)] bg-[var(--surface)] px-3 py-2 text-sm text-primary outline-none focus:border-wsu"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <form onSubmit={handleSearchSubmit} className="flex min-w-[240px] flex-1 items-center">
          <label className="sr-only" htmlFor="product-search">
            Search products
          </label>
          <div className="flex w-full overflow-hidden rounded-md border border-[var(--ring)]">
            <input
              id="product-search"
              type="search"
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search products"
              className="w-full bg-[var(--surface)] px-3 py-2 text-sm text-primary outline-none"
            />
            <button
              type="submit"
              className="border-l border-[var(--ring)] bg-wsu px-4 py-2 text-sm font-semibold text-white hover:bg-wsu-light"
            >
              Search
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3">
          {userEmail ? (
            <>
              <span className="text-sm text-primary">
                Welcome, {userEmail}
              </span>
              <LogoutButton onLogout={() => setUserEmail(null)} />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-[var(--ring)] px-3 py-2 text-sm font-medium text-primary hover:border-wsu hover:text-wsu"
            >
              Login
          </Link>
          )}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-md bg-wsu px-3 py-2 text-sm font-semibold text-white hover:bg-wsu-light"
            aria-label="Cart"
          >
            Cart
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
