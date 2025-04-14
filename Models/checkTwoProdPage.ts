import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

import {SwagLabsBaseProdPage} from './baseProdPage';

export class SwagLabsCheckTwoPage extends SwagLabsBaseProdPage {

    // checkout two locators and counts
    private _checkTwoHdrQtyLoc:Locator;
    private _checkTwoHdrDescLoc:Locator;
    private _checkTwoItemListLoc:Locator;

    private _checkTwoPayLabelLoc:Locator;
    private _checkTwoPayValueLoc:Locator;
    private _checkTwoShipLabelLoc:Locator;
    private _checkTwoShipValueLoc:Locator;
    private _checkTwoPriceLabelLoc:Locator;
    private _checkTwoitemTotalLoc:Locator;
    private _checkTwoitemTaxLoc:Locator;
    private _checkTwoPriceTotLoc:Locator;
    private _checkTwoCancelAct:Locator;
    private _checkTwoFinishAct:Locator;
    
    private _cartCount:number

    private _ItemTotal:number;
    private _taxPercent:number;
    private _TaxValue:number;
    private _TotalValue:number;

    // checkout two expected value
    private readonly _expQtyHdr:string;
    private readonly _expDescHdr:string;

    private _expPayLabelText:string;
    private _expPayInfoText:string;
    private _expShipLabelText:string;
    private _expShipInfoText:string;
    private _expPriceLabelText:string

    private readonly _expFinshActValue:string;
    private readonly _expCancelActValue:string;

    constructor(page: Page, baseURL:String | undefined, cartCount:number) {

        super(page, baseURL);

        // override base expect text fields
        this._expTitleText = "Checkout: Overview";
        this._expPathHtml = this._expCheckTwoPathHtml;

        // set invetory page locators
        // Your Cart item List - each item has QTY, Desc, Price
        // #cart_contents_container > div > div.cart_list > div.cart_quantity_label
        this._checkTwoHdrQtyLoc = page.locator('div.cart_quantity_label')
        this._checkTwoHdrDescLoc = page.locator('div.cart_desc_label')
        this._checkTwoItemListLoc = page.locator('div[data-test="inventory-item"]');

        // Payment Label via 'div.summary_info_label.nth(0)' or div[data-test="payment-info-label"]'
        this._checkTwoPayLabelLoc = page.locator('div[data-test="payment-info-label"]');

        // Payment value via 'div.summary_value_label.nth(0)' or div[data-test="payment-info-value"]'
        this._checkTwoPayValueLoc = page.locator('div[data-test="payment-info-value"]');

        // Shipping Label via 'div.summary_info_label.nth(1)' or div[data-test="shipping-info-label"]'
        this._checkTwoShipLabelLoc = page.locator('div[data-test="shipping-info-label"]');
  
         // Shipping value via 'div.summary_value_label.nth(1)' or div[data-test="shipping-info-value"]'
        this._checkTwoShipValueLoc = page.locator('div[data-test="shipping-info-value"]');
    
        // Price Label via 'div.summary_info_label.nth(2)' or div[data-test="total-info-label"]'
        this._checkTwoPriceLabelLoc = page.locator('div[data-test="total-info-label"]');
    
        //    item Total via sum each cart item's QTY*Price
        //      via 'div.summary_subtotal_label' or div[data-test="subtotal-label"]'
        this._checkTwoitemTotalLoc = page.locator('div[data-test="subtotal-label"]');

        //    Tax value as 8% of item Total 
        //      via 'div.summary_tax_label' or div[data-test="tax-label"]'
        this._checkTwoitemTaxLoc = page.locator('div[data-test="tax-label"]');

        //    Total as item Total plus Tax value
        //      via 'div.summary_total_label' or div[data-test="total-label"]'
        this._checkTwoPriceTotLoc = page.locator('div[data-test="total-label"]');

        // Cancel Button - goes to Products page
        //   via 'button#cancel' or 'button[data-test="cancel"]'
        this._checkTwoCancelAct = page.locator('button[data-test="cancel"]');

        // Finish Button - goes to CheckOut Done page
        // via 'button#finish' 'button[data-test="finish"]'
        this._checkTwoFinishAct = page.locator('button[data-test="finish"]');

        // set initial values
        this._expcartCount = cartCount;
        this._cartCount = this._expcartCount;

        // set fixed expected values
        this._expPayLabelText = "Payment Information:"
        this._expPayInfoText = 'SauceCard #31337'
        this._expShipLabelText = 'Shipping Information:'
        this._expShipInfoText = 'Free Pony Express Delivery!'
        this._expPriceLabelText = 'Price Total';

        this._expQtyHdr = "QTY";
        this._expDescHdr = "Description"
       
        this._expCancelActValue = "Cancel";
        this._expFinshActValue = "Finish"

        // set inital change expected values
        this._ItemTotal = 0;
        this._taxPercent = 8;
        this._TaxValue = 0;
        this._TotalValue = 0;
    }

