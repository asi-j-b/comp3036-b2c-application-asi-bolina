import type { Page } from "@playwright/test";

export const customerEmail = process.env.USER_EMAIL ?? "alicekingsley@gmail.com";
export const customerPassword = process.env.USER_PASSWORD ?? "P@ssword123!";
export const adminEmail = process.env.ADMIN_EMAIL ?? "johnathanbradley@admin.com";
export const adminPassword = process.env.ADMIN_PASSWORD ?? "AdminPortal#1";

export async function loginAsCustomer(page: Page) {
  await page.goto("/login");
  await page.locator("#email").fill(customerEmail);
  await page.locator("#password").fill(customerPassword);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("/");
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/");
  await page.locator("#admin-email").fill(adminEmail);
  await page.locator("#admin-password").fill(adminPassword);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/\/admin-dashboard/);
}
