// tests/e2e/e2e-user-checkout-scenarios.spec.ts
import { test, expect } from "@playwright/test";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { scenarioConfig, productConfig } from "../../utils/test-data-driven";

/**
 * Data-driven E2E checkout flow using UserScenario[] and storageState for login reuse
 */
const env = process.env.ENV_NAME || "demo";

for (let i = 0; i < scenarioConfig.length; i++) {
  const scenario = scenarioConfig[i];
  const sessionFile = `storage-state/${env}/${scenario.user.username}.json`;

  test.use({ storageState: sessionFile });

  test(`${i + 1}: ${scenario.scenarioName}`, async ({ page }) => {
    console.log(`🧪 Running: ${scenario.scenarioName}`);
    console.log(`🔐 Using session: ${sessionFile}`);

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Access inventory page (should be logged in via session)
    await page.goto("/inventory.html");
    await expect(page.locator(".inventory_list")).toBeVisible();

    // Step 2: Add items to cart
    for (const itemId of scenario.cartItems) {
      await inventoryPage.addItemToCartById(itemId);
    }

    // Step 3: Navigate to cart and verify
    await inventoryPage.goToCart();
    for (const itemId of scenario.cartItems) {
      await cartPage.verifyProductInCart(productConfig[itemId]);
    }

    // Step 4: Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(
      scenario.payment.firstName,
      scenario.payment.lastName,
      scenario.payment.postalCode
    );

    if (scenario.expectedOutcome === "success") {
      await checkoutPage.verifyItemTotal(
        scenario.cartItems.map((id) => productConfig[id])
      );
      await checkoutPage.verifyTax();
      await checkoutPage.verifyTotalAmount();
      await checkoutPage.finishCheckout();
      const confirmation = await checkoutPage.getConfirmationMessage();
      expect(confirmation).toContain("Thank you for your order!");
      console.log("✅ Checkout completed successfully");
    } else {
      const error = await checkoutPage.getErrorMessage();
      expect(error).toContain("Error");
      console.log("❌ Checkout failed as expected");
    }
  });
}
