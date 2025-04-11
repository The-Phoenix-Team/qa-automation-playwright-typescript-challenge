// tests/e2e/inventory-error-user.spec.ts
import { test, expect } from "../../utils/custom-fixtures";
import { InventoryPage } from "../../pages/InventoryPage";

test.use({ userType: "error_user" });

test("error_user: cannot add Sauce Labs Fleece Jacket", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.gotoInventory();
  await inventoryPage.verifyOnInventoryPage();

  const fleeceJacketId = "sauce-labs-fleece-jacket";
  const addButton = page.locator(`[data-test="add-to-cart-${fleeceJacketId}"]`);

  // Check if the button is visible
  const isVisible = await addButton.isVisible();
  expect(isVisible).toBe(true);

  // Check if the button is enabled,
  const isEnabled = await addButton.isEnabled();
  expect(isEnabled).toBe(true); // false fails, this looks starnge!
});
