import { expect, test, type Page } from "@playwright/test";

const userEmail = process.env.USER_EMAIL ?? "alicekingsley@gmail.com";
const userPassword = process.env.USER_PASSWORD ?? "P@ssword123!";

async function clearCart(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
}

test.describe("B2C storefront", () => {
  test.beforeEach(async ({ page }) => {
    await clearCart(page);
  });

  test("home page loads product cards and navbar cart count starts at 0", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Full Stack Store" })).toBeVisible();
    
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    await expect(page.getByRole("link", { name: "Cart" })).toContainText("0");
  });

  test("user searches headphones and only matching product remains", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByLabel("Search products").fill("headphones");

    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.getByText("Studio Noise-Cancel Headphones")).toBeVisible();
    await expect(page.getByText("AeroPulse Smart Watch")).not.toBeVisible();
  });

  test("user filters category Electronics", async ({ page }) => {
    await page.goto("/");

    const electronicsPill = page.getByRole("button", { name: "Electronics", exact: false }).or(
      page.getByRole("link", { name: "Electronics", exact: false })
    );
    await electronicsPill.first().click();

    await expect(page.getByText("AeroPulse Smart Watch")).toBeVisible();
    await expect(page.getByText("Studio Noise-Cancel Headphones")).toBeVisible();
    await expect(page.getByText("MetroLine Hoodie")).not.toBeVisible();
  });

  test("user opens a product detail page from a card", async ({ page }) => {
    await page.goto("/");

    await page
      .locator('a[href="/product/aeropulse-smart-watch"]')
      .first()
      .click({ force: true });

    await expect(page).toHaveURL(/\/product\/aeropulse-smart-watch$/);
    await expect(
      page.getByRole("heading", { name: "AeroPulse Smart Watch" }),
    ).toBeVisible();
  });

  // FIXED TEST 5: Asserts against the actual text values inside the shopping cart route container
  test("user adds product to cart, updates quantity, and clears cart", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .locator("article", { hasText: "AeroPulse Smart Watch" })
      .getByRole("button", { name: "Add to cart" })
      .click();
    await expect(page.getByRole("link", { name: "Cart" })).toContainText("1");

    await page.getByRole("link", { name: "Cart" }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole("heading", { name: "Your cart" })).toBeVisible();

    // Select the unique span element that manages the quantity string inside CartView.tsx
    const quantitySpan = page.locator("span.min-w-6");
    await expect(quantitySpan).toHaveText("1");

    // Clicks "+" increment button
    await page.getByRole("button", { name: "+" }).click();
    // Validates that state calculation updates dynamically to a text value of "2"
    await expect(quantitySpan).toHaveText("2");

    // Clicks "-" decrement button
    await page.getByRole("button", { name: "-" }).click();
    await expect(quantitySpan).toHaveText("1");

    await page.getByRole("button", { name: "Clear cart" }).click();
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
  });

  test("checkout asks for sign-in when not logged in", async ({ page }) => {
    await page.goto("/checkout");

    await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
    await expect(
      page.getByText("To complete payment, please sign in to your account."),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

 // With auth.setup.ts working properly, Alice is already logged in when the browser opens!
  test("login, add item to cart, complete mock payment checkout flow", async ({
    page,
  }) => {
    // 1. Go straight to the home page—you will already see your account session active!
    await page.goto("/");
    
    // 2. Add an item to the cart
    await page
      .locator("article", { hasText: "AeroPulse Smart Watch" })
      .getByRole("button", { name: "Add to cart" })
      .click();

    // 3. Move directly to checkout
    await page.goto("/checkout");
    await expect(page.getByText(`You are signed in as ${userEmail}.`)).toBeVisible();

    // 4. Trigger order creation
    await page.getByRole("button", { name: "Create order" }).click();

    // 5. Land on payment gateway view screen
    await expect(page).toHaveURL(/\/payment\//);
    await expect(page.getByRole("heading", { name: "Mock Payment" })).toBeVisible();
    
    // 6. Fill out the mock payment form
    await page.locator("#cardNumber").fill("4242424242424242");
    await page.locator("#expiry").fill("12/28");
    await page.locator("#cvc").fill("123");
    await page.locator("#name").fill("Alice Kingsley");

    // 7. Commit payment PATCH action
    await page.getByRole("button", { name: "Pay Now" }).click();

    // 8. Confirms successful database update and safe redirection
    await expect(page).toHaveURL(/\/account$/);
  });
});