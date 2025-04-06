import { test, expect } from "@playwright/test";

test("Long test with codegen to check workflow and element locator", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText(
    "3"
  );
  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText(
    "2"
  );
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="continue-shopping"]').click();
  await page
    .locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
    .click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill("Saif");
  await page.locator('[data-test="firstName"]').press("Tab");
  await page.locator('[data-test="lastName"]').fill("Sharif");
  await page.locator('[data-test="lastName"]').press("Tab");
  await page.locator('[data-test="postalCode"]').fill("80017");
  await page.locator('[data-test="cancel"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill("John");
  await page.locator('[data-test="firstName"]').press("Tab");
  await page.locator('[data-test="lastName"]').fill("Doe");
  await page.locator('[data-test="lastName"]').press("Tab");
  await page.locator('[data-test="postalCode"]').fill("12345");
  await page.locator('[data-test="continue"]').click();
  await expect(page.locator('[data-test="title"]')).toContainText(
    "Checkout: Overview"
  );
  await expect(
    page.locator(
      '[data-test="item-4-title-link"] [data-test="inventory-item-name"]'
    )
  ).toContainText("Sauce Labs Backpack");
  await page.getByText("carry.allTheThings() with the").click();
  await page.getByText("carry.allTheThings() with the").click();
  await expect(page.locator('[data-test="cart-list"]')).toContainText("$29.99");
  await expect(page.locator('[data-test="cart-list"]')).toContainText(
    "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection."
  );
  await expect(page.locator('[data-test="payment-info-label"]')).toContainText(
    "Payment Information:"
  );
  await expect(page.locator('[data-test="payment-info-value"]')).toContainText(
    "SauceCard #31337"
  );
  await expect(page.locator('[data-test="shipping-info-label"]')).toContainText(
    "Shipping Information:"
  );
  await expect(page.locator('[data-test="shipping-info-value"]')).toContainText(
    "Free Pony Express Delivery!"
  );
  await expect(page.locator('[data-test="total-info-label"]')).toContainText(
    "Price Total"
  );
  await expect(page.locator('[data-test="subtotal-label"]')).toContainText(
    "Item total: $87.97"
  );
  await expect(page.locator('[data-test="tax-label"]')).toContainText(
    "Tax: $7.04"
  );
  await expect(page.locator('[data-test="total-label"]')).toContainText(
    "Total: $95.01"
  );
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="pony-express"]').click();
  await expect(page.locator('[data-test="complete-header"]')).toContainText(
    "Thank you for your order!"
  );
  await expect(page.locator('[data-test="complete-text"]')).toContainText(
    "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
  );
  await expect(page.locator('[data-test="secondary-header"]')).toContainText(
    "Checkout: Complete!"
  );
  await expect(page.locator('[data-test="back-to-products"]')).toContainText(
    "Back Home"
  );
  await page.locator('[data-test="back-to-products"]').click();
  await page.getByRole("button", { name: "Open Menu" }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page.locator('[data-test="login-button"]')).toContainText(
    "Login"
  );
});
