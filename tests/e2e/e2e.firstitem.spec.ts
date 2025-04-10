import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { reusableLogin } from "../../utils/reusable-login";

test.describe("E2E - User can purchase 1st item", () => {
  test.use({
    storageState: "storage-state/demo/standard_user.json",
  });
  test("purchase 1st item", async ({ page }) => {
    // Instantiate Page Objects
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    // const URL = process.env.UI_BASE_URL || "https://www.saucedemo.com";
    // const USER = process.env.UI_USER || "standard_user";
    // const PASSWORD = process.env.UI_PASSWORD || "secret_sauce";

    // Step 1: Login

    // await reusableLogin(page);

    // Verify successful login
    // await expect(page).toHaveURL(/inventory.html/);

    // Step 2: Add first item or just 1 item to cart
    await page.goto("https://www.saucedemo.com/inventory.html");
    await productsPage.addFirstItemToCart(); // This is just a quick way to see

    //await productsPage.addItemToCartByName("backpack"); // Ideally we should use this type of method

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

    // Go back home
    await expect(checkoutPage.getBackHomeButton()).toBeVisible();
    checkoutPage.clickBackHome();
    await expect(page).toHaveURL(/inventory.html/);

    // Logout
    //checkoutPage.logout(); does not work
    //await page.locator("#react-burger-menu-btn").click(); // works

    console.log("✅ E2E Purchase 1st Item Test Passed!");
  });
});
