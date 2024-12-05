import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';

dotenv.config();

async function globalTeardown() {
    console.log('Starting global teardown...');

    const browser = await chromium.launch();
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
    });

    const filePath = 'auth.json';
    try {

        await fs.unlink('auth.json');
        console.log('Authentication state file, auth.json removed')

    } catch (error) {
        console.error('Error in global teardown:', error);
    } finally {
        await context.close();
        await browser.close();
        console.log('Global teardown completed.');
    }
}

export default globalTeardown;

// Run directly and when imported
if (require.main === module) {
    globalTeardown()
        .then(() => console.log('Teardown complete'))
        .catch(console.error);
}
