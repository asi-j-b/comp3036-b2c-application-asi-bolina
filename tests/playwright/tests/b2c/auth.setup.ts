import { test as setup } from "@playwright/test";
import { seed } from "@repo/db/seed";

const customerEmail = process.env.USER_EMAIL ?? "alicekingsley@gmail.com";
const customerPassword = process.env.USER_PASSWORD ?? "P@ssword123!";
const adminEmail = process.env.ADMIN_EMAIL ?? "johnathanbradley@admin.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "AdminPortal#1";

// 🟢 The correct Playwright API syntax to enforce execution order, makes sure seeding occurs before testing
setup.describe.configure({ mode: 'serial' });

setup("seed database", async () => {
  await seed();
});

setup("authenticate customer", async ({ playwright }) => {
  const apiContext = await playwright.request.newContext();
  const response = await apiContext.post("http://localhost:3001/api/auth", {
    data: {
      email: customerEmail,
      password: customerPassword,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok()) {
    throw new Error(`Customer authentication failed: ${response.status()}`);
  }

  await apiContext.storageState({ path: ".auth/customer.json" });
  await apiContext.dispose();
});

setup("authenticate admin", async ({ playwright }) => {
  const apiContext = await playwright.request.newContext();
  const response = await apiContext.post("http://localhost:3002/api/auth", {
    data: {
      email: adminEmail,
      password: adminPassword,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok()) {
    throw new Error(`Admin authentication failed: ${response.status()}`);
  }

  await apiContext.storageState({ path: ".auth/admin.json" });
  await apiContext.dispose();
});
