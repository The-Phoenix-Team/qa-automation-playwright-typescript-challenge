import { test, expect } from "@playwright/test";

test.use({
  storageState: "storage-state/standard_user.json",
});

test("Standard User - Load inventory directly via session", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  await expect(page.locator(".inventory_item")).toHaveCount(6);
});
