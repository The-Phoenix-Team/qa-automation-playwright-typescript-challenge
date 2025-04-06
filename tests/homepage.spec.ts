import { test, expect } from '@playwright/test';

test('To test homepage is loading and has title', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Swag Labs');
});

/*
//Ideally we may check all the input boxes, buttons and important text are presnt

test('To test homepage is loading and has title', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('Swag Labs');
  });

  */