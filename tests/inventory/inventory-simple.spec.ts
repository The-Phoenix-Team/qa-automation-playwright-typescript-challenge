import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import { CartPage } from "../../pages/cartPage";
import { CheckoutPage } from "../../pages/checkoutPage";
import { InventoryPage } from "../../pages/inventoryPage";
import { reusableLogin } from "../../utils/reusable-login";

test.describe("Inventory page activities", () => {
  test.skip(" To things on inventory", async ({ page }) => {
    // Instantiate Page Objects
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const inventoryPage = new InventoryPage(page);
    const URL = process.env.UI_BASE_URL || "https://www.saucedemo.com";

    // Step 1: Login, vals should come from ENV var
    await reusableLogin(page);
    // Verify successful login
    await expect(page).toHaveURL(/inventory.html/);
    await inventoryPage.sortBy("az");

    console.log("✅ Inventory Page Test Passed!");
  });
  test("Test inventory sort orders and logout", async ({ page }) => {
    // Need to troubleshoot why does not work via methods
    await page.goto("https://www.saucedemo.com/");
    await page.locator('[data-test="username"]').click();
    await page.locator('[data-test="username"]').fill("standard_user");
    await page.locator('[data-test="username"]').press("Tab");
    await page.locator('[data-test="password"]').fill("secret_sauce");
    await page.locator('[data-test="login-button"]').click();
    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("za");
    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("az");
    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("lohi");
    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("hilo");
    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("az");
    await page.getByRole("button", { name: "Open Menu" }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    console.log("✅ Inventory Page Test Passed!");
  });
});
