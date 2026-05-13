"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ThemeSwitch from "../Themes/ThemeSwitcher";
import { useSidebarContext } from "@/context/SidebarContext";
import { filterByCategory, getCategories, searchProducts, type Product } from "@/data/mockProducts";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({
  query,
  products,
  searchTerm: initialSearchTerm,
  selectedCategory: initialSelectedCategory,
  onSearchChange,
  onCategoryChange,
  cartCount,
}: {
  query?: string;
  products: Product[];
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  cartCount: number;
}) {
  const router = useRouter();
  const { toggle } = useSidebarContext();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);

  const categories = useMemo(() => getCategories(products), [products]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${search}`);
    },
  );

  return (
    <div className="space-y-0">
      {/* Top bar with menu, search, theme, login, cart */}
      <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={toggle}
            className="rounded-lg p-2 hover:bg-[var(--surface)] lg:hidden"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <form action="#" method="GET" className="hidden flex-1 sm:block sm:max-w-xs">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                ⌕
              </span>
              <input
                type="search"
                placeholder="Search"
                defaultValue={query}
                onChange={handleSearch}
                className="w-full rounded-lg border border-gray-200 bg-[var(--surface)] py-2 pl-9 pr-4 text-sm text-primary outline-none transition focus:border-gray-400"
              />
            </div>
          </form>

          <div className="flex items-center justify-end gap-x-3">
            <Link
              href="/checkout"
              className="relative rounded-lg p-2 hover:bg-[var(--surface)]"
              aria-label="Cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 rounded-full bg-wsu px-2 py-0.5 text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Login
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* Refine results banner */}
      <div className="space-y-3 bg-slate-900 px-4 py-4 text-white sm:px-6">
        <div>
          <h2 className="text-base font-semibold">Refine results</h2>
          <p className="mt-1 text-xs text-slate-300">
            Use a category filter or type in the search box to narrow the catalog.
          </p>
        </div>

        <label className="hidden sm:block">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products"
            className="w-full max-w-md rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-400 outline-none transition focus:border-wsu"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isSelected
                    ? "bg-wsu text-white"
                    : "border border-slate-600 text-white hover:border-wsu hover:bg-slate-800"
                }`}
                aria-pressed={isSelected}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
