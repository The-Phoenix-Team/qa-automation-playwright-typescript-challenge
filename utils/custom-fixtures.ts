// utils/custom-fixtures.ts
import { test as base, Page } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

//type UserType = "standard_user";
type UserType =
  | "standard_user"
  | "error_user"
  | "performance_glitch_user"
  | "problem_user";

const ENV = process.env.ENV_NAME || "demo";

export const test = base.extend<{
  userType: UserType;
  page: Page;
}>({
  userType: ["standard_user", { option: true }],

  page: async ({ browser, userType }, use) => {
    const context = await browser.newContext({
      storageState: `storage-state/${ENV}/${userType}.json`,
    });
    const page = await context.newPage();
    await use(page);
  },
});

export { expect } from "@playwright/test";
