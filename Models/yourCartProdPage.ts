import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

import {SwagLabsBaseProdPage} from './baseProdPage';

export class SwagLabsYourCartPage extends SwagLabsBaseProdPage {

    // your-cart locators and counts
    
    private _cartHdrQtyLoc:Locator; 
    private _cartHdrDescLoc:Locator;
    private _cartItemListLoc:Locator;
    private _contShopAct:Locator;
    private _checkOutAct:Locator;

    private _cartCount:number

    // your-count expected value
    private readonly _expQtyHdr:string;
    private readonly _expDescHdr:string;
    private readonly _expContShopText:string;
    private readonly _expCheckOutText:string;

    constructor(page: Page, baseURL:String | undefined, cartCount:number) {

        super(page, baseURL);

        // override base expect text fields
        this._expTitleText = "Your Cart";
        this._expPathHtml = this._expYourCartPathHtml;

        // set invetory page locators
        this._cartHdrQtyLoc = this.page.locator('div.cart_quantity_label')
        this._cartHdrDescLoc = this.page.locator('div.cart_desc_label')
        this._cartItemListLoc = this.page.locator('div[data-test="inventory-item"]');

        // Continue Shopping action via 'button#continue-shopping' or 'button[data-test="continue-shopping"]
        this._contShopAct = this.page.locator('button[data-test="continue-shopping"]')

        // Checkout action via 'button#checkout' or 'button[data-test="checkout"]
        this._checkOutAct = this.page.locator('button[data-test="checkout"]')

        // set initial values
        this._expcartCount = cartCount;
        this._cartCount = this._expcartCount;

        // set expected values
        this._expQtyHdr = "QTY";
        this._expDescHdr = "Description"
        this._expCheckOutText = "Checkout";
        this._expContShopText = "Continue Shopping";
    }

    async checkStandardFields():Promise<void> {
        super.checkStandardFields();

        await this._cartHdrQtyLoc.isVisible();
        const hdrQtyText:string = await this._cartHdrQtyLoc.innerText();
        expect(hdrQtyText).toBe(this._expQtyHdr);

        await this._cartHdrDescLoc.isVisible();
        const hdrDescText:string = await this._cartHdrDescLoc.innerText();
        expect(hdrDescText).toBe( this._expDescHdr);

        const contShopText:string = await this._contShopAct.innerText();
        expect(contShopText).toBe(this._expContShopText)

        const checkOutText:string = await this._checkOutAct.innerText();
        expect(checkOutText).toBe(this._expCheckOutText)

    }

    async clickContShopAct():Promise<void> {
        await this._contShopAct.click()
        // check on product-inventory page url
        const pageURL:string = this.page.url();
        expect(pageURL).toBe(`${this._baseURL}inventory.html`);
    }

    async clickCheckOutAct():Promise<void> {
        await this._checkOutAct.click()
        // check on checkout-initial page url
        const pageURL:string = this.page.url();
        expect(pageURL).toBe(`${this._baseURL}checkout-step-one.html`);
    }

    // TODO method that removes cart item(s)

    async reviewCartItems() :Promise<number> {

        const yourCartCount = await this._cartItemListLoc.count()
        console.log(`Have ${yourCartCount} Cart Items`);
        expect(yourCartCount).toBe(this._cartCount);

        // each your cart item has
        // sub-item quality via 'div.cart_quantity' or 'div[data-test'="item-quantity"]'
        //   with text as select quantity via product item add-to-cart click count
        // sub-item name via 'div.inventory_item_name' or 'div[data-test'="inventory-item-name"]'
        //   with text as "product name" same as prod-page item's name
        // sub-item desc via 'div.inventory_item_desc' or 'div[data-test'="inventory-item-desc"]'
        //   with text as "product desc" same as prod-page item's desc
        // sub-item price via 'div.inventory_item_price' or 'div[data-test'="inventory-item-price"]'
        //   with text as "product price" same as prod-page item's price
        // sub-item action via `button` for only remove (art-del) action as in Product item list above
        //   so class has btn_secondary; id is 'remove-<product-name>'
        for (let i=0; i< yourCartCount; i++) {
            const itemLoc:Locator = await this._cartItemListLoc.nth(i);

            const itemQtyLoc:Locator = await itemLoc.locator('div.cart_quantity');
            const itemQtyText = await itemQtyLoc.innerText();
           
            const itemNameLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-name"]');
            const itemNameText = await itemNameLoc.innerText();
            
            const itemPriceLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-price"]')
            const itemPriceText = await itemPriceLoc.innerText();
            console.log(`item ${i+1}: qty= ${itemQtyText}; name=${itemNameText}; price=${itemPriceText};`);
    
            const itemDescLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-desc"]');
            const itemDescText = await itemDescLoc.innerText();
            console.log(`item ${i+1}: desc=${itemDescText}`);

            const itemActLoc:Locator = await itemLoc.locator('button');
            const itemActText = await itemActLoc.innerText();
            console.log(`item ${i+1} action=${itemActText}`)
            const itemActClassAttr = await itemActLoc.getAttribute('class');
            expect(itemActClassAttr).toContain(' btn_secondary ')
            expect(itemActText).toBe('Remove')

        }
        return this._cartCount
    }
}