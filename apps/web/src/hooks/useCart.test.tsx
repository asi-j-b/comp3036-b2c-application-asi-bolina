import { test, expect } from "vitest";
import { render } from "vitest-browser-react";
import { useCart } from "./useCart";
import { mockProducts } from "../data/mockProducts";

function TestComponent({ products }: { products: typeof mockProducts }) {
  const { addToCart, removeFromCart, cartCount, cartTotal, clearCart } = useCart(products);

  return (
    <div>
      <button onClick={() => addToCart(products[0].id)}>Add</button>
      <button onClick={() => removeFromCart(products[0].id)}>Remove</button>
      <button onClick={() => clearCart()}>Clear</button>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="total">{cartTotal}</span>
    </div>
  );
}

test("useCart add/remove/clear behave correctly", async () => {
  const comp = render(<TestComponent products={mockProducts} />);
  const base = comp.baseElement as HTMLElement;
  const addBtn = base.querySelector('button:nth-of-type(1)') as HTMLElement;
  const removeBtn = base.querySelector('button:nth-of-type(2)') as HTMLElement;
  const clearBtn = base.querySelector('button:nth-of-type(3)') as HTMLElement;

  const count = () => base.querySelector('[data-testid="count"]')!.textContent;

  // initial
  expect(count()).toBe("0");

  // add one
  addBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect(count()).toBe("1");

  // add another
  addBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect(count()).toBe("2");

  // remove one
  removeBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect(count()).toBe("1");

  // clear
  clearBtn.click();
  await new Promise((r) => setTimeout(r, 0));
  expect(count()).toBe("0");
});
