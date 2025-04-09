import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const base_url = process.env.UI_BASE_URL || "https://www.saucedemo.com";
export const username = process.env.UI_USER || "standard_user";
export const password = process.env.UI_PASSWORD || "secret_sauce";

export async function reusableLogin(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto(base_url);
  await loginPage.login(username, password);
}
