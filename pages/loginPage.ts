// ===========================
// pages/LoginPage.ts
// ===========================

import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { userConfig, UserType } from "../utils/test-data";

export class LoginPage extends BasePage {
  private usernameInput = this.page.locator("#user-name");
  private passwordInput = this.page.locator("#password");
  private loginButton = this.page.locator("#login-button");
  private errorMessage = this.page.locator("[data-test='error']");

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async loginExpectSuccess(username: string, password: string) {
    await this.login(username, password);
    await this.assertLoginSuccess();
  }

  async loginFromUserConfig(userType: UserType, expectSuccess = true) {
    const { username, password } = userConfig[userType];
    if (expectSuccess) {
      await this.loginExpectSuccess(username, password);
    } else {
      await this.login(username, password);
    }
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.page.locator(".inventory_list")).toBeVisible();
  }

  async assertLoginFailure(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }
  //   async getErrorMessage() {
  //     return this.page.textContent(this.errorMessage);
  //   }
}
