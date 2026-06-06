import { test as setup } from "@playwright/test";
import { Role } from "@prisma/client";

setup(
  "authenticate assignment 3",
  { tag: "@a3" },
  async ({ playwright }) => {
  const authFile = ".auth/user.json";
  const apiContext = await playwright.request.newContext();

  // Hit your genuine authentication route with matching seeded customer details
  const response = await apiContext.post("http://localhost:3001/api/auth", {
    data: {
      email: "alicekingsley@gmail.com",
      password: "P@ssword123!",
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  await apiContext.storageState({ path: authFile });
  await apiContext.dispose();
  }
  /*
  await apiContext.post("/api/auth", {
    data: JSON.stringify({ password: "123" }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await apiContext.storageState({ path: authFile });
  },
  */
);
