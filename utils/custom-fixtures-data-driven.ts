// custom-fixtures-data-driven.ts
import { test as base } from "@playwright/test";
import { UserScenario } from "./types";
import { scenarios } from "./test-data-driven";

type TestFixtures = {
  scenario: UserScenario;
};

export const test = base.extend<TestFixtures>({
  scenario: async ({}, use, testInfo) => {
    const index = parseInt(testInfo.title.match(/\d+/)?.[0] || "0");
    const scenario = scenarios[index];
    testInfo.project.use = {
      storageState: `storage/${scenario.user.username}.json`,
    };
    await use(scenario);
  },
});

export { expect } from "@playwright/test";
