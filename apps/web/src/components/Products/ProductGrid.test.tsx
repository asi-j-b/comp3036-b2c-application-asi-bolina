import { test, expect } from "vitest";
import { render } from "vitest-browser-react";
import { ProductGrid } from "./ProductGrid";
import { mockProducts } from "@repo/db/data";
import { SidebarContext } from "@/context/SidebarContext";

function renderProductGrid() {
  return render(
    <SidebarContext.Provider value={{ isOpen: false, toggle: () => {} }}>
      <ProductGrid products={mockProducts} />
    </SidebarContext.Provider>,
  );
}

test("renders all products initially", async () => {
  const component = renderProductGrid();
  const articles = component.baseElement.getElementsByTagName("article");
  expect(articles.length).toBe(mockProducts.length);
});

test("category filter hides non-matching items", async () => {
  const component = renderProductGrid();
  const base = component.baseElement as HTMLElement;
  const categorySelect = base.querySelector(
    'select[aria-label="Filter by category"]',
  ) as HTMLSelectElement;
  expect(categorySelect).toBeTruthy();

  categorySelect.value = "Electronics";
  categorySelect.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 0));

  const filtered = mockProducts.filter((p) => p.category === "Electronics");
  const articles = component.baseElement.getElementsByTagName("article");
  expect(articles.length).toBe(filtered.length);
});

// Note: search behavior is verified in mockProducts.test.ts; UI-level input event tests
// can be flaky in this environment, so we keep grid tests focused on rendering and
// category filtering which exercise integration with the helpers.

