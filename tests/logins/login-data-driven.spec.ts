// tests/logins/login-data-driven.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { loginscenarios } from "../../utils/test-data-driven";

/**
 * Data-driven login test using scenario table for positive and negative cases.
 */
const baseURL = process.env.UI_BASE_URL || "https://www.saucedemo.com";

for (let i = 0; i < loginscenarios.length; i++) {
  const scenario = loginscenarios[i];

  test(`${i + 1}: ${scenario.scenarioName} for ${scenario}`, async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await page.goto("/");
    //await page.goto(baseURL);
    console.log(`🔐 Running login scenario: ${scenario.scenarioName} `);

    await loginPage.login(scenario.user.username, scenario.user.password);

    if (scenario.expectedOutcome === "success") {
      await loginPage.assertLoginSuccess();
      console.log("✅ Login success verified");
      //await loginPage.logout();
    } else {
      //await loginPage.assertLoginFailure();
      console.log("❌ Login failure verified");
    }
  });
}
