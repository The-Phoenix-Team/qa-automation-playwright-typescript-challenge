// tests/inventory/inventory-standard-user.spec.ts
import { test, expect } from "../../utils/custom-fixtures";
import { InventoryPage } from "../../pages/inventoryPage";

test.use({ userType: "standard_user" });

test("standard_user: can load inventory, add all items to cart", async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.gotoInventory();
  //await inventoryPage.verifyOnInventoryPage();
  //await inventoryPage.sortBy("za");
  //await inventoryPage.verifyProductDataMatches();
  //Add all items
  await inventoryPage.addToCartById("sauce-labs-backpack");
  await inventoryPage.addToCartById("sauce-labs-bike-light");
  await inventoryPage.addToCartById("sauce-labs-bolt-t-shirt");
  await inventoryPage.addToCartById("sauce-labs-fleece-jacket");
  await inventoryPage.addToCartById("sauce-labs-onesie");
  await inventoryPage.addToCartById("test.allthethings()-t-shirt-(red)");

  // // Check they are in cart
  // expect(await inventoryPage.isInCart("sauce-labs-backpack")).toBe(true);

  // // Remove and check they are not in cart
  // await inventoryPage.removeFromCartById("sauce-labs-bike-light");
  // expect(await inventoryPage.isInCart("sauce-labs-bike-light")).toBe(true);

  // //All are added back
  // await inventoryPage.addToCartById("sauce-labs-bike-light");
});
