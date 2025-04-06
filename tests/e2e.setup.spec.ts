import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { ProductsPage } from "../pages/productsPage";
import { CartPage } from "../pages/cartPage";
import { CheckoutPage } from "../pages/checkoutPage";
import { reusableLogin } from "../utils/reusable-login";

test.describe("E2E - User can purchase 1 item", () => {
  test("1 item", async ({ page }) => {
    // Instantiate Page Objects
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Login, vals should come from ENV var
    await reusableLogin(page);
    // Verify successful login
    await expect(page).toHaveURL(/inventory.html/);

    // Step 2: Add 1 item by name to cart
    await productsPage.addItemToCartByName("backpack");
    await productsPage.goToCart();

    // Verify item count is correct
    await expect(await cartPage.getCartItemCount()).toContainText("1");

    // Step 3: Proceed to checkout
    await cartPage.clickCheckout();

    // Step 4: Fill in checkout details
    await checkoutPage.fillCheckoutDetails("John", "Doe", "12345");

    // Step 5: Complete purchase
    await checkoutPage.finishCheckout();

    // Verify order confirmation message
    await expect(checkoutPage.getOrderConfirmation()).toHaveText(
      "Thank you for your order!"
    );

    console.log("✅ E2E Purchase 1 Item Test Passed!");
  });
});
