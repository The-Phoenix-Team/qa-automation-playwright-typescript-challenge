import { chromium } from "@playwright/test";
import { users } from "../utils/test-data";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment
const envName = process.env.ENV_NAME || "demo";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${envName}`) });

const BASE_URL = process.env.UI_BASE_URL!;
const OUTPUT_DIR = path.resolve(`storage-state/${envName}`);

// 1 year from now in seconds
const oneYearFromNow = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

// Threshold to re-generate if cookie will expire in less than 1 day
const refreshThreshold = 24 * 60 * 60; // 1 day

// 🔍 Check if a file exists and cookies are still valid
function isStorageStateFresh(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;

  try {
    const state = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const now = Math.floor(Date.now() / 1000);

    for (const cookie of state.cookies || []) {
      if (cookie.expires && cookie.expires < now + refreshThreshold) {
        console.log(`♻️ Cookie expiring soon for ${filePath}, refreshing...`);
        return false;
      }
    }
    console.log(`✅ Fresh session found: ${filePath}`);
    return true;
  } catch {
    return false;
  }
}

(async () => {
  const browser = await chromium.launch();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const user of users) {
    const filePath = path.join(OUTPUT_DIR, `${user.username}.json`);

    if (user.username === "locked_out_user") {
      console.log(`⏭ Skipping locked_out_user`);
      continue;
    }

    if (isStorageStateFresh(filePath)) {
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

      // Set cookie expiry to 1 year from now
      for (const cookie of state.cookies) {
        cookie.expires = oneYearFromNow;
      }

      fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
      console.log(`💾 Session saved: ${filePath}`);
    } catch (e) {
      console.warn(`⚠️ Login failed for ${user.username}`);
    }

    await context.close();
  }

  await browser.close();
})();
