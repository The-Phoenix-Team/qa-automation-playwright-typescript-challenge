import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

test.describe("Just load login page", () => {
  test("Just load login page", async ({ page }) => {
    // Have fun! 🎉
    const loginPage = new LoginPage(page);
    await loginPage.goto("https://www.saucedemo.com");
    //await loginPage.login("standard_user", "secret_sauce");
    //expect(await page.url()).toBe("https://www.saucedemo.com/inventory.html");
    // TEMP: force a fail
    //expect(false).toBeTruthy();
  });
});
