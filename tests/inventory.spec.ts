import { test, expect } from '@playwright/test';
import { ApiRequests } from './utilities/apiRequests';
import { Inventory } from './pages/inventoryPage';

test.beforeEach(async ({page}) => {

        const apiRequests = new ApiRequests(page);
        const response = await apiRequests.getResponseAndNavigate('/inventory.html', '/inventory.html')
        expect(response).toBeDefined();
})
test.describe('Inventory page', () => {

        test.use({storageState: "auth.json"})
    
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


    })
});
