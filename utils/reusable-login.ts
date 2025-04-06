import { Page } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

export const URL = process.env.UI_BASE_URL || "https://www.saucedemo.com";
export const USER = process.env.UI_USER || "standard_user";
export const PASSWORD = process.env.UI_PASSWORD || "secret_sauce";

export async function reusableLogin(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto(URL);
  await loginPage.login(USER, PASSWORD);
}