    async checkStandardFields():Promise<void> {
        super.checkStandardFields();

        await this._checkTwoHdrQtyLoc.isVisible();
        const checkTwoHdrQtyText = await this._checkTwoHdrQtyLoc.innerText();
        expect(checkTwoHdrQtyText).toBe(this._expQtyHdr);

        await this._checkTwoHdrDescLoc.isVisible();
        const checkTwoHdrDescText = await this._checkTwoHdrDescLoc.innerText();
        expect(checkTwoHdrDescText).toBe(this._expDescHdr);

        const checkTwoCartCount = await this._checkTwoItemListLoc.count()
        console.log(`Have ${checkTwoCartCount} Cart Items`);
        expect(checkTwoCartCount).toBe(this._cartCount);

        const checkTwoPayLabelText = await this._checkTwoPayLabelLoc.innerText();
        expect(checkTwoPayLabelText).toBe(this._expPayLabelText);

        const checkTwoPayValueText = await this._checkTwoPayValueLoc.innerText();
        expect(checkTwoPayValueText).toBe(this._expPayInfoText);

        const checkTwoShipLabelText = await this._checkTwoShipLabelLoc.innerText();
        expect(checkTwoShipLabelText).toBe(this._expShipLabelText);

        const checkTwoShipValueText = await this._checkTwoShipValueLoc.innerText();
        expect(checkTwoShipValueText).toBe(this._expShipInfoText);

        const checkTwoPriceLabelText = await this._checkTwoPriceLabelLoc.innerText();
        expect(checkTwoPriceLabelText).toBe(this._expPriceLabelText);

        await this._checkTwoCancelAct.isVisible();
        const CheckTwoCancelText:string = await this._checkTwoCancelAct.innerText();
        expect(CheckTwoCancelText).toBe(this._expCancelActValue)

        await this._checkTwoFinishAct.isVisible();
        const checkTwoFinshText:string = await this._checkTwoFinishAct.innerText();
        expect(checkTwoFinshText).toBe(this._expFinshActValue)

    }

    async totalItemCost():Promise<void> {
        console.log(`total cart cart with ${this._cartCount} items`);
        for (let i=0; i< this._cartCount; i++) {
            const itemLoc:Locator = await this._checkTwoItemListLoc.nth(i);

            const itemQtyLoc:Locator = await itemLoc.locator('div.cart_quantity');
            const itemQtyText = await itemQtyLoc.innerText();
            const qtyValue:number = Number(itemQtyText);
           
            const itemNameLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-name"]');
            const itemNameText = await itemNameLoc.innerText();
            
            const itemPriceLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-price"]')
            const itemPriceText = await itemPriceLoc.innerText();
            const priceValue:number = parseFloat(itemPriceText.replace('$',''));
            console.log(`item ${i+1}: qty= ${itemQtyText}; name=${itemNameText}; price=${itemPriceText};`);
            this._ItemTotal += qtyValue * priceValue;

            const itemDescLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-desc"]');
            const itemDescText = await itemDescLoc.innerText();
            console.log(`item ${i+1}: desc=${itemDescText}`);

        }

        this._TaxValue = Math.round(this._ItemTotal * this._taxPercent) / 100
        this._TotalValue = this._ItemTotal + this._TaxValue
        console.log(`Checkout Object total=${this._ItemTotal}; tax=${this._TaxValue}`)
    }

    async checkCostFields():Promise<void> {

        const checkTwoitemTotalText = await this._checkTwoitemTotalLoc.innerText();
        const expItemTotalValue = `Item total: $${this._ItemTotal}`;
        expect(checkTwoitemTotalText).toBe(expItemTotalValue);

        const checkTwoitemTaxText = await this._checkTwoitemTaxLoc.innerText();
        const expItemTaxValue = `Tax: $${this._TaxValue}`;
        expect(checkTwoitemTaxText).toBe(expItemTaxValue);

        const checkTwoPriceTotText = await this._checkTwoPriceTotLoc.innerText();
        const expPriceTotalValue = `Total: $${this._TotalValue}`;
        expect(checkTwoPriceTotText).toBe(expPriceTotalValue);
    }

    async clickFinishAct():Promise<void> {
        await this._checkTwoFinishAct.click()
        // check on checkout-initial page url
        const pageURL:string = this.page.url();
        expect(pageURL).toBe(`${this._baseURL}${this._expCheckDonePathHtml}`);
    }

}