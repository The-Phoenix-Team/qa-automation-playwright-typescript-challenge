import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { ProductsPage } from "../pages/productsPage";
import { CartPage } from "../pages/cartPage";
import { CheckoutPage } from "../pages/checkoutPage";
import { reusableLogin } from "../utils/reusable-login";

//This needs work
test.describe("E2E - Can add and remove items from cart", () => {
  test("Purchase 3 items", async ({ page }) => {
    // Instantiate Page Objects
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Login
    await reusableLogin(page);

    // Verify successful login
    await expect(page).toHaveURL(/inventory.html/);

    // Step 2: Add 2 items to cart, remove them and add them again
    await productsPage.addItemToCartByName("backpack");
    await productsPage.addItemToCartByName("bike-light");
    await productsPage.removeItemFromCartByName("remove-backpack");
    await productsPage.removeItemFromCartByName("remove-bike-light");
    await productsPage.addItemToCartByName("backpack");
    await productsPage.addItemToCartByName("bike-light");
    await productsPage.addItemToCartByName("bolt-t-shirt");

    await productsPage.goToCart();

    // Verify item count is correct
    await expect(await cartPage.getCartItemCount()).toContainText("3");

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

    console.log("✅ E2E Purchase 2 Items Test Passed!");
  });
});
