// tests/login/login-storage-positive-negative-edge.spec.ts
import { test, expect } from "../../utils/custom-fixtures-data-driven";
import { LoginPage } from "../../pages/LoginPage";

// This test file runs login scenarios using the data-driven fixture

for (let i = 0; i < 3; i++) {
  test(`${i}: Login - Scenario`, async ({ page, scenario }) => {
    console.log(`🔍 Running Login Test for: ${scenario.scenarioName}`);
    const loginPage = new LoginPage(page);
    await page.goto("/");
    await loginPage.login(scenario.user.username, scenario.user.password);

    if (scenario.expectedOutcome === "success") {
      await loginPage.assertLoginSuccess();
    } else {
      await loginPage.assertLoginFailure();
    }
  });
}
