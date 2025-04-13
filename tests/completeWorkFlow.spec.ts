import { test, expect } from '@playwright/test';
import { Page,  Locator} from 'playwright';

import { SwagLabsLoginPage } from '../Models/demoLoginPage';
import { SwagLabsInventoryPage } from '../Models/inventoryProdPage';

test.describe('Complete Work Flow', () => {
    test('standard_user Checkout Product Logout', async ({ page }) => {
        
        // Note this has inline locators that will be used to create
        // TODO create Page and Object Models for other tests
        // TODO replace inline locators with Models 
      
        const defaultURL = process.env.UI_BASE_URL;
        const uiPassword = process.env.UI_PASSWORD;
        const no_debug = false;

        const loginPage = new SwagLabsLoginPage(page, defaultURL);
        await loginPage.goto(no_debug);

        await loginPage.inputUserValue("standard_user");
        await loginPage.inputPassValue(`${uiPassword}`);
        let loginSuccess = await loginPage.loginAction("");
        expect (loginSuccess).toBeTruthy();
        console.log("Then to Product-Invetory page")

        const inventoryPage = new SwagLabsInventoryPage(page, defaultURL);
        await inventoryPage.checkFields();
        await inventoryPage.checkCartCount();

        const prodCartGroup:Locator = page.locator('div#shopping_cart_container');
    
        const itemCount = await inventoryPage.invItemCount();
        const inCartCount:number = await inventoryPage.selectItems(2);
        const prodCartText = `${inCartCount}`

        await inventoryPage.checkCartCount();

        await inventoryPage.goToCartPage();
        console.log("Next to Your-Cart page")

        const yourCartGroup:Locator = page.locator('div#shopping_cart_container');
        await yourCartGroup.isVisible();

        const cartLogoLoc:Locator = page.locator('div.app_logo');
        await cartLogoLoc.isVisible()
        const cartLogoText:string = await cartLogoLoc.innerText();
        expect(cartLogoText).toBe("Swag Labs")

        const yourCartText = await yourCartGroup.innerText();
        console.log(`Your Cart Text ${yourCartText};`)
        expect(yourCartText).toBe(prodCartText);

        const cartTitleLoc:Locator = page.locator('span[data-test="title"]')
        await cartTitleLoc.isVisible()
        const cartTitleText:string = await cartTitleLoc.innerText();
        expect(cartTitleText).toBe("Your Cart")

        // #cart_contents_container > div > div.cart_list > div.cart_quantity_label
        const cartHdrQtyLoc:Locator = page.locator('div.cart_quantity_label')
        await cartHdrQtyLoc.isVisible();
        const cartHdrQtyText = await cartHdrQtyLoc.innerText();
        expect(cartHdrQtyText).toBe("QTY");

        const cartHdrDescLoc:Locator = page.locator('div.cart_desc_label')
        await cartHdrDescLoc.isVisible();
        const cartHdrDescText = await cartHdrDescLoc.innerText();
        expect(cartHdrDescText).toBe("Description");

        const cartItemListLoc = page.locator('div[data-test="inventory-item"]');
        const yourCartCount = await cartItemListLoc.count()
        console.log(`Have ${yourCartCount} Cart Items`);
        expect(yourCartCount).toBe(inCartCount);

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
            const itemLoc:Locator = await cartItemListLoc.nth(i);

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

        // Continue Shopping action via 'button#continue-shopping' or 'button[data-test="continue-shopping"]
        const contShopAct:Locator = await page.locator('button[data-test="continue-shopping"]')
        const contShopText = await contShopAct.innerText();
        expect(contShopText).toBe("Continue Shopping")

        // Checkout actiom via 'button#checkout' or 'button[data-test="checkout"]
        const checkOutAct:Locator = await page.locator('button[data-test="checkout"]')
        const checkOutText = await checkOutAct.innerText();
        expect(checkOutText).toBe("Checkout")

        // 'Continue Shopping' action
        await contShopAct.click()
        // check on product page url and title text is 'Products'
        const backprodURL:string = page.url();
        expect(backprodURL).toBe(`${defaultURL}inventory.html`);
        console.log("Back to Product-Invetory page")

        const backTitleLoc:Locator = page.locator('span[data-test="title"]')
        await backTitleLoc.isVisible()
        const backTitleText:string = await backTitleLoc.innerText();
        expect(backTitleText).toBe("Products")

        // 'Go to Cart action
        const backCartGroup:Locator = page.locator('div#shopping_cart_container');
        await backCartGroup.isVisible();
        await backCartGroup.click()
       
        // check on cart page url and title text is 'Your Cart'
        const frwdCartURL:string = page.url();
        expect(frwdCartURL).toBe(`${defaultURL}cart.html`);
        console.log("Forward to Your-Chart page")

        const frwdTitleLoc:Locator = page.locator('span[data-test="title"]')
        await frwdTitleLoc.isVisible()
        const frwdTitleText:string = await frwdTitleLoc.innerText();
        expect(frwdTitleText).toBe("Your Cart")

        // 'Checkout' action 
        const frwdcheckAct:Locator = await page.locator('button[data-test="checkout"]')
        await frwdcheckAct.isVisible()
        await frwdcheckAct.click()

        // check on checkout your info page url (step-one)
        const checkOneCartURL:string = page.url();
        expect(checkOneCartURL).toBe(`${defaultURL}checkout-step-one.html`);
        console.log("Now On Checkout Your Info page")

         // check and title text is 'Checkout: Your Information'
         const checkOneTitleLoc:Locator = page.locator('span[data-test="title"]')
         await checkOneTitleLoc.isVisible()
         const checkOneTitleText:string = await checkOneTitleLoc.innerText();
         expect(checkOneTitleText).toBe("Checkout: Your Information")

        const checkOneLogoLoc:Locator = page.locator('div.app_logo');
        await checkOneLogoLoc.isVisible()
        const checkOneLogoText:string = await checkOneLogoLoc.innerText();
        expect(checkOneLogoText).toBe("Swag Labs")
        
        const checkOneCartGroup:Locator = page.locator('div#shopping_cart_container');
        await checkOneCartGroup.isVisible();
        const checkOneCartText = await checkOneCartGroup.innerText();
        console.log(`Check Your Cart Text ${checkOneCartText};`)
        expect(checkOneCartText).toBe(prodCartText);

        // First Name via 'input#first-name' or 'input[data-test="firstName"]'
        const checkOneFirstLoc = page.locator('input#first-name');
        await checkOneFirstLoc.isVisible();
        const checkOneFirstPlace = await checkOneFirstLoc.getAttribute("placeholder");
        expect(checkOneFirstPlace).toBe("First Name");
        let checkOneFirstValue = await checkOneFirstLoc.getAttribute("value");
        expect(checkOneFirstValue).toBe("");

         // Last Name via 'input#last-name' or 'input[data-test="lastName"]'
        const checkOneLastLoc = page.locator('input#last-name');
        await checkOneLastLoc.isVisible();
        const checkOneLastPlace = await checkOneLastLoc.getAttribute("placeholder");
        expect(checkOneLastPlace).toBe("Last Name");
        let checkOneLastValue = await checkOneLastLoc.getAttribute("value");
        expect(checkOneLastValue).toBe("");

        // Zip Code via 'input#postal-code' or 'input[data-test="postalCode"]'
        const checkOnePostalLoc = page.locator('input#postal-code');
        await checkOnePostalLoc.isVisible();
        const checkOnePostalPlace = await checkOnePostalLoc.getAttribute("placeholder");
        expect(checkOnePostalPlace).toBe("Zip/Postal Code");
        let checkOnePostalValue = await checkOnePostalLoc.getAttribute("value");
        expect(checkOnePostalValue).toBe("");

        // Check Error via 'div[class^="error-message-container"]'
        // when have error class="error-message-container error"
        const checkOneErrorLoc = page.locator('div[class^="error-message-container"]');
        await checkOneErrorLoc.isVisible();
        let checkOneErrortext = await checkOneErrorLoc.innerText()
        expect(checkOneErrortext).toBe("");

        // when Continue Error exists 
        //   with error message info
        // and button via 'button#error-button' or 'input[data-test="error-button"]'
        //     Note this really the error meesage item
        //     when click on button clears error message text
        const checkOneErrorBtn = checkOneErrorLoc.locator('button[data-test="error-button"]');

        // Cancel Action via 'button[data-test="cancel"]'
        // Cancel goes to "Your Cart Page"
        const checkOneCancelActLoc = page.locator('button[data-test="cancel"]');
        await checkOneCancelActLoc.isVisible();
        const checkOneCancelText = await checkOneCancelActLoc.innerText();
        expect(checkOneCancelText).toBe("Cancel");

        // Continue Action via 'input#continue' or 'input[data-test="continue"]'
        const checkOneContActLoc = page.locator('input[data-test="continue"]');
        await checkOneContActLoc.isVisible();
        const checkOneContActValue= await checkOneContActLoc.getAttribute("value");
        expect(checkOneContActValue).toBe("Continue");

        // Click Contiue without First, Last, Postal info
        await checkOneContActLoc.click();
        checkOneErrortext = await checkOneErrorLoc.innerText()
        expect(checkOneErrortext).toBe("Error: First Name is required");

        await checkOneErrorBtn.isVisible();
        await checkOneErrorBtn.click()
        
        checkOneErrortext = await checkOneErrorLoc.innerText()
        expect(checkOneErrortext).toBe("");

        // Click Contiue with only First Name having non-empty value
        await checkOneFirstLoc.fill("standard");
        checkOneFirstValue = await checkOneFirstLoc.getAttribute("value");
        expect(checkOneFirstValue).toBe("standard");

        await checkOneContActLoc.click();
        checkOneErrortext = await checkOneErrorLoc.innerText()
        expect(checkOneErrortext).toBe("Error: Last Name is required");

         // Click Contiue with adding Last Name, only Postal is empty
         await checkOneLastLoc.fill("user");
         checkOneLastValue = await checkOneLastLoc.getAttribute("value");
         expect(checkOneLastValue).toBe("user");

        await checkOneContActLoc.click();
        checkOneErrortext = await checkOneErrorLoc.innerText()
        expect(checkOneErrortext).toBe("Error: Postal Code is required");

         // Click Contiue with adding Postal value 
         // Now have First, Last and Postal value expect to be next page
         await checkOnePostalLoc.fill("80201");
         checkOnePostalValue = await checkOnePostalLoc.getAttribute("value");
         expect(checkOnePostalValue).toBe("80201");

         await checkOneContActLoc.click();
         // check on checkout overview page url (step-two)
         const checkTwoURL:string = page.url();
        expect(checkTwoURL).toBe(`${defaultURL}checkout-step-two.html`);
        console.log("Checkout OverView Page")

        // check title text is 'Checkout: Overview'
        const checkTwoTitleLoc:Locator = page.locator('span[data-test="title"]')
        await checkTwoTitleLoc.isVisible()
        const checkTwoTitleText:string = await checkTwoTitleLoc.innerText();
        expect(checkTwoTitleText).toBe("Checkout: Overview")

        const checkTwoLogoLoc:Locator = page.locator('div.app_logo');
        await checkTwoLogoLoc.isVisible()
        const checkTwoLogoText:string = await checkTwoLogoLoc.innerText();
        expect(checkTwoLogoText).toBe("Swag Labs")
        
        const checkTwoCartGroup:Locator = page.locator('div#shopping_cart_container');
        await checkTwoCartGroup.isVisible();
        const checkTwoCartText = await checkTwoCartGroup.innerText();
        console.log(`Check Overview Cart Text ${checkTwoCartText};`)
        expect(checkTwoCartText).toBe(prodCartText);

        // Checkout Overview page has
        // Your Cart item List - each item has QTY, Desc, Price
        // #cart_contents_container > div > div.cart_list > div.cart_quantity_label
        const checkTwoHdrQtyLoc:Locator = page.locator('div.cart_quantity_label')
        await checkTwoHdrQtyLoc.isVisible();
        const checkTwoHdrQtyText = await checkTwoHdrQtyLoc.innerText();
        expect(checkTwoHdrQtyText).toBe("QTY");

        const checkTwoHdrDescLoc:Locator = page.locator('div.cart_desc_label')
        await checkTwoHdrDescLoc.isVisible();
        const checkTwoHdrDescText = await checkTwoHdrDescLoc.innerText();
        expect(checkTwoHdrDescText).toBe("Description");

        const checkTwoItemListLoc = page.locator('div[data-test="inventory-item"]');
        const checkTwoCartCount = await checkTwoItemListLoc.count()
        console.log(`Have ${checkTwoCartCount} Cart Items`);
        expect(checkTwoCartCount).toBe(inCartCount);

        let checkTwoItemTotal:number = 0;
        for (let i=0; i< yourCartCount; i++) {
            const itemLoc:Locator = await cartItemListLoc.nth(i);

            const itemQtyLoc:Locator = await itemLoc.locator('div.cart_quantity');
            const itemQtyText = await itemQtyLoc.innerText();
            const qtyValue:number = Number(itemQtyText);
           
            const itemNameLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-name"]');
            const itemNameText = await itemNameLoc.innerText();
            
            const itemPriceLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-price"]')
            const itemPriceText = await itemPriceLoc.innerText();
            const priceValue:number = parseFloat(itemPriceText.replace('$',''));
            console.log(`item ${i+1}: qty= ${itemQtyText}; name=${itemNameText}; price=${itemPriceText};`);
            checkTwoItemTotal += qtyValue * priceValue;

            const itemDescLoc:Locator = await itemLoc.locator('div[data-test="inventory-item-desc"]');
            const itemDescText = await itemDescLoc.innerText();
            console.log(`item ${i+1}: desc=${itemDescText}`);

        }

        const checkTwoTaxValue:number = Math.round(checkTwoItemTotal * 8) / 100
        const checkTwoTotalValue:number = checkTwoItemTotal + checkTwoTaxValue
        console.log(`Checkout Overview total=${checkTwoItemTotal}; tax=${checkTwoTaxValue}`);

        
        // Payment Label via 'div.summary_info_label.nth(0)' or div[data-test="payment-info-label"]'
        const checkTwoPayLabelLoc = page.locator('div[data-test="payment-info-label"]');
        const checkTwoPayLabelText = await checkTwoPayLabelLoc.innerText();
        expect(checkTwoPayLabelText).toBe('Payment Information:');

        // Payment value via 'div.summary_value_label.nth(0)' or div[data-test="payment-info-value"]'
        const checkTwoPayValueLoc = page.locator('div[data-test="payment-info-value"]');
        const checkTwoPayValueText = await checkTwoPayValueLoc.innerText();
        expect(checkTwoPayValueText).toBe('SauceCard #31337');

        // Shipping Label via 'div.summary_info_label.nth(1)' or div[data-test="shipping-info-label"]'
        const checkTwoShipLabelLoc = page.locator('div[data-test="shipping-info-label"]');
        const checkTwoShipLabelText = await checkTwoShipLabelLoc.innerText();
        expect(checkTwoShipLabelText).toBe('Shipping Information:');

        // Shipping value via 'div.summary_value_label.nth(1)' or div[data-test="shipping-info-value"]'
        const checkTwoShipValueLoc = page.locator('div[data-test="shipping-info-value"]');
        const checkTwoShipValueText = await checkTwoShipValueLoc.innerText();
        expect(checkTwoShipValueText).toBe('Free Pony Express Delivery!');

        // Price Label via 'div.summary_info_label.nth(2)' or div[data-test="total-info-label"]'
        const checkTwoPriceLabelLoc = page.locator('div[data-test="total-info-label"]');
        const checkTwoPriceLabelText = await checkTwoPriceLabelLoc.innerText();
        expect(checkTwoPriceLabelText).toBe('Price Total');

        //    item Total via sum each cart item's QTY*Price
        //      via 'div.summary_subtotal_label' or div[data-test="subtotal-label"]'
        const checkTwoitemTotalLoc = page.locator('div[data-test="subtotal-label"]');
        const checkTwoitemTotalText = await checkTwoitemTotalLoc.innerText();
        const expItemTotalValue = `Item total: $${checkTwoItemTotal}`;
        expect(checkTwoitemTotalText).toBe(expItemTotalValue);

        //    Tax value as 8% of item Total 
        //      via 'div.summary_tax_label' or div[data-test="tax-label"]'
        const checkTwoitemTaxLoc = page.locator('div[data-test="tax-label"]');
        const checkTwoitemTaxText = await checkTwoitemTaxLoc.innerText();
        const expItemTaxValue = `Tax: $${checkTwoTaxValue}`;
        expect(checkTwoitemTaxText).toBe(expItemTaxValue);

        //    Total as item Total plus Tax value
        //      via 'div.summary_total_label' or div[data-test="total-label"]'
        const checkTwoPriceTotLoc = page.locator('div[data-test="total-label"]');
        const checkTwoPriceTotText = await checkTwoPriceTotLoc.innerText();
        const expPriceTotalValue = `Total: $${checkTwoTotalValue}`;
        expect(checkTwoPriceTotText).toBe(expPriceTotalValue);

        // Cancel Button - goes to Products page
        //   via 'button#cancel' or 'button[data-test="cancel"]'
        const checkTwoCancelAct = page.locator('button[data-test="cancel"]');
        await checkTwoCancelAct.isVisible();
        const CheckTwoCancelText:string = await checkTwoCancelAct.innerText();
        expect(CheckTwoCancelText).toBe("Cancel")

        // Finish Button - goes to CheckOut Done page
        // via 'button#finish' 'button[data-test="finish"]'
        const CheckTwoFinshAct = page.locator('button[data-test="finish"]');
        await CheckTwoFinshAct.isVisible();
        const CheckTwoFinshText:string = await CheckTwoFinshAct.innerText();
        expect(CheckTwoFinshText).toBe("Finish")
        await CheckTwoFinshAct.click();

        // check on checkout complete page url
        console.log("Now On Checkout Completed Page")
        const checkDoneURL:string = page.url();
        expect(checkDoneURL).toBe(`${defaultURL}checkout-complete.html`);
        console.log("Checkout Complete Page")

        // check title text is 'Checkout: Complete!'
        const checkDoneTitleLoc:Locator = page.locator('span[data-test="title"]')
        await checkDoneTitleLoc.isVisible()
        const checkDoneTitleText:string = await checkDoneTitleLoc.innerText();
        expect(checkDoneTitleText).toBe("Checkout: Complete!")

        const checkDoneLogoLoc:Locator = page.locator('div.app_logo');
        await checkDoneLogoLoc.isVisible()
        const checkDoneLogoText:string = await checkTwoLogoLoc.innerText();
        expect(checkDoneLogoText).toBe("Swag Labs")
        
        // Done chart is always empty
        const checkDoneCartGroup:Locator = page.locator('div#shopping_cart_container');
        await checkDoneCartGroup.isVisible();
        const checkDoneCartText = await checkDoneCartGroup.innerText();
        console.log(`Check Done Cart Text ${checkDoneCartText};`)
        expect(checkDoneCartText).toBe('');

        // checkout Complete page has
        // Complete-Thankyou text via via 'h2.complete-header' or h2[data-test="complete-header"]'
        const checkDoneThankLoc:Locator = page.locator('h2[data-test="complete-header"]')
        await checkDoneThankLoc.isVisible()
        const checkDoneThankText:string = await checkDoneThankLoc.innerText();
        expect(checkDoneThankText).toBe("Thank you for your order!")

        // Complete-Order-Ship info via via 'div.complete-text' or div[data-test="complete-text"]'
         const checkDoneShipLoc:Locator = page.locator('div[data-test="complete-text"]')
         await checkDoneShipLoc.isVisible()
         const checkDoneShipText:string = await checkDoneShipLoc.innerText();
         expect(checkDoneShipText).toBe("Your order has been dispatched, and will arrive just as fast as the pony can get there!")

        // Back-Home button goes to Inventory Page
        // via 'button#back-to-products' 'button[data-test="back-to-products"]'
        const CheckDoneHomeAct = page.locator('button[data-test="back-to-products"]');
        await CheckDoneHomeAct.isVisible();
        const CheckDoneHomeText:string = await CheckDoneHomeAct.innerText();
        expect(CheckDoneHomeText).toBe("Back Home")

        await CheckDoneHomeAct.click();
        // check Home on Product Inventory Page 
        const homeProdURL:string = page.url();
        expect(homeProdURL).toBe(`${defaultURL}inventory.html`);
        console.log("Back Home to Product-Invetory page")

        const homeProdTitleLoc:Locator = page.locator('span[data-test="title"]')
        await homeProdTitleLoc.isVisible()
        const homeProdTitleText:string = await homeProdTitleLoc.innerText();
        expect(homeProdTitleText).toBe("Products")

        const homeLogoLoc:Locator = page.locator('div.app_logo');
        await homeLogoLoc.isVisible()
        const homeLogoText = await homeLogoLoc.innerText()
        expect(homeLogoText).toBe("Swag Labs")

        // use menu-icon to Logout
        // Note: the Product, Cart and all Checkout pages has menu-icon 
        // via 'div.bm-burger-button > button' when click displays
        const prodMenuIconLoc = page.locator('div.bm-burger-button > button')
        
        // menu-icon click displays
        // menu-item: close menu options 'div.bm-cross-button'
        const menuCloseAct = page.locator('div.bm-cross-button');

        // menu-item: All Items via 'a#inventory_sidebar_link' or 'a[data-test="inventory-sidebar-link"]'
        const menuAllItemsAct = page.locator('a#inventory_sidebar_link');
        
        // menu-item: About via 'a#about_sidebar_link' or 'a[data-test="about-sidebar-link"]'
        const menuAboutAct = page.locator('a#about_sidebar_link');
       
        // menu-item: Logout via 'a#logout_sidebar_link' or 'a[data-test="logout-sidebar-link"]' 
        const menuLogoutAct = page.locator('a#logout_sidebar_link');
       
        //  menu-item: Reset App Stat via 'a#reset_sidebar_link' or 'a[data-test="reset-sidebar-link"]'
        const menuResetAct = page.locator('a#reset_sidebar_link');
        
        // check all menu-item are Visible and thier text
        await prodMenuIconLoc.click();
        await menuCloseAct.isVisible();
        
        await menuAllItemsAct.isVisible()
        const menuAllItemsText:string = await menuAllItemsAct.innerText();
        expect(menuAllItemsText).toBe("All Items")

        await menuAboutAct.isVisible()
        const menuAboutText:string = await menuAboutAct.innerText();
        expect(menuAboutText).toBe("About")

        await menuLogoutAct.isVisible()
        const menuLogoutText:string = await menuLogoutAct.innerText();
        expect(menuLogoutText).toBe("Logout")

        await menuResetAct.isVisible()
        const menuResetText:string = await menuResetAct.innerText();
        expect(menuResetText).toBe("Reset App State")

        await menuLogoutAct.click();
        // check back on Login Page 
        const logoutURL:string = page.url();
        expect(logoutURL).toBe(`${defaultURL}`);

        const logoutLogoLoc:Locator = page.locator('div.login_logo');
        await logoutLogoLoc.isVisible()
        const logoutLogoText = await logoutLogoLoc.innerText()
        expect(logoutLogoText).toBe("Swag Labs")

        const logoutBtnLoc:Locator = page.locator('input#login-button');
        await logoutBtnLoc.isVisible()
        const logoutBtnText = await logoutBtnLoc.getAttribute("value")
        expect(logoutBtnText).toBe("Login")

        // TEMP: force a fail
        // expect(false).toBeTruthy();
    });
 
});
