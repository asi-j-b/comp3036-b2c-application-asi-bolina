import { vi, test, expect } from "vitest";
import { render } from "vitest-browser-react";
import { ProductCard } from "./ProductCard";
import { mockProducts } from "../../data/mockProducts";

const product = mockProducts[0];

test("renders product data and calls add handler", async () => {
  const onAdd = vi.fn();
  const rendered = render(<ProductCard product={product} onAddToCart={onAdd} />);

  const base = rendered.baseElement as HTMLElement;
  expect(base.textContent).toContain(product.name);
  expect(base.textContent).toContain(product.category);

  const addBtn = base.querySelector("button");
  expect(addBtn).toBeTruthy();

  // click and let event loop process
  (addBtn as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 0));

  expect(onAdd).toHaveBeenCalledWith(product.id);
});
