import { Page, expect } from "@playwright/test";
import { test } from "../../utils/custom-fixtures";
import { InventoryPage } from "../../pages/inventoryPage";

test.describe("Multi-user Inventory Tests", () => {
  test.use({ userType: "standard_user" });

  // test("can sort products A-Z", async ({ page }) => {
  //   const inventoryPage = new InventoryPage(page);
  //   await inventoryPage.gotoInventory();
  //   await inventoryPage.verifyOnInventoryPage();
  //   await inventoryPage.sortBy("az");
  // });

  test("standard_user: can sort products A-Z", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.gotoInventory(); // calls /inventory.html
    await inventoryPage.verifyOnInventoryPage(); // checks .inventory_list
    await inventoryPage.sortBy("az"); // finally works ✅

    const firstProduct = page.locator(".inventory_item_name").first();
    expect(firstProduct).toContainText("Sauce Labs Backpack");
    //await expect(firstProduct).toBeVisible();
  });

  test.use({ userType: "performance_glitch_user" });
  test("performance_glitch_user: can sort inventory slower by Z-A", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.gotoInventory();
    await inventoryPage.verifyOnInventoryPage();
    await inventoryPage.sortBy("za");

    // Optional: check first item is the one you'd expect when sorted Z-A
    const firstProduct = page.locator(".inventory_item_name").first();
    expect(firstProduct).toContainText("Test.allTheThings() T-Shirt (Red)");
  });
});

test.use({ userType: "problem_user" });
test("problem_user: should fail product validation due to bad data", async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.gotoInventory();
  await inventoryPage.verifyOnInventoryPage();
  await inventoryPage.sortBy("az");

  // Expect product data to mismatch
  await expect(async () => {
    await inventoryPage.verifyProductDataMatches();
  }).rejects.toThrow();
});

test.use({ userType: "performance_glitch_user" });
test("performance_glitch_user: should load inventory but slower", async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.gotoInventory();
  await inventoryPage.verifyOnInventoryPage();

  // Optional: measure time manually
  const t0 = Date.now();
  await inventoryPage.sortBy("az");
  const t1 = Date.now();
  console.log(`Sort time: ${t1 - t0}ms`);

  //Still expect correct structure
  await expect(page.locator(".inventory_item")).toHaveCount(6);
});
