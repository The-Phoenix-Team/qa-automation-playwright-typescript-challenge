//pages/LoginPage.ts
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { userConfig } from "../utils/test-data-driven";
import { UserType } from "../utils/types";

/**
 * Page Object for the SauceDemo Login Page.
 * Encapsulates login logic, error handling, and role-based login.
 */
export class LoginPage extends BasePage {
  // Define locators using inherited `this.page`
  private usernameInput = this.page.locator("#user-name");
  private passwordInput = this.page.locator("#password");
  private loginButton = this.page.locator("#login-button");
  private errorMessage = this.page.locator("[data-test='error']");
  private menuButton = this.page.locator("#react-burger-menu-btn");
  private logoutButton = this.page.locator("#logout_sidebar_link");

  /**
   * Basic login with provided credentials.
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Login and assert it was successful.
   */
  async loginExpectSuccess(username: string, password: string) {
    await this.login(username, password);
    await this.assertLoginSuccess();
    console.log("✅ Logged in as:", username);
  }

  /**
   * Login based on predefined user config.
   */
  async loginFromUserConfig(
    userKey: keyof typeof userConfig,
    expectSuccess = true
  ) {
    const { username, password } = userConfig[userKey];
    if (expectSuccess) {
      await this.loginExpectSuccess(username, password);
    } else {
      await this.login(username, password);
    }
  }

  /**
   * Validates successful login via URL and inventory presence.
   */
  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.page.locator(".inventory_list")).toBeVisible();
  }

  /**
   * Validates visible error message (optionally exact match).
   */
  async assertLoginFailure(expectedMessage?: string) {
    //await expect(this.errorMessage).toBeVisible();
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  /**
   * Returns error message text content (if available).
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Logs out from the application using the menu button.
   */
  async logout() {
    await this.menuButton.click();
    await this.logoutButton.waitFor({ state: "visible" });
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/\/$/);
    console.log("🚪 Logged out successfully");
  }
}
