import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

import {SwagLabsBaseProdPage} from './baseProdPage';

export class SwagLabsCheckDonePage extends SwagLabsBaseProdPage {

    private _checkDoneThankLoc:Locator;
    private _checkDoneShipLoc:Locator;
    private _checkDoneHomeAct:Locator;

    private readonly _expDoneThankText:string;
    private readonly _expDoneShipText:string;
    private readonly _expDoneHomeValue:string;

    constructor(page: Page, baseURL:String | undefined) {

        super(page, baseURL);

        // override base expect text fields
        this._expTitleText = "Checkout: Complete!";
        this._expPathHtml = this._expCheckDonePathHtml;

        // set invetory page locators
         // Complete-Thankyou text via via 'h2.complete-header' or h2[data-test="complete-header"]'
        this._checkDoneThankLoc = page.locator('h2[data-test="complete-header"]')

        // Complete-Order-Ship info via via 'div.complete-text' or div[data-test="complete-text"]'
        this._checkDoneShipLoc = page.locator('div[data-test="complete-text"]')

        // Back-Home button goes to Inventory Page
        // via 'button#back-to-products' 'button[data-test="back-to-products"]'
        this._checkDoneHomeAct = page.locator('button[data-test="back-to-products"]');

        // set initial values
        this._expcartCount = 0;

        // set fixed expected values
        this._expDoneThankText = "Thank you for your order!";
       
        this._expDoneShipText = "Your order has been dispatched, " 
                    + "and will arrive just as fast as the pony can get there!"
        
        this._expDoneHomeValue = "Back Home";
    }

    async checkStandardFields():Promise<void> {
        super.checkStandardFields();

        await this._checkDoneThankLoc.isVisible()
        const checkDoneThankText:string = await this._checkDoneThankLoc.innerText();
        expect(checkDoneThankText).toBe( this._expDoneThankText)

        await this._checkDoneShipLoc.isVisible()
        const checkDoneShipText:string = await this._checkDoneShipLoc.innerText();
        expect(checkDoneShipText).toBe(this._expDoneShipText);

        await this._checkDoneHomeAct.isVisible();
        const CheckDoneHomeText:string = await this._checkDoneHomeAct.innerText();
        expect(CheckDoneHomeText).toBe(this._expDoneHomeValue)
    }


    async clickBackHomeAct():Promise<void> {
        await this._checkDoneHomeAct.click();
        // check Home on Product Inventory Page 
        const homeProdURL:string = this.page.url();
        expect(homeProdURL).toBe(`${this._baseURL}${this._expInvtProdPathHtml}`);
    }

}