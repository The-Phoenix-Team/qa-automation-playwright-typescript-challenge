// tests/inventory/inventory-standard-user.spec.ts
import { test, expect } from "../../utils/custom-fixtures";
import { InventoryPage } from "../../pages/inventoryPage";

test.use({ userType: "standard_user" });

test("standard_user: can load inventory, add an item to cart", async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.gotoInventory();
  //await inventoryPage.verifyOnInventoryPage();
  //await inventoryPage.sortBy("za");
  //await inventoryPage.verifyProductDataMatches();
  await inventoryPage.addToCartById("sauce-labs-backpack");
  expect(await inventoryPage.isInCart("sauce-labs-backpack")).toBe(true);
});
