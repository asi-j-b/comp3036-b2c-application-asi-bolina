import { expect, test } from "@playwright/test";

test.describe("Authentication Forms E2E Validation Suite", () => {
  
  test.beforeEach(async ({ page }) => {
    // Isolated local state initialization to ensure form evaluations stay pure
    await page.goto("http://localhost:3001/register");
    await page.evaluate(() => window.localStorage.clear());
  });

  /* ==========================================
     1. REGISTRATION FORM TEST CASES
     ========================================== */

  test("Register: pristine initial state hides error messages", async ({ page }) => {
    await page.goto("http://localhost:3001/register");
    
    // Assert layout header elements are visible but warning texts are completely absent
    await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();
    await expect(page.locator("text=Please enter your first name.")).not.toBeVisible();
    await expect(page.locator("text=Please enter your email address.")).not.toBeVisible();

    // Submission switch trigger must be greyed out and cursor locked by default
    const submitBtn = page.getByRole("button", { name: "Create account" });
    await expect(submitBtn).toBeDisabled();
  });

  test("Register: inline validation error triggers on blur when empty", async ({ page }) => {
    await page.goto("http://localhost:3001/register");

    // Click directly into first name input, then immediately shift focus out to trigger blur
    const firstNameInput = page.locator("#firstName");
    await firstNameInput.focus();
    await page.locator("#lastName").focus();

    // Look for localized crimson warning labels and reactive border outlines
    await expect(page.getByText("Please enter your first name.")).toBeVisible();
    await expect(page.locator("#firstName")).toHaveClass(/border-red-500/);
  });

  test("Register: dynamic interactive password requirement matrix toggles colors", async ({ page }) => {
    await page.goto("http://localhost:3001/register");
    const passwordInput = page.locator("#password");

    // 1. Type an incomplete password and step out to trigger error validation rules
    await passwordInput.fill("abc");
    await passwordInput.blur();

    // Verify border shifts to red and the specific requirement indicator turns into a red '✕'
    await expect(passwordInput).toHaveClass(/border-red-500/);
    
    // FIXED SELECTORS: Binds cleanly to test IDs to isolate validation text changes
    const lengthIndicator = page.locator('[data-test-id="req-length"]');
    const numberIndicator = page.locator('[data-test-id="req-number"]');
    const symbolIndicator = page.locator('[data-test-id="req-symbol"]');
    
    await expect(lengthIndicator).toHaveText("✕");
    await expect(lengthIndicator).toHaveClass(/text-red-500/);
    await expect(numberIndicator).toHaveText("✕");
    await expect(numberIndicator).toHaveClass(/text-red-500/);

    // 2. Start satisfying parameters incrementally while typing to monitor live updates
    await passwordInput.fill("abcdefgh1"); // Long enough + number, but missing special character
    await expect(lengthIndicator).toHaveText("✓");
    await expect(lengthIndicator).toHaveClass(/text-green-600/);
    await expect(numberIndicator).toHaveText("✓");
    await expect(numberIndicator).toHaveClass(/text-green-600/);
    
    await expect(symbolIndicator).toHaveText("✕"); // Symbol safely tracks its own structural value now!

    // 3. Complete the final constraint rule perfectly
    await passwordInput.fill("P@ssword123!");
    await expect(passwordInput).not.toHaveClass(/border-red-500/); // Border resolves back to normal
    await expect(symbolIndicator).toHaveText("✓");
    await expect(symbolIndicator).toHaveClass(/text-green-600/);
  });

  test("Register: email dual-layer logic separates blank vs invalid checks", async ({ page }) => {
    await page.goto("http://localhost:3001/register");
    const emailInput = page.locator("#email");

    // Step out blank to trigger initial level warning
    await emailInput.focus();
    await emailInput.blur();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Invalid email address. Please enter a valid email.")).not.toBeVisible();

    // Type a malformed string block to verify formatting interception rules trigger
    await emailInput.fill("bolina_fsd_testing");
    await emailInput.blur();
    await expect(page.getByText("Please enter your email address.")).not.toBeVisible();
    await expect(page.getByText("Invalid email address. Please enter a valid email.")).toBeVisible();
  });

  test("Register: full completion happy path unlocks submission workflow", async ({ page }) => {
    await page.goto("http://localhost:3001/register");
    const testEmail = `asi_john_bolina_${Date.now()}@westernsydney.edu.au`;

    // Populate registration field layout elements perfectly
    await page.locator("#firstName").fill("Asi");
    await page.locator("#lastName").fill("Bolina");
    await page.locator("#email").fill(testEmail);
    await page.locator("#password").fill("P@ssword123!");
    await page.locator("#confirmPassword").fill("P@ssword123!");

    // Main trigger button should unlock automatically and switch its layout cursor state
    const submitBtn = page.getByRole("button", { name: "Create account" });
    await expect(submitBtn).toBeEnabled();
    await expect(submitBtn).toHaveCSS("cursor", "pointer");
    
    await submitBtn.click();

    // Verify system intercepts successful response parameters and invokes redirection routing
    await expect(page).toHaveURL(/\/login$/);
  });


  /* ==========================================
     2. LOGIN FORM TEST CASES
     ========================================== */

  test("Login: clicking submit on fresh empty inputs forces all error triggers together", async ({ page }) => {
    await page.goto("http://localhost:3001/login");

    // Attempt form entry bypass without populating inputs
    await page.getByRole("button", { name: "Sign In" }).click();

    // All distinct missing data strings display inline simultaneously
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Please enter your password.")).toBeVisible();
    await expect(page.locator("#email")).toHaveClass(/border-red-500/);
    await expect(page.locator("#password")).toHaveClass(/border-red-500/);
  });

  test("Login: eye icons cleanly manage character masking visibility changes", async ({ page }) => {
    await page.goto("http://localhost:3001/login");
    const passwordInput = page.locator("#password");
    
    await passwordInput.fill("SecureSystemLogic#2026");
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Tap native icon toggle overlay element container
    const eyeBtn = page.getByRole("button", { name: "Show password" });
    await eyeBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Click alternative masked variant step block to seal input details back down
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  // 🟢 NEW ADDED CUSTOMER LOGIN HAPPY PATH TEST CASE
  test("Login: valid authentication credentials route user to home page catalog", async ({ page }) => {
    await page.goto("http://localhost:3001/login");

    // Seed data corresponding to an active customer account in your mock DB/environment
    await page.locator("#email").fill("alicekingsley@gmail.com");
    await page.locator("#password").fill("P@ssword123!");

    // Execute submission trigger
    await page.getByRole("button", { name: "Sign In" }).click();

    // 🟢 Verifies that the app satisfies the project core functionality redirection successfully
    await expect(page).toHaveURL("http://localhost:3001/");
  });

  // 🔴 UNHAPPY PATH: Verifies UI displays backend authorization failures
  test("Login: entering incorrect credentials displays localized error banner", async ({ page }) => {
    // Mock a 401 Unauthorized database failure from your backend API
    await page.route("**/api/auth", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid email or password" }),
      });
    });

    await page.goto("http://localhost:3001/login");
    await page.locator("#email").fill("wrong-user@westernsydney.edu.au");
    await page.locator("#password").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Verify the UI safely traps the backend error message and displays it to the user
    await expect(page.getByText("Invalid email or password")).toBeVisible();
    await expect(page).toHaveURL("http://localhost:3001/login"); // Ensures no redirection occurs
  });
});