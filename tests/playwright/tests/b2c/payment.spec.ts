import { expect, test, type Page } from "@playwright/test";
import { customerEmail } from "./helpers";

async function clearCart(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
}

test.describe("Mock payment flow", () => {
  test.beforeEach(async ({ page }) => {
    await clearCart(page);
  });

  test("customer completes checkout, mock payment, and order history", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .locator("article", { hasText: "AeroPulse Smart Watch" })
      .getByRole("button", { name: "Add to cart" })
      .click();

    await page.goto("/checkout");
    await expect(page.getByText(`You are signed in as ${customerEmail}.`)).toBeVisible();

    await page.getByRole("button", { name: "Create order" }).click();

    await expect(page).toHaveURL(/\/payment\//);
    await expect(page.getByRole("heading", { name: "Mock Payment" })).toBeVisible();

    await page.locator("#cardNumber").fill("4242424242424242");
    await page.locator("#expiry").fill("12/28");
    await page.locator("#cvc").fill("123");
    await page.locator("#name").fill("Alice Kingsley");

    await page.getByRole("button", { name: "Pay Now" }).click();

    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByText("AeroPulse Smart Watch")).toBeVisible();
    await expect(page.getByText("COMPLETED")).toBeVisible();

    const ordersResponse = await page.request.get("/api/orders");
    expect(ordersResponse.ok()).toBeTruthy();

    const ordersBody = await ordersResponse.json();
    const completedOrder = ordersBody.orders.find(
      (order: {
        status: string;
        items: { product: { name: string } }[];
      }) =>
        order.status === "COMPLETED" &&
        order.items.some(
          (item) => item.product.name === "AeroPulse Smart Watch",
        ),
    );

    expect(completedOrder).toBeTruthy();
  });
});
