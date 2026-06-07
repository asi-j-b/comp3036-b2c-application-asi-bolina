import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

const sampleImageUrl =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

test.describe("Admin dashboard authentication", () => {
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

test.describe("Admin product creation lifecycle", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("admin creates a product successfully", async ({ page }) => {
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

// 🟢 NEW ACCESSIBLE DESCRIBE BLOCK WRAPPER TARGETING UNTESTED MUTATIONS
test.describe("Admin product item modifications", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("admin edits an existing product parameters profile", async ({ page }) => {
    const originalName = `Editable Baseline ${Date.now()}`;
    const updatedName = `Updated Baseline ${Date.now()}`;

    // 1. Seed a pristine product to edit securely
    await page.goto("/admin-dashboard/manage-products");
    await page.getByRole("link", { name: "Create Product" }).click();
    await page.locator("#name").fill(originalName);
    await page.locator("#category").fill("Fitness");
    await page.locator("#description").fill("Testing description parameter changes.");
    await page.locator("#price").fill("150");
    await page.locator("#stock").fill("20");
    await page.locator("#image-url").fill(sampleImageUrl);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Product created successfully")).toBeVisible();

    // 2. Locate the product via the dynamic anchor links in AdminList
    await page.goto("/admin-dashboard/manage-products");
    
    // Fall back to target the detail/edit layout wrapper
    await page.getByRole("link", { name: originalName }).click();

    // 3. Populate form adjustments matching Editor fields
    await page.locator("#name").fill(updatedName);
    await page.locator("#price").fill("175");
    await page.locator("#stock").fill("15");
    await page.getByRole("button", { name: "Save" }).click();

    // Verify confirmation string triggers matching component states
    await expect(page.getByText("Product updated successfully")).toBeVisible();
  });
});

// 🟢 NEW ACCESSIBLE DESCRIBE BLOCK WRAPPER TARGETING UNTESTED DELETIONS
test.describe("Admin catalog product deletions", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("admin purges a product listing profile and confirms alert context modal", async ({ page }) => {
    const targetName = `To Be Deleted ${Date.now()}`;

    // 1. Seed the temporary product profile
    await page.goto("/admin-dashboard/manage-products");
    await page.getByRole("link", { name: "Create Product" }).click();
    await page.locator("#name").fill(targetName);
    await page.locator("#category").fill("Home");
    await page.locator("#description").fill("This item will be deleted shortly.");
    await page.locator("#price").fill("10");
    await page.locator("#stock").fill("1");
    await page.locator("#image-url").fill(sampleImageUrl);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Product created successfully")).toBeVisible();

    // 2. Navigate back to inventory lists containing row mutation triggers
    await page.goto("/admin-dashboard/manage-products");
    
    // Intercept native browser confirmation dialogues cleanly to approve deletions automatically
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain(`Delete ${targetName}?`);
      await dialog.accept();
    });

    // Isolate the targeted item container article row layout element structure
    const productArticleRow = page.locator("article").filter({ hasText: targetName });
    await productArticleRow.getByRole("button", { name: "Delete" }).click();

    // 3. Confirm target profile element clears from view layers successfully
    await expect(page.getByRole("link", { name: targetName })).not.toBeVisible();
  });
});

test.describe("Admin purchase records analytics", () => {
  test.use({ storageState: ".auth/admin.json" });

  test("admin views purchase records page configurations", async ({ page }) => {
    await page.goto("/admin-dashboard/purchase-records");

    await expect(page.getByRole("heading", { name: "Purchase Records" })).toBeVisible();
    await expect(page.getByText("Customer orders and item totals.")).toBeVisible();

    const orderRecord = page.locator("article").filter({ hasText: /^Order / });
    const emptyState = page.getByText("No orders have been placed yet.");

    await expect(orderRecord.first().or(emptyState)).toBeVisible();
  });
});