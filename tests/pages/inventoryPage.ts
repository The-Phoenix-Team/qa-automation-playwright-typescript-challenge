import { Locator, Page, Expect, expect } from "@playwright/test";

export class Inventory {

    readonly page: Page;
    readonly inventoryList: Locator;
    readonly addToCart: Locator;
    readonly removeFromCart: Locator;
    readonly shoppingCart: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page){
        this.page = page;
        this.inventoryList = page.getByRole('listitem')
        this.addToCart = page.getByRole('button', {name: 'Add to cart'});
        this.removeFromCart = page.getByRole('button', {name: 'Remove'});
        this.shoppingCart = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = this.shoppingCart.locator('[data-test="shopping-cart-badge"]');
    }

    async addItemToCart(itemIndex: number){
        await this.addToCart.locator(`nth=${itemIndex}`).click();
    }

    async removeItemFromCart(itemIndex: number){
        await this.removeFromCart.locator(`nth=${itemIndex}`).click();
    }

    async verifyShoppingCart(expectedItemCount: number){
        await expect(this.cartBadge).toHaveText(expectedItemCount.toString(), {
            timeout: 5000
        })
    }

    async selectShoppingCart(){
        await this.shoppingCart.click();
    }
}