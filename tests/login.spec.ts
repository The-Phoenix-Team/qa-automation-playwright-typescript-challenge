import { test, expect } from '@playwright/test';
import { ApiRequests } from './utilities/apiRequests';
import { LoginPage } from './pages/loginPage';

test.describe('Login page', () => {

        test.use({storageState: "auth.json"})

    
    test('User able to successfully login and view inventory page', async ({ page }) => {

        const apiRequests = new ApiRequests(page);
        const response = await apiRequests.getResponseAndNavigate('/inventory.html', '/inventory.html')
        expect(response).toBeDefined();

    });

    test('Invalid user is blocked from loggin in', async ({ browser }) => {

        const context = await browser.newContext({ignoreHTTPSErrors: true
        })
        const page = await context.newPage();

        const loginPage = new LoginPage(page);

        
        await loginPage.login('/', 'invaliduser', 'somepassword')
        loginPage.errorMessageVisible();

        await context.close();

    })

});
