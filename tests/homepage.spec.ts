import { test, expect } from "@playwright/test";

export const base_url = process.env.UI_BASE_URL || "https://www.saucedemo.com";
test("To test homepage is loading and has title", async ({ page }) => {
  await page.goto(base_url);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Swag Labs");
});
