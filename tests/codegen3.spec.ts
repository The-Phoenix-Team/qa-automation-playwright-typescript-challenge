import { test, expect } from "@playwright/test";

test("Quick codegen to see item add or remove process", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="username"]').press("Tab");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page
    .locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
    .click();
  await page
    .locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
    .click();
  await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
  await page
    .locator(
      '[data-test="add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]'
    )
    .click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
  await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="remove-sauce-labs-onesie"]').click();
  await page
    .locator('[data-test="inventory-list"] div')
    .filter({ hasText: "Sauce Labs OnesieRib snap" })
    .nth(1)
    .click();
  await page
    .locator('[data-test="remove-test\\.allthethings\\(\\)-t-shirt-\\(red\\)"]')
    .click();
  await page.getByRole("button", { name: "Open Menu" }).click();
  await page.locator('[data-test="inventory-sidebar-link"]').click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
});

// another flow to add remove items
test(" another flow to add remove items", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="username"]').press("Tab");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  await page
    .locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
    .click();
  await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText(
    "1"
  );
  await page
    .locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
    .click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill("John");
  await page.locator('[data-test="firstName"]').press("Tab");
  await page.locator('[data-test="lastName"]').fill("Doe");
  await page.locator('[data-test="lastName"]').press("Tab");
  await page.locator('[data-test="postalCode"]').fill("12345");
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="back-to-products"]').click();
  await page.getByText("Name (A to Z)Name (A to Z)").click();
  await page.locator('[data-test="product-sort-container"]').selectOption("za");
  await page.getByText("Name (Z to A)Name (A to Z)").click();
  await page
    .locator('[data-test="product-sort-container"]')
    .selectOption("hilo");
  await page.getByText("Price (high to low)Name (A to").click();
  await page.locator('[data-test="product-sort-container"]').selectOption("az");
  await page.getByRole("button", { name: "Open Menu" }).click();
  await page.locator('[data-test="inventory-sidebar-link"]').click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
});
