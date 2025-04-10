import { test, expect } from "@playwright/test";

/*
✅ Add two items
✅ Proceed to cart
✅ Fill in checkout info
✅ Continue to overview
✅ Click “Finish”
✅ Validate “Thank you for your order!” confirmation message
*/

test.use({
  storageState: "storage-state/demo/standard_user.json",
});

test("Standard User - Full checkout flow", async ({ page }) => {
  // Go to inventory page with session
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

  // Click Finish
  await page.click('[data-test="finish"]');

  // ✅ Assert confirmation
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!"
  );
});
