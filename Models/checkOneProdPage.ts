import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

import {SwagLabsBaseProdPage} from './baseProdPage';

export class SwagLabsCheckOnePage extends SwagLabsBaseProdPage {

    // your-cart locators and counts
    private _checkFirstNameLoc:Locator;
    private _checkLastNameLoc:Locator;
    private _checkOnePostalLoc:Locator;
    private _checkOneErrorLoc:Locator;
    private _checkOneErrorBtn:Locator;
    private _checkOneContActLoc:Locator;
    private _checkOneCancelActLoc:Locator;

    private _cartCount:number

    // your-count expected value
    private readonly _expFirstPlace:string;
    private readonly _initFirstText:string;
    private readonly _expLastPlace:string;
    private readonly _initLastText:string;
    private readonly _expPostalPlace:string;
    private readonly _initPostalText:string;
    private readonly initErrorMsg:string;
    private readonly _expContActValue:string;
    private readonly _expCancelActValue:string;

    constructor(page: Page, baseURL:String | undefined, cartCount:number) {

        super(page, baseURL);

        // override base expect text fields
        this._expTitleText = "Checkout: Your Information";
        this._expPathHtml = this._expCheckOnePathHtml;

        // set invetory page locators
        // First Name via 'input#first-name' or 'input[data-test="firstName"]'
        this._checkFirstNameLoc = this.page.locator('input#first-name');
        
        // Last Name via 'input#last-name' or 'input[data-test="lastName"]'
        this._checkLastNameLoc = this.page.locator('input#last-name');

        // Zip Code via 'input#postal-code' or 'input[data-test="postalCode"]'
        this._checkOnePostalLoc = this.page.locator('input#postal-code');

        // Check Error via 'div[class^="error-message-container"]'
        // when have error class="error-message-container error"
        this._checkOneErrorLoc = this.page.locator('div[class^="error-message-container"]');

        // when Continue Error exists 
        //   with error message info
        // and button via 'button#error-button' or 'input[data-test="error-button"]'
        //     Note this really the error meesage item
        //     when click on button clears error message text
        this._checkOneErrorBtn = this._checkOneErrorLoc.locator('button[data-test="error-button"]');

        // Cancel Action via 'button[data-test="cancel"]'
        // Cancel goes to "Your Cart Page"
        this._checkOneCancelActLoc = this.page.locator('button[data-test="cancel"]');

        // Continue Action via 'input#continue' or 'input[data-test="continue"]'
        this._checkOneContActLoc = this.page.locator('input[data-test="continue"]');

        // set initial values
        this._expcartCount = cartCount;
        this._cartCount = this._expcartCount;

        // set fixed expected values
        this._expFirstPlace = "First Name";
        this._expLastPlace = "Last Name"
        this._expPostalPlace = "Zip/Postal Code";
        this._expCancelActValue = "Cancel";
        this._expContActValue = "Continue"

        // set inital change expected values
        this._initFirstText = ""; 
        this._initLastText = "";
        this._initPostalText = "";
        this.initErrorMsg = "";
    }

    async checkStandardFields():Promise<void> {
        super.checkStandardFields();

        await this._checkFirstNameLoc.isVisible();
        const checkOneFirstPlace = await this._checkFirstNameLoc.getAttribute("placeholder");
        expect(checkOneFirstPlace).toBe(this._expFirstPlace);
        const checkOneFirstValue = await this._checkFirstNameLoc.getAttribute("value");
        expect(checkOneFirstValue).toBe(this._initFirstText);

        await this._checkLastNameLoc.isVisible();
        const checkOneLastPlace = await this._checkLastNameLoc.getAttribute("placeholder");
        expect(checkOneLastPlace).toBe(this._expLastPlace);
        const checkOneLastValue = await this._checkLastNameLoc.getAttribute("value");
        expect(checkOneLastValue).toBe(this._initLastText);

        await this._checkOnePostalLoc.isVisible();
        const checkOnePostalPlace = await this._checkOnePostalLoc.getAttribute("placeholder");
        expect(checkOnePostalPlace).toBe(this._expPostalPlace);
        const checkOnePostalValue = await this._checkOnePostalLoc.getAttribute("value");
        expect(checkOnePostalValue).toBe(this._initPostalText);

        await this._checkOneErrorLoc.isVisible();
        const checkOneErrortext = await this._checkOneErrorLoc.innerText()
        expect(checkOneErrortext).toBe(this.initErrorMsg);

        await this._checkOneCancelActLoc.isVisible();
        const checkOneCancelText = await this._checkOneCancelActLoc.innerText();
        expect(checkOneCancelText).toBe(this._expCancelActValue);

        await this._checkOneContActLoc.isVisible();
        const checkOneContActValue= await this._checkOneContActLoc.getAttribute("value");
        expect(checkOneContActValue).toBe(this._expContActValue);
    }

    async inputFirstName(firstName:string):Promise<void> {
        await this._checkFirstNameLoc.fill(firstName);
        const userText = await this._checkFirstNameLoc.getAttribute("value")
        expect(userText).toBe(firstName);
    }

    async inputLastName(lastName:string):Promise<void> {
        await this._checkLastNameLoc.fill(lastName);
        const userText = await this._checkLastNameLoc.getAttribute("value")
        expect(userText).toBe(lastName);
    }

    async inputPostalCode(postalcode:string):Promise<void> {
        await this._checkOnePostalLoc.fill(postalcode);
        const userText = await this._checkOnePostalLoc.getAttribute("value")
        expect(userText).toBe(postalcode);
    }

    async clickContinueAct(expErrMsg:String, clearErr?:boolean):Promise<Boolean> {

        await this._checkOneContActLoc.click();
        
        // when expErrMsg is empty string 
        // then Login Success
        //  and on checkout two Page
        //  and return true
        if (expErrMsg === "") {
            const checkTwoURL:string = this.page.url();
            expect(checkTwoURL).toBe(`${this._baseURL}${this._expCheckTwoPathHtml}`);
            return true;
        }
        // else Login failure
        // check error message
        // return false
        let checkOneErrortext = await this._checkOneErrorLoc.innerText()
        expect(checkOneErrortext).toBe(expErrMsg);
        if (clearErr) {
            await this._checkOneErrorBtn.isVisible();
            await this._checkOneErrorBtn.click()
            checkOneErrortext =await this._checkOneErrorLoc.innerText()
            expect(checkOneErrortext).toBe(this.initErrorMsg);
        }
        return false;
    }
}