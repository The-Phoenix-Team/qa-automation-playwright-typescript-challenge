import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  private checkoutButton = "[data-test='checkout']";
  private cartBadge = '[data-test="shopping-cart-badge"]';
  private continueShoppingButton = '[data-test="continue-shopping"]'; //on /cart.html page
  //private removeButton = '[data-test="continue-shopping"]'; //on /cart.html page

  async getCartItemCount() {
    return this.page.locator(this.cartBadge);
  }
  async continueShopping() {
    await this.page.click(this.continueShoppingButton);
  }
  async clickCheckout() {
    await this.page.click(this.checkoutButton);
  }
}
