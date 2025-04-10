import { test, expect } from "@playwright/test";

test.use({
  storageState: "storage-state/demo/standard_user.json",
});

test("Standard User - Add, remove, add again and complete checkout", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/inventory.html");

  // ✅ Add 2 items
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  // ✅ Remove 1 item
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  // ✅ Add 2 more different items
  await page
    .locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
    .click();
  await page
    .locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
    .click();

  // ✅ Verify cart count = 3
  await expect(page.locator(".shopping_cart_badge")).toHaveText("3");

  // ✅ Go to cart
  await page.click(".shopping_cart_link");

  // ✅ Proceed to checkout
  await page.click('[data-test="checkout"]');
  await page.fill('[data-test="firstName"]', "Standard");
  await page.fill('[data-test="lastName"]', "User");
  await page.fill('[data-test="postalCode"]', "12345");
  await page.click('[data-test="continue"]');

  // ✅ Finish checkout
  await page.click('[data-test="finish"]');

  // ✅ Confirm order success
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!"
  );
});
