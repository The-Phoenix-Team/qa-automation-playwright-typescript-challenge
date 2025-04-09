// tests/login-multiple.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { users } from "../../utils/test-data";

const base_url = process.env.UI_BASE_URL || "https://www.saucedemo.com";

test.describe("Login Scenarios - All User Types", () => {
  users.forEach(({ username, password }) => {
    test(`${username} login attempt`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto(base_url);
      await loginPage.login(username, password);

      if (username === "locked_out_user") {
        const errorMsg = await loginPage.getErrorMessage();
        expect(errorMsg).toContain("Sorry, this user has been locked out.");
      } else {
        await expect(page).toHaveURL(/inventory\.html/);
        // Go to header and click logout
        await page.locator("#react-burger-menu-btn").click();
        await page.locator("#logout_sidebar_link").click();
        // Verify successful logout
        await expect(page).toHaveURL(base_url);
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle("Swag Labs");
      }
    });
  });
});

test.describe("Login Edge Cases", () => {
  test("Empty username and password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(base_url);
    await loginPage.login("", "");
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain("Username is required");
  });

  test("Empty password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(base_url);
    await loginPage.login("standard_user", "");
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain("Password is required");
  });

  test("Invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(base_url);
    await loginPage.login("fake_user", "wrong_pass");
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain("Username and password do not match");
  });
});
