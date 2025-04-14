import { test, expect } from '@playwright/test';
import { Page,  Locator} from 'playwright';

import { SwagLabsLoginPage } from '../Models/demoLoginPage';
import { SwagLabsInventoryPage } from '../Models/inventoryProdPage';
import { SwagLabsYourCartPage } from '../Models/yourCartProdPage';
import { SwagLabsCheckOnePage } from '../Models/checkOneProdPage';
import { SwagLabsCheckTwoPage } from '../Models/checkTwoProdPage';
import { SwagLabsCheckDonePage } from '../Models/checkDoneProdPage';

test.describe('Complete Work Flow', () => {
    test('standard_user Product Select Checkout Logout', async ({ page }) => {
              
        const defaultURL = process.env.UI_BASE_URL;
        const uiPassword = process.env.UI_PASSWORD;
        const no_debug = false;

        console.log("Standard User Login")
        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("standard_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        let loginSuccess = await loginPage.loginAction("");
        expect (loginSuccess).toBeTruthy();
        console.log("Then to Product-Invetory page")

        const inventoryPage = new SwagLabsInventoryPage(page, defaultURL);
        await inventoryPage.checkStandardFields();
        await inventoryPage.checkCartCount();
    
        // Select every other item
        const selectModulus:number = 2
        const invtCartCount:number = await inventoryPage.selectItems(selectModulus);
        await inventoryPage.checkCartCount();

        await inventoryPage.goToCartPage();
        console.log("Next to Your-Cart page")

        // review select item - keep them all
        const yourCartPage = new SwagLabsYourCartPage(page, defaultURL, invtCartCount);
        await yourCartPage.checkStandardFields();
        await yourCartPage.checkCartCount();
        const yourCartCount:number = await yourCartPage.reviewCartItems();

        // see if want more items via 'Continue Shopping' action
        await yourCartPage.clickContShopAct();
        console.log("Back to Product-Invetory page")
        await inventoryPage.checkStandardFields();

        // On Inventory pag - No more items so back to Cart Page
        await inventoryPage.goToCartPage();
        console.log("Forward to Your-Chart page")
        await yourCartPage.checkStandardFields();

        // Cart Page 'Checkout' action 
        await yourCartPage.clickCheckOutAct();
        // check on checkout your info page url (step-one)
        console.log(`Now On Checkout Your Info page - cart ${yourCartCount} items`)
        const checkoutOnePage = new SwagLabsCheckOnePage(page, defaultURL, yourCartCount);
        await checkoutOnePage.checkStandardFields();
        await checkoutOnePage.checkCartCount();

        // Click Contiue without First, Last, Postal info
        await checkoutOnePage.clickContinueAct("Error: First Name is required", true);

        // Click Contiue with only First Name having non-empty value
        await checkoutOnePage.inputFirstName("standard");
        await checkoutOnePage.clickContinueAct("Error: Last Name is required");

        // Click Contiue with adding Last Name, only Postal is empty
        await checkoutOnePage.inputLastName("user");
        await checkoutOnePage.clickContinueAct("Error: Postal Code is required");
        
        // Click Contiue with adding Postal value 
        // Now have First, Last and Postal value expect to be next page
        await checkoutOnePage.inputPostalCode("80201");
        const isOnNextPage = await checkoutOnePage.clickContinueAct("");
        expect(isOnNextPage).toBeTruthy();

        // check on checkout overview (step two)
        console.log(`Checkout OverView Page- cart ${yourCartCount} items`);
        const checkoutTwoPage = new SwagLabsCheckTwoPage(page, defaultURL, yourCartCount);
        await checkoutTwoPage.checkStandardFields();
        await checkoutTwoPage.checkCartCount();
        await checkoutTwoPage.totalItemCost();
        await checkoutTwoPage.checkCostFields();
        await checkoutTwoPage.clickFinishAct();

        // check on checkout complete page url
        console.log("Now On Checkout Completed Page")
        const checkoutDonePage = new SwagLabsCheckDonePage(page, defaultURL);
        await checkoutDonePage.checkStandardFields();
        await checkoutDonePage.checkCartCount();
        await checkoutDonePage.clickBackHomeAct();
      
        // Back Home on Product Inventory Page 
        console.log("Back Home to Product-Invetory page")
        await inventoryPage.checkStandardFields();
        await inventoryPage.checkMenuActions();
        await inventoryPage.clickMenuLogout();

        // check back on Login Page 
        console.log("Loggout, so on Login Page")
        loginPage.checkInitLoginFields();

    });
 
});
