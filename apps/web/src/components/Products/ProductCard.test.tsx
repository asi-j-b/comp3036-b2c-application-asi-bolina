import { vi, test, expect } from "vitest";
import { render } from "vitest-browser-react";
import { ProductCard } from "./ProductCard";
import { mockProducts } from "../../data/mockProducts";

const product = mockProducts[0]!;

test("renders product data and calls add handler", async () => {
  const onAdd = vi.fn();
  const rendered = render(<ProductCard product={product} onAddToCart={onAdd} />);

  const base = rendered.baseElement as HTMLElement;
  expect(base.textContent).toContain(product.name);
  expect(base.textContent).toContain(product.category);

  const addBtn = Array.from(base.querySelectorAll("button")).find((button) =>
    button.textContent?.includes("Add to cart"),
  );
  expect(addBtn).toBeTruthy();

  // click and let event loop process
  (addBtn as HTMLElement).click();
  await new Promise((r) => setTimeout(r, 0));

  expect(onAdd).toHaveBeenCalledWith(product.id);
});

test("opens product detail modal and supports saving or cancelling changes", async () => {
  const onAdd = vi.fn();
  const rendered = render(<ProductCard product={product} onAddToCart={onAdd} />);
  const base = rendered.baseElement as HTMLElement;

  const viewBtn = Array.from(base.querySelectorAll("button")).find((button) =>
    button.textContent?.includes("View"),
  ) as HTMLElement;
  viewBtn.click();
  await new Promise((r) => setTimeout(r, 0));

  expect(base.querySelector('[role="dialog"]')).toBeTruthy();
  expect(base.textContent).toContain(product.description);

  const quantityInput = base.querySelector('input[type="number"]') as HTMLInputElement;
  quantityInput.value = "3";
  quantityInput.dispatchEvent(new Event("input", { bubbles: true }));

  const cancelBtn = Array.from(base.querySelectorAll("button")).find((button) =>
    button.textContent?.includes("Cancel changes"),
  ) as HTMLElement;
  cancelBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect(base.querySelector('[role="dialog"]')).toBeNull();

  viewBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect((base.querySelector('input[type="number"]') as HTMLInputElement).value).toBe("1");

  const closeBtn = base.querySelector('button[aria-label="Close product details"]') as HTMLElement;
  closeBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect(base.querySelector('[role="dialog"]')).toBeNull();

  viewBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  const reopenedInput = base.querySelector('input[type="number"]') as HTMLInputElement;
  reopenedInput.value = "2";
  reopenedInput.dispatchEvent(new Event("input", { bubbles: true }));

  const saveBtn = Array.from(base.querySelectorAll("button")).find((button) =>
    button.textContent?.includes("Save changes"),
  ) as HTMLElement;
  saveBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect(base.querySelector('[role="dialog"]')).toBeNull();

  viewBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect((base.querySelector('input[type="number"]') as HTMLInputElement).value).toBe("2");
});
