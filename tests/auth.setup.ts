import { test as setup, expect} from '@playwright/test'
import { LoginPage } from "./pages/loginPage";

const baseUrl = process.env.UI_BASE_URL || '';

const userOne = process.env.UI_USERNAME || '';
const userOnePassword = process.env.UI_PASSWORD || '';
const userOneAuth = "auth/userOne.json"

const userTwo = process.env.UI2_USERNAME || '';
const userTwoPassword = process.env.UI2_PASSWORD || '';
const userTwoAuth = "auth/userTwo.json"

const userThree = process.env.UI3_USERNAME || '';
const userThreePassword = process.env.UI3_PASSWORD || '';
const userThreeAuth = "auth/userThree.json"

setup("Signin as User One", async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(baseUrl, userOne, userOnePassword);

    await page.context().storageState({path: userOneAuth});
})

setup("Signin as User Two", async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(baseUrl, userTwo, userTwoPassword);

    await page.context().storageState({path: userTwoAuth});
})

setup("Signin as User Three", async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(baseUrl, userThree, userThreePassword);

    await page.context().storageState({path: userThreeAuth});
})
