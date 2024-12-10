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

    const authFilePaths = ['auth.json', 'auth/userOne.json', 'auth/userTwo.json', 'auth/userThree.json'];
    try {

        for (const file of authFilePaths){
        try{
            await fs.unlink(file);
            console.log(`Auth state file ${file} removed]`);
        }catch (error){
            console.warn(`Failed to remove ${file}: `, error.message)
        }
     }
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
