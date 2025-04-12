// tests/login/login-positive-negative-edge.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test.describe("🔐 Login Tests - Standard Login Flow", () => {
  const baseURL = process.env.UI_BASE_URL || "https://www.saucedemo.com";

  test("✅ Positive: Login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(baseURL);
    await loginPage.login("standard_user", "secret_sauce");

    // Expect redirect to inventory page
    await expect(page).toHaveURL(/inventory/);
    console.log("✅ Successfully logged in with valid credentials");
  });

  test("❌ Negative: Login with invalid password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(baseURL);
    await loginPage.login("standard_user", "wrong_password");

    const error = await loginPage.getErrorMessage();
    console.log("⚠️  Error Message Displayed:", error);
    expect(error).toContain("Username and password do not match");
  });

  test("⚠️ Edge Case: Login with blank username and password", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await page.goto(baseURL);
    await loginPage.login("", "");

    const error = await loginPage.getErrorMessage();
    console.log("🧪 Edge Case Error:", error);
    expect(error).toContain("Username is required");
  });
});
