import { test as setup } from "@playwright/test";

const customerEmail = process.env.USER_EMAIL ?? "alicekingsley@gmail.com";
const customerPassword = process.env.USER_PASSWORD ?? "P@ssword123!";

setup(
  "authenticate assignment 3",
  { tag: "@a3" },
  async ({ playwright }) => {
    const authFile = ".auth/user.json";
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
      throw new Error(`Legacy auth setup failed: ${response.status()}`);
    }

    await apiContext.storageState({ path: authFile });
    await apiContext.dispose();
  },
);
