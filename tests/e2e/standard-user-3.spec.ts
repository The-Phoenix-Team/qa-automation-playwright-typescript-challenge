import { test, expect } from "@playwright/test";

test.use({
  storageState: "storage-state/demo/standard_user.json",
});

test("Standard User - Add to cart and proceed to checkout", async ({
  page,
}) => {
  // Go to inventory with active session
  await page.goto("https://www.saucedemo.com/inventory.html");

  // Add two items
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  // Verify cart count
  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

  // Go to cart
  await page.click(".shopping_cart_link");

  // Click checkout
  await page.click('[data-test="checkout"]');

  // Fill checkout info
  await page.fill('[data-test="firstName"]', "Standard");
  await page.fill('[data-test="lastName"]', "User");
  await page.fill('[data-test="postalCode"]', "12345");

  // Continue to overview
  await page.click('[data-test="continue"]');

  // Validate we're on the overview page
  await expect(page).toHaveURL(/checkout-step-two/);
});
