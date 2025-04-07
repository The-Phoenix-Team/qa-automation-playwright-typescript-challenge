import { chromium } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

async function globalSetup() {
  console.log("Starting global setup...");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    // OPTIONAL: This could be helpful for creating test users and/or other initial data to be referenced
    // locally during tests. The usefulness may be greatly reduced for this QA coding challenge, yet
    // it's here as a starter if it can help.
    // For login re-use we can also use, not implemented yet
    // await page.goto(process.env.BASE_URL!);
    // await page.fill('[data-test="username"]', process.env.USERNAME!);
    // await page.fill('[data-test="password"]', process.env.PASSWORD!);
    // await page.click('[data-test="login-button"]');
    // await page.context().storageState({ path: "auth.json" }); // add auth.json in project root folder
  } catch (error) {
    console.error("Error in global setup:", error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
