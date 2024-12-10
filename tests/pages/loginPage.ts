import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page){
        this.page = page;
        this.username = page.locator('[data-test="username"]');
        this.password = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goto(url: string){
        await this.page.goto(url, {waitUntil: "load", timeout: 3000});
    }

    async login(url: string, username: string, password: string){
        await this.goto(url);
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async errorMessageVisible(){
        await this.errorMessage.isVisible();
    }

   
}