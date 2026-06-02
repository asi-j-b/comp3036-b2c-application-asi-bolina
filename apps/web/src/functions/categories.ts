import type { Product } from "@repo/db/data";

type CategoryProduct = Pick<Product, "active" | "category">;

export async function categories(products: CategoryProduct[]) {
  return products
    .filter((p) => p.active !== false)
    .sort((a, b) => a.category.localeCompare(b.category))
    .reduce(
      (acc, product) => {
        const category = acc.find((c) => c.name === product.category);
        if (category) {
          category.count++;
        } else {
          acc.push({ name: product.category, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[],
    );
}
