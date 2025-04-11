import { test as base, Page, BrowserContext } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

type UserType = "standard_user" | "problem_user" | "performance_glitch_user";

const ENV = process.env.ENV_NAME || "demo"; // fallback to demo

export const test = base.extend<{
  userType: UserType;
  page: Page;
  context: BrowserContext;
}>({
  userType: ["standard_user", { option: true }],

  context: async ({ browser, userType }, use) => {
    const context = await browser.newContext({
      storageState: `storage-state/${ENV}/${userType}.json`,
    });
    await use(context);
    // No manual cleanup needed
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },
});
