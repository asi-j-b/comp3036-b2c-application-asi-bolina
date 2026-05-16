import type { Product } from "@repo/db/data";

export function getCategories(products: Product[]) {
  return ["All", ...new Set(products.map((product) => product.category))];
}

export function filterByCategory(products: Product[], category: string) {
  if (category === "All") {
    return products;
  }

  return products.filter((product) => product.category === category);
}

export function searchProducts(products: Product[], searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return products;
  }

  return products.filter((product) => {
    return (
      product.name.toLowerCase().includes(normalizedSearchTerm) ||
      product.description.toLowerCase().includes(normalizedSearchTerm)
    );
  });
}

export function sortProducts(
  products: Product[],
  sortBy: "name" | "price" | "rating",
  direction: "asc" | "desc" = "asc",
) {
  const sorted = [...products].sort((left, right) => {
    if (sortBy === "name") return left.name.localeCompare(right.name);
    if (sortBy === "price") return left.price - right.price;
    return left.rating - right.rating;
  });

  return direction === "desc" ? sorted.reverse() : sorted;
}
