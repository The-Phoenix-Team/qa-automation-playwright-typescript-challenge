import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { InventoryPage } from "../../pages/InventoryPage";

const username = process.env.STANDARD_USER;
const password = process.env.STANDARD_PASSWORD;

//This needs work
test.describe("E2E - Can add and remove items from cart", () => {
  test.skip("Purchase 3 items", async ({ page }) => {
    // Instantiate Page Objects
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const inventoryPage = new InventoryPage(page);

    // Step 1: Login
    const base_url = process.env.UI_BASE_URL || "https://www.saucedemo.com";
    const env = process.env.ENV_NAME || "demo";
    await page.goto(base_url);
    await loginPage.goto(base_url);
    await loginPage.login("standard_user", "secret_sauce");

    await page.goto("/inventory.html");
    // Verify successful login
    await expect(page).toHaveURL(/inventory.html/);

    // Step 2: Add 2 items to cart, remove them and add  3 again
    await inventoryPage.addItemToCartById("sauce-labs-backpack");
    await inventoryPage.addItemToCartById("sauce-labs-bike-light");
    await inventoryPage.removeItemFromCartById("remove-sauce-labs-backpack");
    await inventoryPage.removeItemFromCartById("remove-sauce-labs-bike-light");
    await inventoryPage.addItemToCartById("sauce-labs-backpack");
    await inventoryPage.addItemToCartById("sauce-labs-bike-light");
    await inventoryPage.addItemToCartById("sauce-labs-fleece-jacket");

    // Verify item count is correct
    await expect(await cartPage.getCartItemCount()).toContainText("3");

    // Step 3: Proceed to checkout
    cartPage.proceedToCheckout;

    // Step 4: Fill in checkout details
    checkoutPage.fillCheckoutForm;

    // Step 5: Complete purchase
    await checkoutPage.finishCheckout();

    // Verify order confirmation message
    const confirmation = await checkoutPage.getConfirmationMessage();
    expect(confirmation).toContain("Thank you for your order!");
    console.log("✅ E2E Purchase 2 Items Test Passed!");
  });
});
