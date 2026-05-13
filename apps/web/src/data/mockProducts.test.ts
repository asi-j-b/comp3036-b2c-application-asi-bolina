import { describe, it, expect } from "vitest";
import { mockProducts, getCategories, filterByCategory, searchProducts, sortProducts } from "./mockProducts";

describe("mockProducts helpers", () => {
  it("returns categories including All and unique categories", () => {
    const cats = getCategories(mockProducts);
    expect(cats[0]).toBe("All");
    // unique count should be less than or equal to length
    expect(new Set(cats).size).toBe(cats.length);
  });

  it("filters by category correctly", () => {
    const electronics = filterByCategory(mockProducts, "Electronics");
    expect(electronics.every((p) => p.category === "Electronics")).toBe(true);
  });

  it("searches by name or description", () => {
    const term = "hoodie";
    const results = searchProducts(mockProducts, term);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => (p.name + p.description).toLowerCase().includes(term))).toBe(true);
  });

  it("sorts by name, price, and rating", () => {
    const byName = sortProducts(mockProducts, "name");
    const byPrice = sortProducts(mockProducts, "price");
    const byRating = sortProducts(mockProducts, "rating");

    expect(byName[0].name <= byName[1].name).toBe(true);
    expect(byPrice[0].price <= byPrice[byPrice.length - 1].price).toBe(true);
    expect(byRating[0].rating >= byRating[byRating.length - 1].rating).toBe(true);
  });
});
