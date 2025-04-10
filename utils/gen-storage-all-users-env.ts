import { chromium } from "@playwright/test";
import { users } from "./test-data";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment
const envName = process.env.ENV || "demo";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${envName}`) });

const BASE_URL = process.env.UI_BASE_URL!;
const OUTPUT_DIR = path.resolve(`storage-state/${envName}`);

// Calculate session expiration (1 year from now in seconds)
const oneYearFromNow = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

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

      const state = await context.storageState();

      // 🔧 Override expiration for all cookies to 1 year from now
      for (const cookie of state.cookies) {
        cookie.expires = oneYearFromNow;
      }

      const filePath = path.join(OUTPUT_DIR, `${user.username}.json`);
      fs.writeFileSync(filePath, JSON.stringify(state, null, 2));

      console.log(`✅ Session saved: ${filePath}`);
    } catch (e) {
      console.warn(`⚠️ Login failed for ${user.username}`);
    }

    await context.close();
  }

  await browser.close();
})();
