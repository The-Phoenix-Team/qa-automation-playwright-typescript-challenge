import { test, expect } from "@playwright/test";
/*
✅ Use storageState for standard_user
✅ Add 2 items to the cart
✅ Verify cart icon shows correct item count
*/
test.use({
  storageState: "storage-state/demo/standard_user.json",
});

test("Standard User - Add 2 items to cart and verify count", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/inventory.html");

  // ✅ Add first item
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // ✅ Add second item
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  // ✅ Assert cart badge shows 2
  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");
});
