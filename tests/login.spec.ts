import { test, expect } from '@playwright/test';
import { ApiRequests } from './utilities/apiRequests';
import { LoginPage } from './pages/loginPage';




test.describe('User One Login page', () => {

        test.use({storageState: "auth/userOne.json"})

    
    test('User able to successfully login and view inventory page', async ({ page }) => {

        const apiRequests = new ApiRequests(page);
        const response = await apiRequests.getHtmlResponseAndNavigate('/?/inventory.html', '/?/inventory.html')
        expect(response).toBeDefined();

    });
});

test.describe('Usertwo login successfully', () => {
    test.use({storageState: "auth/userTwo.json"})

   

        test('User Two able to successfully login and view inventory page', async ({ page }) => {

            const apiRequests = new ApiRequests(page);
            const response = await apiRequests.getHtmlResponseAndNavigate('/?/inventory.html', '/?/inventory.html')
            expect(response).toBeDefined();
    
        });
    

});

test.describe('UserThree login successfully', () => {
    test.use({storageState: "auth/userThree.json"})

    

        test('User Three able to successfully login and view inventory page', async ({ page }) => {

            const apiRequests = new ApiRequests(page);
            const response = await apiRequests.getHtmlResponseAndNavigate('/?/inventory.html', '/?/inventory.html')
            expect(response).toBeDefined();
    
        });
    

});


    test('Invalid user is blocked from loggin in', async ({ browser }) => {

        const context = await browser.newContext({ignoreHTTPSErrors: true
        })
        const page = await context.newPage();

        const loginPage = new LoginPage(page);

        
        await loginPage.login('/', 'invaliduser', 'somepassword')
        loginPage.errorMessageVisible();

        await context.close();

    });


