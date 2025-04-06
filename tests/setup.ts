import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

// Making Login Reusable

export const test = base.extend<{ loginPage: LoginPage }>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto("https://www.saucedemo.com");
        await loginPage.login("standard_user", "secret_sauce");
        await use(loginPage);
    },
});
