import { test, expect } from '@playwright/test';
import { ApiRequests } from './utilities/apiRequests';
import { Inventory } from './pages/inventoryPage';
import { CartPage } from './pages/cartPage';


    const authFiles = ['auth/userOne.json', 'auth/userTwo.json', 'auth/userThree.json'];

        for (const authFile of authFiles) {
          test.describe(`Inventory page tests for user: ${authFile}`, () => {
            test.use({ storageState: authFile });
        
            test.beforeEach(async ({ page }) => {
              const apiRequests = new ApiRequests(page);
              const response = await apiRequests.getHtmlResponseAndNavigate('/?/inventory.html', '/?/inventory.html');
              expect(response).toBeDefined();
            });
    
    test('User able to successfully add items to cart', async ({ page }) => {
        
        const inventory = new Inventory(page)

        await page.getByTitle('Products').isVisible();
        await inventory.addItemToCart(0);
        await inventory.addItemToCart(1);
        await inventory.verifyShoppingCart(2);
    
    });

    test('User is able to successfully remove items from cart', async ({page}) => {

        const inventory = new Inventory(page)

        await page.getByTitle('Products').isVisible();
        await inventory.addItemToCart(2);
        await inventory.addItemToCart(3);
        await inventory.verifyShoppingCart(2);
        await inventory.removeItemFromCart(0);
        await inventory.verifyShoppingCart(1);


    });

    test('User is able to add items to cart and view items on cart page, then remove from item page', async ({page}) => {

        const inventory = new Inventory(page);
        const cartPage = new CartPage(page);

        await page.getByTitle('Products').isVisible();
        await inventory.addItemToCart(5);
        await inventory.addItemToCart(4);
        await inventory.verifyShoppingCart(2);
        await inventory.selectShoppingCart();
        await page.getByTitle('Your Cart').isVisible();
        await cartPage.selectItem('Sauce Labs Onesie');
        await inventory.removeItemFromCart(0);
        await inventory.selectShoppingCart();
        await inventory.verifyShoppingCart(1);
    });


    test('User is able to add items to cart and remove items from cart page and navigate back to product/Inventory page', async ({page}) => {

        const inventory = new Inventory(page);
        const cartPage = new CartPage(page);

        await page.getByTitle('Products').isVisible();
        await inventory.addItemToCart(5);
        await inventory.addItemToCart(4);
        await inventory.addItemToCart(3);
        await inventory.verifyShoppingCart(3);
        await inventory.selectShoppingCart();
        await cartPage.verifyItemList(3)
        await page.getByTitle('Your Cart').isVisible();
        await cartPage.removeItemFromCart(0)
        await cartPage.verifyItemList(2);
        await inventory.verifyShoppingCart(2);
        await cartPage.selectContinueShopping();
        await page.getByTitle('Product').isVisible();
        

    });

    test('User is able to add item to cart and continue to cart then to checkout', async ({page}) => {
        const inventory = new Inventory(page);
        const cartPage = new CartPage(page);

        await page.getByTitle('Products').isVisible();
        await inventory.addItemToCart(1);
        await inventory.addItemToCart(2);
        await inventory.verifyShoppingCart(2);
        await inventory.selectShoppingCart();
        await page.getByTitle('Your Cart').isVisible();
        await cartPage.verifyItemList(2)
        await cartPage.selectCheckout();
        await page.getByTitle('Checkout: Your Information').isVisible();
        
    })
});
};
