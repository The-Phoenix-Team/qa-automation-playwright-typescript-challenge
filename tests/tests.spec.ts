import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const base_url = process.env.UI_BASE_URL || "https://www.saucedemo.com";

test.describe("Just load login page", () => {
  test("Just load login page", async ({ page }) => {
    // Have fun! 🎉
    const loginPage = new LoginPage(page);
    await loginPage.goto(base_url);
  });
});
