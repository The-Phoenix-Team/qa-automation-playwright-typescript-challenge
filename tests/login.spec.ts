import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

/*
All possible login scenarios should be checked
Ideally we should read data from files like utils/test-data.ts
to reflect different login scenario
*/
export const base_url = process.env.UI_BASE_URL || "https://www.saucedemo.com";
export const username = process.env.UI_USERNAME || "standard_user";
export const password = process.env.UI_PASSWORD || "secret_sauce";

// Step 1: Login, vals should come from ENV var

test.describe("Different login tests ", () => {
  test("successful log in test", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(base_url);
    await loginPage.login(username, password);
    // Verify successful login
    await expect(page).toHaveURL(/inventory.html/);
  });

  test("locked-out user unsuccessful login test", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(base_url);
    await loginPage.login("locked_out_user", "secret_sauce"); //Better to read from test-data.ts file

    // Check if the error message is visible
    const errorMessage = await page.locator(".error-message-container"); // This is based on the CSS class name for the error container
    await expect(errorMessage).toBeVisible();

    // Verify that the error message text matches the expected one
    await expect(errorMessage).toHaveText(
      "Epic sadface: Sorry, this user has been locked out."
    );
  });
});
