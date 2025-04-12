// ✅ pages/BasePage.ts
// This is the base class inherited by all page objects. It sets up shared utilities.
import { Page, expect } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to a given URL
  async goto(url: string) {
    await this.page.goto(url);
  }

  // Return the current page title
  async getTitle() {
    return this.page.title();
  }

  // Wait until the DOM content is fully loaded
  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }
}
