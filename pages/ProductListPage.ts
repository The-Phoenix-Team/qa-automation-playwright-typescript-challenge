import { BasePage } from "./BasePage";
import { expectedProducts } from "../utils/test-data";

export class ProductListPage extends BasePage {
  private getProductIdByName(productName: string): string {
    const product = expectedProducts.find((p) => p.name === productName);
    if (!product) {
      throw new Error(`❌ Product not found: ${productName}`);
    }
    return product.id;
  }

  async addItem(productName: string) {
    const id = this.getProductIdByName(productName);
    await this.page.locator(`[data-test="add-to-cart-${id}"]`).click();
  }

  async removeItem(productName: string) {
    const id = this.getProductIdByName(productName);
    await this.page.locator(`[data-test="remove-${id}"]`).click();
  }

  async goToCart() {
    await this.page.click(".shopping_cart_link");
  }
}
