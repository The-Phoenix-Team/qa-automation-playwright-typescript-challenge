import { Locator, Page, expect } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly itemList: Locator;
    readonly removeButton: Locator;
    readonly continueShopping: Locator;
    readonly checkout: Locator;



    constructor(page: Page){
        this.page = page;
        this.itemList = page.locator('[data-test="inventory-item"]');
        this.removeButton = page.getByRole('button', {name: 'Remove'});
        this.continueShopping = page.getByRole('button', {name: 'Continue Shopping'});
        this.checkout = page.getByRole('button', {name: 'Checkout'});
        
    }

    async selectItem(itemName: string){
        await this.page.getByRole('link', {name: itemName}).click();
    }

    async removeItemFromCart(itemIndex: number){
        await this.removeButton.locator(`nth=${itemIndex}`).click();
    }

    async verifyItemList(expectedItemCount: number){
        await expect(this.itemList).toHaveCount(expectedItemCount);
    }

    async selectContinueShopping(){
        await this.continueShopping.click();
    }

    async selectCheckout(){
        await this.checkout.click();
    }
}