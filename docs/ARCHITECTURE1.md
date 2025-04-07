# ✅ Architectural Test Plan – Saucedemo E-Commerce Testing (Playwright + TypeScript)

## 🌟 Objective

Establish a maintainable and scalable automation framework using Playwright and TypeScript to validate core workflows of the Saucedemo e-commerce site. The goal is not exhaustive test coverage, but a **foundation that demonstrates engineering discipline, clarity of thought, and testing strategy** for web apps.

---

## 🧱🧱 Project Architecture

- **Test Runner**: [Playwright Test](https://playwright.dev/docs/test-intro)
- **Language**: TypeScript (strict mode enabled)
- **Design Pattern**: Page Object Model (POM) for encapsulating UI logic
- **Utilities**: `.env` for credentials, `storageState` for session caching

### Project Layout

```
├── tests/
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   └── checkout.spec.ts
├── pages/
│   ├── loginPage.ts
│   ├── productsPage.ts
│   └── checkoutPage.ts
├── utils/
│   ├── helpers.ts
│   ├── item-locators.ts
│   └── test-data.ts
├── scripts/
│   └── generate-product-locators.ts
├── playwright.config.ts
└── .env
```

---

## 🔐 Authentication Strategy

To enable **fluid, reusable logins**, we'll use two approaches:

### ✅ Approach 1: `storageState` Reuse (Preferred for Post-login Tests)

- Log in once with valid credentials and save browser context as `storageState.json`.
- Load this state before running any test that starts after login.
- Ensures blazing fast test setup with no UI login overhead.

### ✅ Approach 2: UI Login (For Login Page Testing)

- Keep `LoginPage.login(username, password)` method for full UI-driven login when needed (e.g., testing error handling, invalid users, etc.).

---

## 🌟 Test Coverage Plan

We target **critical user journeys**:

### ✅ A. Login Tests

-

### ✅ B. Inventory Page Tests

-

### ✅ C. Cart & Checkout Flow

-

---

## 🧐 Best Practices Applied

| Principle                  | Implementation                                            |
| -------------------------- | --------------------------------------------------------- |
| **DRY**                    | Page Object Model with reusable locators and actions      |
| **Separation of Concerns** | Test logic is separate from UI logic                      |
| **Scalability**            | Test data and selectors centralized                       |
| **Readability**            | Test steps are named clearly, in natural language         |
| **Speed**                  | Uses `storageState` to skip UI login for post-login tests |
| **Debuggability**          | Screenshots on failure, structured test output            |

---

## ♻️ Reusable Login Setup Example

In `global.setup.ts`:

```ts
test('setup login session', async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
  await page.context().storageState({ path: 'storageState.json' });
});
```

In `playwright.config.ts`:

```ts
use: {
  storageState: 'storageState.json'
}
```

---

## 📊 Sample Test Scenarios

```ts
test('user can add and remove item from cart', async ({ page }) => {
  const products = new ProductsPage(page);
  await products.addItemToCartByName('backpack');
  await products.removeItemByName('backpack');
  await products.goToCart();
  await expect(page.locator('.cart_item')).toHaveCount(0);
});
```

```ts
test('user can complete checkout', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  await checkout.addItemAndCheckout('bike-light', {
    firstName: 'Test',
    lastName: 'User',
    zip: '12345'
  });
  await expect(page.locator('.complete-header')).toContainText('THANK YOU');
});
```

---

## 📊 Future Enhancements

- Add test tagging (`@smoke`, `@regression`)
- Integrate with CI (GitHub Actions, Jenkins)
- Add visual regression snapshots (via Playwright)
- Hook in Axe-core for accessibility audits
- Parallelize tests and split by context (e.g., desktop vs. mobile)

---

## 🏁 Final Thoughts

This plan is built not to just pass the challenge — but to reflect how testing should be done **in a real-world, team-scale project**: maintainable, performant, and meaningful. It leads with reusability, clarity, and an eye on long-term value.

Happy testing! ✨