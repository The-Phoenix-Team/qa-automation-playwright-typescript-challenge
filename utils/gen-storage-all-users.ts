import { chromium } from "@playwright/test";
import { users } from "./test-data";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://www.saucedemo.com/";
const OUTPUT_DIR = path.resolve("storage-state");

(async () => {
  const browser = await chromium.launch();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const user of users) {
    if (user.username === "locked_out_user") {
      console.log(`⏭ Skipping locked_out_user`);
      continue;
    }

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(BASE_URL);

    await page.fill('[data-test="username"]', user.username);
    await page.fill('[data-test="password"]', user.password);
    await page.click('[data-test="login-button"]');

    try {
      await page.waitForURL("**/inventory.html", { timeout: 3000 });
      const filePath = path.join(OUTPUT_DIR, `${user.username}.json`);
      await context.storageState({ path: filePath });
      console.log(`✅ Saved session: ${filePath}`);
    } catch (e) {
      console.warn(`⚠️ Login failed for ${user.username}`);
    }

    await context.close();
  }

  await browser.close();
})();
