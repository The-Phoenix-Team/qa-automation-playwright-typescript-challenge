import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

export class SwagLabsBaseProdPage {

    protected readonly page: Page;

    protected _baseURL;

    // commoon locators for invetory and checkout pages
    protected _pageLogoLoc:Locator;
    protected _pageTitleLoc:Locator;
    protected _pageCartGroup:Locator;

    protected _menuIconLoc:Locator;
    protected _menuCloseAct:Locator;
    protected _menuAllItemsAct:Locator;
    protected _menuAboutAct:Locator;
    protected _menuLogoutAct:Locator;
    protected _menuResetAct:Locator;

    // common text fields
    protected readonly _expLogoText:string;
    protected readonly _expMenuAllItemText:string;
    protected readonly _expMenuAboutText:string;
    protected readonly _expMenuLogoutText:string;
    protected readonly _expMenuResetText:string;

    protected _expPathHtml:string;
    protected _expTitleText:String;
    protected _expcartCount:number;

    // common inherited object value
    protected readonly _expInvtProdPathHtml = "inventory.html"
    protected readonly _expYourCartPathHtml = "cart.html"
    protected readonly _expCheckOnePathHtml = "checkout-step-one.html"
    protected readonly _expCheckTwoPathHtml = "checkout-step-two.html"
    protected readonly _expCheckDonePathHtml = "checkout-complete.html"

    constructor(page: Page, baseURL:String | undefined) {
        this.page = page;

        this._baseURL = baseURL;

        // set Common Locators
        this._pageLogoLoc =  page.locator('div.app_logo');
        this._pageTitleLoc = page.locator('span[data-test="title"]')
        this._pageCartGroup = page.locator('div#shopping_cart_container');

         // use menu-icon to Logout
        // Note: the Product, Cart and all Checkout pages has menu-icon 
        // via 'div.bm-burger-button > button' when click displays
        this._menuIconLoc = page.locator('div.bm-burger-button > button')
        
        // menu-icon click displays
        // menu-item: close menu options 'div.bm-cross-button'
        this._menuCloseAct = page.locator('div.bm-cross-button');

        // menu-item: All Items via 'a#inventory_sidebar_link' or 'a[data-test="inventory-sidebar-link"]'
        this._menuAllItemsAct = page.locator('a#inventory_sidebar_link');
        
        // menu-item: About via 'a#about_sidebar_link' or 'a[data-test="about-sidebar-link"]'
        this._menuAboutAct = page.locator('a#about_sidebar_link');
       
        // menu-item: Logout via 'a#logout_sidebar_link' or 'a[data-test="logout-sidebar-link"]' 
        this._menuLogoutAct = page.locator('a#logout_sidebar_link');
       
        //  menu-item: Reset App Stat via 'a#reset_sidebar_link' or 'a[data-test="reset-sidebar-link"]'
        this._menuResetAct = page.locator('a#reset_sidebar_link');

        // set readonly expected text values
        this._expLogoText = "Swag Labs"
        this._expMenuAllItemText = "All Items";
        this._expMenuAboutText = "About";
        this._expMenuLogoutText = "Logout";
        this._expMenuResetText = "Reset App State";

        // init common setable expected text values
        this._expTitleText = "Common Title";
        this._expPathHtml = "common_path"
        this._expcartCount = 0;
    }

    getInvtPathHtml():string {
        return this._expInvtProdPathHtml;
    }

    async checkStandardFields():Promise<void> {
        
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
        expect(cartURL).toBe(`${this._baseURL}${this._expYourCartPathHtml}`);
    }

    async checkMenuActions():Promise<void> {
         // check all menu-item are Visible and text value
         await this._menuIconLoc.click();
         await this._menuCloseAct.isVisible();
         
         await this._menuAllItemsAct.isVisible()
         const menuAllItemsText:string = await this._menuAllItemsAct.innerText();
         expect(menuAllItemsText).toBe(this._expMenuAllItemText)
 
         await this._menuAboutAct.isVisible()
         const menuAboutText:string = await this._menuAboutAct.innerText();
         expect(menuAboutText).toBe(this._expMenuAboutText)
 
         await this._menuLogoutAct.isVisible()
         const menuLogoutText:string = await this._menuLogoutAct.innerText();
         expect(menuLogoutText).toBe(this._expMenuLogoutText)
 
         await this._menuResetAct.isVisible()
         const menuResetText:string = await this._menuResetAct.innerText();
         expect(menuResetText).toBe(this._expMenuResetText)

         await this._menuCloseAct.click();
    }

    async clickMenuLogout():Promise<void> {
        await this._menuIconLoc.click();
        await this._menuLogoutAct.isVisible();
        await this._menuLogoutAct.click();
        // check on checkout-initial page url
        const logoutURL:string = this.page.url();
        expect(logoutURL).toBe(`${this._baseURL}`);
    }
    

}