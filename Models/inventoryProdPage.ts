import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

import {SwagLabsBaseProdPage} from '../Models/baseProdPage';

export class SwagLabsInventoryPage extends SwagLabsBaseProdPage {

    // inventory locators and counts
    private _itemListLoc:Locator; // inventory item list 
    private _itemCount:number;


    // inventory expected value

    constructor(page: Page, baseURL:String | undefined) {

        super(page, baseURL);

        // override base expect text fields
        this._expTitleText = "Products";
        this._expPathHtml = "inventory.html"

        // set invetory page locators
        this._itemListLoc = page.locator('div[data-test="inventory-item"]');

        // set initial values
        this._itemCount = 0
    }
    async invItemCount():Promise<number> {
        this._itemCount = await this._itemListLoc.count()
        console.log(`Inventory has ${this._itemCount} products`);
        expect(this._itemCount).toBeGreaterThan(0);
        return this._itemCount;
    }

    async selectItems(
        mod:number // modules to select items add to cart
                   // example 2 add every 2nd item
                   // example 3 add every 3rd item
    ) :Promise<number> {
        // Each Inventory Item has
        // sub-item img via 'img.inventory_item_img'
        //   with alt value as <product name>
        // sub-item name via 'div.inventory_item_name ' or 'div[data-test'="inventory-item-name"]'
        //   with text as <product name>
        // sub-item desc via 'div.inventory_item_desc' or div[data-test'="inventory-item-desc]
        //   with text as <product description>
        // sub-item price via 'div.inventory_item_price 'div[data-test'="inventory-item-desc]'
        //   with text <product price>
        // sub-item action via 'button'
        //    when class has ' btn_primary ' 
        //    then ready for 'Add to cart' action
        //     and text is 'Add to cart' 
        //     and id is 'add-to-cart-<product-name>'
        //    otherwise class has ' btn_secondary ' 
        //    then ready for 'Remove' action
        //      and text is 'Remove'
        //      and id is 'remove-<product-name>'
        //      and item is in Cart
        // 'Add to cart' action does
        //    add item to cart; increase cart count;
        //    change action to be 'Remove" as above
        // 'Remove' action does
        //    remove item from cart; descrease cart count
        //    change action to 'Add to cart'

        let inCartCount:number = 0;
        for(let i = 0; i < this._itemCount; i++) {
            const itemLoc:Locator = await this._itemListLoc.nth(i);
    
            const itemImgLoc:Locator = await itemLoc.locator('img');
            const itemImgAltAttr = await itemImgLoc.getAttribute('alt');
           
            const itemNameLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-name"]');
            const itemNameText = await itemNameLoc.innerText();
            
            const itemPriceLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-price"]')
            const itemPriceText = await itemPriceLoc.innerText();
            console.log(`item ${i+1}: name=${itemNameText}; price=${itemPriceText};`);
            expect(itemImgAltAttr).toBe(itemNameText)
           
            const itemDescLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-desc"]');
            const itemDescText = await itemDescLoc.innerText();
            console.log(`item ${i+1}: desc=${itemDescText}`);
           
            const itemActLoc:Locator = await itemLoc.locator('button');
            if ((i+1) % mod  == 0) {
                await itemActLoc.click()
            }
            const itemActText = await itemActLoc.innerText();
            console.log(`item ${i+1} action=${itemActText}`)
            
            const itemActClassAttr = await itemActLoc.getAttribute('class');
            if (itemActClassAttr?.includes(' btn_primary ')) {
                expect(itemActText).toBe('Add to cart')
            } else {
                inCartCount++;
                expect(itemActClassAttr).toContain(' btn_secondary ')
                expect(itemActText).toBe('Remove')
            }
        }
        console.log(`Cart Count in=${inCartCount}; out=${this._itemCount - inCartCount}`)
        this._expcartCount = inCartCount;
        return inCartCount;
    }
}