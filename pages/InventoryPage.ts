// ✅ pages/InventoryPage.ts
// Inventory Page Object to interact with product list and cart actions
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { products } from "../utils/test-data-driven";

export class InventoryPage extends BasePage {
  // Navigate to inventory.html
  async gotoInventory() {
    await this.page.goto("/inventory.html");
  }

  // Add item to cart using ID
  async addItemToCartById(id: string) {
    const btn = this.page.locator(`[data-test="add-to-cart-${id}"]`);
    await expect(btn).toBeVisible();
    await btn.click();
  }

  // Remove item from cart using ID
  async removeItemFromCartById(id: string) {
    const btn = this.page.locator(`[data-test="remove-${id}"]`);
    await expect(btn).toBeVisible();
    await btn.click();
  }

  // Navigate to cart from header
  async goToCart() {
    await this.page.click(".shopping_cart_link");
  }
  // // ✅ Add inside InventoryPage class
  // async verifyOnInventoryPage() {
  //   await expect(this.page).toHaveURL(/\/inventory\.html$/);
  //   await expect(this.page.locator(".inventory_list")).toBeVisible();
  // }

  // Sort is bit difficult
  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    const dropdown = this.page.locator("[data-test='product_sort_container']");
    await dropdown.selectOption(
      {
        az: "az",
        za: "za",
        lohi: "lohi",
        hilo: "hilo",
      }[option]
    );
  }

  // Verify product cards on page match expected data
  async verifyProductDataMatches() {
    const items = this.page.locator(".inventory_item");
    const count = await items.count();
    expect(count).toBe(Object.keys(products).length);

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const name = await item.locator(".inventory_item_name").innerText();
      const desc = await item.locator(".inventory_item_desc").innerText();
      const price = await item.locator(".inventory_item_price").innerText();
      const img = await item
        .locator(".inventory_item_img img")
        .getAttribute("src");

      const expected = Object.values(products).find((p) => p.name === name);
      expect(
        expected,
        `Missing product in expected data: ${name}`
      ).toBeDefined();
      expect(desc).toBe(expected!.description);
      expect(price).toBe(expected!.price);
      expect(img).toContain(expected!.imageSrc);
    }
  }
}
