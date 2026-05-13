import { test, expect } from "vitest";
import { render } from "vitest-browser-react";
import { ProductGrid } from "./ProductGrid";
import { mockProducts } from "../../data/mockProducts";

test("renders all products initially", async () => {
  const component = render(<ProductGrid products={mockProducts} />);
  const articles = component.baseElement.getElementsByTagName("article");
  expect(articles.length).toBe(mockProducts.length);
});

test("category filter hides non-matching items", async () => {
  const component = render(<ProductGrid products={mockProducts} />);
  const base = component.baseElement as HTMLElement;
  const electronicsBtn = Array.from(base.querySelectorAll("button")).find((b) => b.textContent === "Electronics");
  expect(electronicsBtn).toBeTruthy();
  (electronicsBtn as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 0));

  const filtered = mockProducts.filter((p) => p.category === "Electronics");
  const articles = component.baseElement.getElementsByTagName("article");
  expect(articles.length).toBe(filtered.length);
});

// Note: search behavior is verified in mockProducts.test.ts; UI-level input event tests
// can be flaky in this environment, so we keep grid tests focused on rendering and
// category filtering which exercise integration with the helpers.

