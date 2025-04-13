import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

export class SwagLabsBaseProdPage {

    private readonly page: Page;

    private _baseURL;

    // commoon locators for invetory and checkout pages
    protected _pageLogoLoc:Locator;
    protected _pageTitleLoc:Locator;
    protected _pageCartGroup:Locator;

    // common text fields
    protected readonly _expLogoText:String;

    protected _expPathHtml:string;
    protected _expTitleText:String;
    protected _expcartCount:number;

    constructor(page: Page, baseURL:String | undefined) {
        this.page = page;

        this._baseURL = baseURL;

        // set Common Locators
        this._pageLogoLoc =  page.locator('div.app_logo');
        this._pageTitleLoc = page.locator('span[data-test="title"]')
        this._pageCartGroup = page.locator('div#shopping_cart_container');

        // set  readonly expected text values
        this._expLogoText = "Swag Labs"

        // init common setable expected text values
        this._expTitleText = "Common Title";
        this._expPathHtml = "common_path"
        this._expcartCount = 0;
    }

    async checkFields():Promise<void> {
        
        // check on page URL  with path-html value
        const pageURL = this.page.url();
        expect(pageURL).toBe(`${this._baseURL}${this._expPathHtml}`);
        console.log(`url is ${pageURL}`)

        // check Page Logo text
        await this._pageLogoLoc.isVisible()
        const pageLogoText:string = await this._pageLogoLoc.innerText();
        expect(pageLogoText).toBe(this._expLogoText);

        // check page title
        await this._pageTitleLoc.isVisible()
        const pageTitleText:string = await this._pageTitleLoc.innerText();
        expect(pageTitleText).toBe(this._expTitleText)
        console.log(`title is ${pageTitleText}`)
    }

    async checkCartCount():Promise<void> {
        await this._pageCartGroup.isVisible();
        const prodCartText = await this._pageCartGroup.innerText();
        console.log(`Prod Cart Text ${prodCartText};`)
        if (this._expcartCount > 0) {
            expect(Number(prodCartText)).toBe(this._expcartCount);
        } else {
            expect(prodCartText).toBe('');
        }

    }

    async getExpCount():Promise<number> {
        return this._expcartCount;
    }

    async goToCartPage():Promise<void> {
        // go to cart page
        await this._pageCartGroup.hover();
        await this._pageCartGroup.click();
        const cartURL:string = this.page.url();
        expect(cartURL).toBe(`${this._baseURL}cart.html`);
    }


}