import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { expectedProducts } from "../utils/test-data";

export class InventoryPage extends BasePage {
  async gotoInventory() {
    await this.page.goto("/inventory.html");
  }

  async verifyOnInventoryPage() {
    //await this.page.expectURL('/inventory.html');
    await expect(this.page.locator(".inventory_list")).toBeVisible();
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    const sortMap = {
      az: "Name (A to Z)",
      za: "Name (Z to A)",
      lohi: "Price (low to high)",
      hilo: "Price (high to low)",
    };
    await this.page
      .locator('[data-test="product_sort_container"]')
      .selectOption({ label: sortMap[option] });
  }

  async verifyProductDataMatches() {
    const items = this.page.locator(".inventory_item");
    const count = await items.count();
    expect(count).toBe(expectedProducts.length);

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const name = await item.locator(".inventory_item_name").innerText();
      const desc = await item.locator(".inventory_item_desc").innerText();
      const price = await item.locator(".inventory_item_price").innerText();
      const img = await item
        .locator(".inventory_item_img img")
        .getAttribute("src");

      const expected = expectedProducts.find((p) => p.name === name);
      expect(
        expected,
        `Missing product in expected data: ${name}`
      ).toBeDefined();
      expect(desc).toBe(expected!.description);
      expect(price).toBe(expected!.price);
      expect(img).toContain(expected!.image);
    }
  }

  async addToCartById(id: string) {
    const addBtn = this.page.locator(`[data-test="add-to-cart-${id}"]`);
    await expect(addBtn).toBeVisible();
    await addBtn.click();
  }

  async removeFromCartById(id: string) {
    const removeBtn = this.page.locator(`[data-test="remove-${id}"]`);
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
  }

  async isInCart(id: string): Promise<boolean> {
    return this.page.locator(`[data-test="remove-${id}"]`).isVisible();
  }

  async verifySortingWorksCorrectly(type: "az" | "za" | "lohi" | "hilo") {
    const products = this.page.locator(".inventory_item");
    const count = await products.count();

    const items: { name: string; price: number }[] = [];

    for (let i = 0; i < count; i++) {
      const item = products.nth(i);
      const name = await item.locator(".inventory_item_name").innerText();
      const priceText = await item.locator(".inventory_item_price").innerText();
      const price = parseFloat(priceText.replace("$", ""));
      items.push({
        name: name,
        price: price,
      });
    }

    let sorted: unknown;
    switch (type) {
      case "az":
        sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        sorted = [...items].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "lohi":
        sorted = [...items].sort((a, b) => a.price - b.price);
        break;
      case "hilo":
        sorted = [...items].sort((a, b) => b.price - a.price);
        break;
    }

    expect(items).toEqual(sorted);
  }
}
