import { chromium } from "@playwright/test";
import * as fs from "fs";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.saucedemo.com/");
  await page.fill('[data-test="username"]', "standard_user");
  await page.fill('[data-test="password"]', "secret_sauce");
  await page.click('[data-test="login-button"]');
  await page.waitForURL("**/inventory.html");

  await context.storageState({ path: "storage-state/standard_user.json" });
  await browser.close();

  console.log("✅ Saved session state for standard_user");
})();
