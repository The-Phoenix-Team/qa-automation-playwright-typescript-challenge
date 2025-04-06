import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

/*
All possible login scenarios should be checked
Ideally we should read data from files like utils/test-data.ts
to reflect different login scenario
*/

test.describe("Different login tests ", () => {
  test("successful log in test", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto("https://www.saucedemo.com");
    await loginPage.login("standard_user", "secret_sauce");
    expect(page.url()).toBe("https://www.saucedemo.com/inventory.html");
  });

  test("locked-out user unsuccessful login test", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto("https://www.saucedemo.com");
    await loginPage.login("locked_out_user", "secret_sauce");

    // Check if the error message is visible
    const errorMessage = await page.locator(".error-message-container"); // This is based on the CSS class name for the error container
    await expect(errorMessage).toBeVisible();

    // Verify that the error message text matches the expected one
    await expect(errorMessage).toHaveText(
      "Epic sadface: Sorry, this user has been locked out."
    );
  });
});
