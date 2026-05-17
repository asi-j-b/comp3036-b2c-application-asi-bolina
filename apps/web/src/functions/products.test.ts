import { expect, test } from "vitest";
import { mockProducts } from "@repo/db/data";
import {
  filterByCategory,
  getCategories,
  searchProducts,
  sortProducts,
} from "./products";

test("getCategories returns All and unique product categories", () => {
  expect(getCategories(mockProducts)).toEqual([
    "All",
    "Electronics",
    "Clothing",
    "Footwear",
    "Home",
    "Kitchen",
    "Accessories",
  ]);
});

test("filterByCategory returns all products for All", () => {
  expect(filterByCategory(mockProducts, "All")).toHaveLength(mockProducts.length);
});

test("filterByCategory returns only matching products", () => {
  const electronics = filterByCategory(mockProducts, "Electronics");

  expect(electronics).toHaveLength(3);
  expect(electronics.every((product) => product.category === "Electronics")).toBe(
    true,
  );
});

test("searchProducts matches product name and description", () => {
  expect(searchProducts(mockProducts, "headphones")).toEqual([mockProducts[1]]);
  expect(searchProducts(mockProducts, "weeknight")).toEqual([mockProducts[5]]);
});

test("sortProducts sorts without mutating the original array", () => {
  const sortedByPrice = sortProducts(mockProducts, "price", "desc");

  expect(sortedByPrice[0]?.name).toBe("Studio Noise-Cancel Headphones");
  expect(mockProducts[0]?.name).toBe("AeroPulse Smart Watch");
});
