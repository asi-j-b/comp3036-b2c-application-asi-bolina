"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type { Product } from "@repo/db/data";

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
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (category: string) => {
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
          className="inline-flex items-center justify-center rounded-md border border-[var(--ring)] px-3 py-2 text-sm font-semibold text-primary hover:border-wsu hover:text-wsu lg:hidden"
          aria-label="Toggle sidebar"
        >
          <span className="sr-only">Open menu</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          Full Stack Store
        </Link>

        <select
          aria-label="Filter by category"
          value={initialSelectedCategory}
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
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ring)] bg-[var(--surface)] text-primary hover:border-wsu hover:text-wsu"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.5 16.5a5.5 5.5 0 0 1 11 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {profileOpen ? (
                <div className="absolute right-0 top-12 z-20 min-w-44 rounded-md border border-[var(--ring)] bg-white p-1 shadow-lg">
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-primary hover:bg-slate-50"
                  >
                    Settings
                  </Link>
                  <LogoutButton
                    onLogout={() => {
                      setUserEmail(null);
                      setProfileOpen(false);
                    }}
                    label="Sign out"
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  />
                </div>
              ) : null}
            </div>
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
