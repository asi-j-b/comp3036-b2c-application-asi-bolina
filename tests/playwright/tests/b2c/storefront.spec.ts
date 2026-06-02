import { expect, test, type Page } from "@playwright/test";

const userEmail = process.env.USER_EMAIL ?? "alice@example.com";
const userPassword = process.env.USER_PASSWORD ?? "password123";

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
    await expect(page.locator("article")).toHaveCount(8);
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

    await page.getByLabel("Filter by category").evaluate((node) => {
      const select = node as HTMLSelectElement;
      select.value = "Electronics";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await expect(page.getByLabel("Filter by category")).toHaveValue("Electronics");

    await expect(page.locator("article")).toHaveCount(3);
    await expect(page.getByText("AeroPulse Smart Watch")).toBeVisible();
    await expect(page.getByText("Studio Noise-Cancel Headphones")).toBeVisible();
    await expect(page.getByText("Compact Bluetooth Speaker")).toBeVisible();
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
    await expect(
      page.getByText("Track workouts, sleep, and notifications"),
    ).toBeVisible();
  });

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
    await expect(page.getByText("AeroPulse Smart Watch")).toBeVisible();
    await expect(page.getByText("$219 each")).toBeVisible();

    await page.getByRole("button", { name: "+" }).click();
    await expect(page.getByText("$438")).toBeVisible();

    await page.getByRole("button", { name: "-" }).click();
    await expect(page.getByText("$219", { exact: true })).toBeVisible();

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

  test("login shows account email and enables checkout mock message", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Email Address").fill(userEmail);
    await page.getByLabel("Password").fill(userPassword);
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText(userEmail)).toBeVisible();

    await page.goto("/checkout");
    await expect(page.getByText(`You are signed in as ${userEmail}.`)).toBeVisible();
    await expect(
      page.getByText("This is the mock checkout step for Iteration 1."),
    ).toBeVisible();
  });
});
