/* BUNUS when we have lot of products 

This script can be run whenever we need to refresh full product list
This script does the following
1. Launch the browser.
2. Log into saucedemo.com.
3. Visit the inventory page.
4. Scrape all add-to-cart buttons.
5. Generate a clean, human-readable locator map.
6. Saves it to utils/products-data.ts
7. CAUTION: it will overwrite previous data
make sure you have
npm install ts-node @types/node --save-dev

How to run it

npx ts-node path-to-this-script/generate-product-locators.ts
e.g. project-root
npx ts-node utils/generate-product-locators.ts

*/

// TBD 
// const outputPath = path.join(__dirname, '../utils/products-data.ts');


import { chromium } from '@playwright/test';
import fs from 'fs';
//import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.waitForSelector('[data-test^="add-to-cart"]');

  const buttons = await page.$$('[data-test^="add-to-cart"]');
  const map: { [key: string]: string } = {};

  for (const btn of buttons) {
    const dataTest = await btn.getAttribute('data-test');
    if (!dataTest) continue;

    const rawName = dataTest.replace('add-to-cart-', '');
    const key = rawName
      .replace(/sauce-labs-/, '')
      .replace(/test\.allthethings\(\)/, 'red')
      .replace(/t-shirt/g, 'tshirt')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();

    map[key] = `[data-test="${dataTest}"]`;
  }

  // ✅ THIS WORKS IN COMMONJS
  // const outputPath = path.join(__dirname, '../utils/products-data.ts');
  // Wanted to write data in utils dir but facing issues, so for now write in the same dir

  const outputPath = 'products-data.ts';

  const content =
    `export const itemLocators: { [key: string]: string } = ${JSON.stringify(map, null, 2)};\n`;

  fs.writeFileSync(outputPath, content);
  console.log(`✅ Locator map saved to ${outputPath}`);

  await browser.close();
})();
