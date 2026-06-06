import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

const sampleImageUrl =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

test.describe("Admin dashboard", () => {
  test("unauthenticated user sees login screen", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/admin-dashboard");
    await expect(page.getByText("Staff Portal")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();

    await context.close();
  });

  test("admin logs in and reaches dashboard", async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page.getByRole("heading", { name: "Store management" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Manage Products" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Purchase Records" })).toBeVisible();
  });
});

test.describe("Admin product management", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("admin creates a product", async ({ page }) => {
    const productName = `E2E Test Product ${Date.now()}`;

    await page.goto("/admin-dashboard/manage-products");
    await expect(page.getByRole("heading", { name: "Manage Products" })).toBeVisible();

    await page.getByRole("link", { name: "Create Product" }).click();
    await expect(page.getByRole("heading", { name: "Create Product" })).toBeVisible();

    await page.locator("#name").fill(productName);
    await page.locator("#category").fill("Electronics");
    await page.locator("#description").fill("Created by Playwright E2E test.");
    await page.locator("#price").fill("99");
    await page.locator("#stock").fill("5");
    await page.locator("#image-url").fill(sampleImageUrl);
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Product created successfully")).toBeVisible();

    await page.goto("/admin-dashboard/manage-products");
    await expect(page.getByRole("link", { name: productName })).toBeVisible();
  });
});

test.describe("Admin purchase records", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("admin views purchase records page", async ({ page }) => {
    await page.goto("/admin-dashboard/purchase-records");

    await expect(page.getByRole("heading", { name: "Purchase Records" })).toBeVisible();
    await expect(page.getByText("Customer orders and item totals.")).toBeVisible();

    const orderRecord = page.locator("article").filter({ hasText: /^Order / });
    const emptyState = page.getByText("No orders have been placed yet.");

    await expect(orderRecord.first().or(emptyState)).toBeVisible();
  });
});
