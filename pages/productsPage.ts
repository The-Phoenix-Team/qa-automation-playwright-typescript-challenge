import { BasePage } from "./basePage";
import { itemLocators } from "../utils/products-data";
import { removeItemLocators } from "../utils/products-data";

export class ProductsPage extends BasePage {
  private addToCartButton = ".inventory_item button";
  private cartIcon = ".shopping_cart_link";

  // Method to add the first item to the cart
  async addFirstItemToCart() {
    await this.page.click(this.addToCartButton);
  }

  // Method to remove an item by name
  async addItemToCartByName(itemKey: string) {
    const locator = itemLocators[itemKey];
    if (!locator) {
      throw new Error(`No locator found for item key: ${itemKey}`);
    }

    await this.page.locator(locator).click();
  }

  // Method to remove an item by name

  async removeItemFromCartByName(itemKey: string) {
    const locator = removeItemLocators[itemKey];
    if (!locator) {
      throw new Error(`No locator found for item key: ${itemKey}`);
    }

    await this.page.locator(locator).click();
  }

  async goToCart() {
    await this.page.click(this.cartIcon);
  }
}
