import { test, expect } from '@playwright/test';
import { Page,  Locator} from 'playwright';

import { SwagLabsLoginPage } from '../Models/demoLoginPage';

test.describe('Login Only Tests', () => {
const defaultURL = process.env.UI_BASE_URL;
const uiPassword = process.env.UI_PASSWORD;
const yes_debug = true;
const no_debug = false;

    test('Login: standard_user', async ({ page }) => {
        // standard_user success login to product page

        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("standard_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        await loginPage.loginAction("");
    });

    test('Login: locked_out_user', async ({ page }) => {
        // locked_out_user Failed login as locked out
        
        const defaultURL = process.env.UI_BASE_URL;
        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("locked_out_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        await loginPage.loginAction("Epic sadface: Sorry, this user has been locked out.");
    });

    test('Login: problem_user', async ({ page }) => {
        // problem_user success login to product page

        const defaultURL = process.env.UI_BASE_URL;
        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("problem_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        await loginPage.loginAction("");
    });

    test('Login: performance_glitch_user', async ({ page }) => {
        // performance_glitch_user success login to product page

        const defaultURL = process.env.UI_BASE_URL;
        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("performance_glitch_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        await loginPage.loginAction("");
    });

    test('Login: error_user', async ({ page }) => {
        // error_user success login to product page

        const defaultURL = process.env.UI_BASE_URL;
        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("error_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        await loginPage.loginAction("");
    });

    test('Login: visual_user', async ({ page }) => {
        // visual_user success login to product page

        const defaultURL = process.env.UI_BASE_URL;
        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("visual_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        await loginPage.loginAction("");
    });

    test('Login: user pass mistmach', async ({ page }) => {
        // visual_user success login to product page

        const defaultURL = process.env.UI_BASE_URL;
        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("invalid_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        await loginPage.loginAction("Epic sadface: Username and password do not match any user in this service");
    });

});