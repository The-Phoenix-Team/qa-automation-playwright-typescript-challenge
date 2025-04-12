// ✅ pages/CartPage.ts
// Cart Page Object with basic interactions and validations
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ProductType } from "../utils/types";

export class CartPage extends BasePage {
  private checkoutButton = "[data-test='checkout']";
  private cartBadge = '[data-test="shopping-cart-badge"]';
  private continueShoppingButton = '[data-test="continue-shopping"]';

  // Return the cart badge count element
  async getCartItemCount() {
    return this.page.locator(this.cartBadge);
  }

  // Click the continue shopping button to return to inventory
  async continueShopping() {
    await this.page.click(this.continueShoppingButton);
  }

  // Proceed to checkout
  async proceedToCheckout() {
    await this.page.click(this.checkoutButton);
  }

  // Verify a product in cart matches expected data
  async verifyProductInCart(expectedProduct: ProductType) {
    const cartItem = this.page.locator(
      `.cart_item:has-text("${expectedProduct.name}")`
    );
    await cartItem.scrollIntoViewIfNeeded();

    const actualName = await cartItem
      .locator(".inventory_item_name")
      .textContent();
    const actualDesc = await cartItem
      .locator(".inventory_item_desc")
      .textContent();
    const actualPrice = await cartItem
      .locator(".inventory_item_price")
      .textContent();

    expect(actualName?.trim()).toBe(expectedProduct.name);
    expect(actualDesc?.trim()).toBe(expectedProduct.description);
    expect(actualPrice?.trim()).toBe(expectedProduct.price);
  }
}
