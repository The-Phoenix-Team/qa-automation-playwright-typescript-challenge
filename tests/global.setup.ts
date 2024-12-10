import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from './pages/loginPage';

dotenv.config();

//Define user types. If there are more types, we can add here later. Idea is if we have different types of testing users
//Super Admin, or other test users. For this demo - used the error user for saucedemo.
export enum User {
    DEFAULT = 'DEFAULT',
    ERROR = 'ERROR',
}

//Map env variables to user credentials
export const UserType: Record<User, { username: string; password: string }> = {
    [User.DEFAULT]: {
        username: process.env.UI_USERNAME || '',
        password: process.env.UI_PASSWORD || '',
    },
    [User.ERROR]: {
        username: process.env.UI2_USERNAME || '',
        password: process.env.UI2_PASSWORD || '',
    },
};


async function globalSetup() {

    console.log('Starting global setup...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();

    try {

        const baseUrl = process.env.UI_BASE_URL || '';

        //Choose the userType based on what is set in .env file. Otherwise, defaults to DEFAULT if not specified.
        const userType = process.env.USER_TYPE as User || User.DEFAULT;
        const userCredentials = UserType[userType];

        if (!userCredentials.username || !userCredentials.password) {
            throw new Error(`Missing credentials for user type: ${userType}`);
        }

        const loginPage = new LoginPage(page);

        console.log(`Logging in as ${userType}...`);
        await loginPage.login(baseUrl, userCredentials.username, userCredentials.password);

        await context.storageState({path: 'auth.json'})
        console.log('Authentication state is now saved');


        
    } catch (error) {
        console.error('Error in global setup:', error);
        throw error;
    } finally {
        await context.close();
        await browser.close();
    }
}

export default globalSetup;
