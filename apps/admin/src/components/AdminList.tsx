"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  createdAt: Date | string;
  category: string;
  active: boolean;
};

type SortBy = "date-desc" | "date-asc" | "name-asc" | "name-desc";
type Visibility = "all" | "active" | "inactive";

function parseDateFilter(input: string): Date | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 8) {
    return null;
  }

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-AU", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function AdminList({ products }: { products: Product[] }) {
  const [contentFilter, setContentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<Visibility>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");

  const router = useRouter();

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ active: !currentStatus }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to update product status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Delete ${name}? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    const parsedDate = parseDateFilter(dateFilter);
    const query = contentFilter.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const productDate = new Date(product.createdAt);
      const contentMatch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const dateMatch = !parsedDate || productDate >= parsedDate;
      const visibilityMatch =
        visibilityFilter === "all" ||
        (visibilityFilter === "active" ? product.active : !product.active);

      return contentMatch && dateMatch && visibilityMatch;
    });

    filtered.sort((left, right) => {
      if (sortBy === "name-asc") {
        return left.name.localeCompare(right.name);
      }
      if (sortBy === "name-desc") {
        return right.name.localeCompare(left.name);
      }
      if (sortBy === "date-asc") {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      }
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

    return filtered;
  }, [products, contentFilter, dateFilter, visibilityFilter, sortBy]);

  return (
    <section className="w-full max-w-5xl space-y-5">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="content-filter" className="mb-1 block text-sm font-medium">
            Filter products
          </label>
          <input
            id="content-filter"
            type="text"
            value={contentFilter}
            onChange={(event) => setContentFilter(event.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="date-filter" className="mb-1 block text-sm font-medium">
            Created after
          </label>
          <input
            id="date-filter"
            type="text"
            placeholder="DD/MM/YYYY"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="visibility-filter" className="mb-1 block text-sm font-medium">
            Visibility
          </label>
          <select
            id="visibility-filter"
            value={visibilityFilter}
            onChange={(event) => setVisibilityFilter(event.target.value as Visibility)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-by" className="mb-1 block text-sm font-medium">
            Sort by
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      <div>
        <Link
          href="/posts/create"
          className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Create Product
        </Link>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[140px_1fr]"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-24 w-full rounded object-cover"
            />

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">
                <Link href={`/post/${product.slug}`}>{product.name}</Link>
              </h2>
              <p className="text-sm text-slate-600">{product.description}</p>
              <p className="text-sm text-slate-600">
                {product.category} · {formatCurrency(product.price)} · {product.stock} in stock
              </p>
              <p className="text-sm text-slate-600">Created on {formatDate(product.createdAt)}</p>

              <button
                type="button"
                onClick={() => handleToggleActive(product.id, product.active)}
                className={`rounded px-3 py-1 text-sm font-medium ${
                  product.active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {product.active ? "Active" : "Inactive"}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(product.id, product.name)}
                className="rounded bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
