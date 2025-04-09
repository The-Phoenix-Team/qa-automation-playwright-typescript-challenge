import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

// One way to make Login Reusable, chnage to read from ENV vars

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto("https://www.saucedemo.com");
    await loginPage.login("standard_user", "secret_sauce");
    await use(loginPage);
  },
});
