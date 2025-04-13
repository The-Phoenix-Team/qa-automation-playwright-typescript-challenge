import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

export class SwagLabsLoginPage {

    private readonly page: Page;

    private _baseURL;

    // locators
    private _titleLoc:Locator // Application Title

    private _usernameLoc:Locator // Login User

    private _passwordLoc:Locator // Login Password

    private _errorLoc:Locator // Login Error information
    private _errMsgLoc:Locator // sub-err field message
    private _errBtnLoc:Locator // sub-err field button

    private _loginBtnLoc:Locator // Login action either error or to Product Page

    // expected text fields
    readonly expTitleText:String;
    readonly expUserPlace:String;
    readonly expPassPlace:String;
    readonly expBtnText:String;

    constructor(page: Page, baseURL) {
        this.page = page;

        this._baseURL = baseURL;
        console.log(`URL - ${this._baseURL}`);

        // Locators
        this._titleLoc = page.locator('div.login_logo');
        this._usernameLoc = page.locator('input[data-test="username"]');
        this._passwordLoc = page.locator('input[data-test="password"]');
        this._errorLoc = page.locator('div[class*="error-message-container"]');
        this._errMsgLoc = this._errorLoc.locator('h3[data-test="error"]')
        this._errBtnLoc = this._errorLoc.locator('button[data-test="error-button"]')
        this._loginBtnLoc = page.locator('input[data-test="login-button"]');

        // expected text values
        this.expTitleText = "Swag Labs";
        this.expUserPlace = "Username";
        this.expPassPlace = "Password";
        this.expBtnText = "Login";

    }
    async goto(debug?:boolean):Promise<void> {

        if (debug) console.log(`goto - ${this._baseURL}`);
        await this.page.goto(`${this._baseURL}`);

        const pageURL = this.page.url();
        expect(pageURL).toBe(this._baseURL);

        // wait to load page fields
        await this._titleLoc.isVisible();
        await this._usernameLoc.isVisible();
        await this._passwordLoc.isVisible();
        await this._errorLoc.isVisible();
        await this._loginBtnLoc.isVisible();

        // check page title text 
        const titleText:string = await this._titleLoc.innerText();
        expect(titleText).toBe(titleText);

        // check username placeholer
        const userPlaceText = await this._usernameLoc.getAttribute("placeholder")
        expect(userPlaceText).toBe(this.expUserPlace);

        // check password placeholder
        const passPlaceText = await this._passwordLoc.getAttribute("placeholder")
        expect(passPlaceText).toBe(this.expPassPlace);

        // check login button text
        const btnText = await this._loginBtnLoc.getAttribute("value")
        expect(btnText).toBe(this.expBtnText);
     
    }

    async inputUserValue(username:string):Promise<void> {
        await this._usernameLoc.fill(username);
        const userText = await this._usernameLoc.getAttribute("value")
        expect(userText).toBe(username);
    }

    async getUserValue():Promise<string> {
        let elemText: string | null = await this._usernameLoc.getAttribute("value");
        if (elemText === null) { elemText = '' }
        return elemText
    }

    async inputPassValue(password:string):Promise<void> {
        await this._passwordLoc.fill(password);

        const passText = await this._passwordLoc.getAttribute("value")
        expect(passText).toBe(password);
    }

    async getPassValue():Promise<string> {
        let elemText: string | null = await this._passwordLoc.getAttribute("value");
        if (elemText === null) { elemText = '' }
        return elemText
    }

    async loginAction(expErrMsg:String):Promise<void> {
        const userValue = await this.getUserValue();
        console.log(`Login ${userValue} attempt`);
        await this._loginBtnLoc.click();

        // when expErrMsg is empty string then success
        if (expErrMsg === "") {
            const productURL:string = this.page.url();
            expect(productURL).toBe(`${this._baseURL}inventory.html`);
            console.log(`Login ${userValue} to Product-Invetory page`);
        } else {
            await this._errMsgLoc.isVisible()
            const errMsgText = await this._errMsgLoc.innerText();
            expect(errMsgText).toBe(expErrMsg);
            console.log(`Login ${userValue} Error`);
        }
    }

}