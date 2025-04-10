import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {
  async addItemToCart(itemName: string) {
    await this.page
      .locator(".inventory_item")
      .filter({ hasText: itemName })
      .locator("button")
      .click();
  }

  async goToCart() {
    await this.page.click(".shopping_cart_link");
  }
}
