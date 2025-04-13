# 🚪 QA Automation Playwright TypeScript Challenge

Welcome! This is your coding challenge to showcase your skills in end-to-end automation using **Playwright + TypeScript**.

---

## 🚀 Requirements (✅ Completed with Notes)

- ✅ **Use Playwright for the project**\
  → Implemented E2E tests using the Playwright Test Runner and Page Object Model. Used Playwright APIs for browser control, session state, and UI assertions.

- ✅ **Use TypeScript**\
  → All code is written in strongly typed TypeScript with type-safe data structures for users, products, and payments.

- ✅ **Fork this repository to work independently**\
  → Project forked from the original repo and developed locally with multiple branches (`main`, `v01`, `v03`, etc.). Final version pushed to the fork.

- ✅ **Write tests for:** [https://www.saucedemo.com](https://www.saucedemo.com)\
  → Covered login scenarios, cart interactions, inventory validation, and checkout flows using multiple user roles.

- ✅ **Make login reusable across tests and post-login flows**\
  → Implemented session caching via `storageState` with a custom script that logs in users and saves session state in `storage-state/<env>/`. Reused session in all tests to skip UI login.

- ✅ **Choose what to test and how to test it — show best practices**\
  → Followed test design patterns: Page Object Model, grouped tests by feature, data-driven inputs, and positive, negative, and edge case coverage. I also proposed a **modular and data-driven** model where we split validation into discrete flows (login, inventory, cart, checkout, end-to-end full flow). By combining structured inputs with reusable test runners, we can create scalable coverage with no code duplication—just by adding new rows of test data.

- ✅ **Submit pull request from fork to main branch**\
  → Final PR submitted from the fork’s `main` branch. I actually have two branches—submitting the PR with the data-driven approach. I can submit the other branch with my older approach as well, if you'd like to see it.

- ✅ **Have fun! 🎉**\
  → Yes, I genuinely enjoyed the journey. Please feel free to share any feedback.

---

## 🛠️ Project Setup

### ⚠️ Note for Windows Users

Avoid using WSL for Playwright — headed mode is flaky. Use PowerShell or CMD instead.

### 🔠 Install Node via NVM

**macOS/Linux:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20
```

**Windows:** Download and run [nvm-windows](https://github.com/coreybutler/nvm-windows/releases), then:

```cmd
nvm install 20
nvm use 20
```

### 🗓️ Install Playwright & Dependencies

```bash
npm install
npx playwright install --with-deps
```

### 🌍 Configure Environment

1. Copy `.env.example` to `.env` or `.env.<env>`
2. Set your test URL:

```env
UI_BASE_URL="https://www.saucedemo.com"
```

---

## 🔮 Run Tests

### All tests (headless by default)

```bash
npx playwright test
```

### Show report after run

```bash
npx playwright show-report
```

### Run in headed (visible) mode

```bash
npx playwright test --headed
```

### Open Playwright UI test runner

```bash
npx playwright test --ui
```

### Run a specific test file

```bash
npx playwright test tests/login.spec.ts
```

### Run by test title

```bash
npx playwright test -g "add item to cart"
```

---

## 🔐 Generate Storage State (Reusable Sessions)

This script logs in each user and saves their session to `storage-state/<env>/`.

### ✅ Prerequisites

Ensure `utils/test-data.ts` contains:

```ts
export const users = {
  standard_user: { username: "standard_user", password: "secret_sauce" },
  locked_out_user: { username: "locked_out_user", password: "secret_sauce" },
  problem_user: { username: "problem_user", password: "secret_sauce" },
  // ...
};
```

### ▶️ Run Script

**macOS/Linux/Windows PowerShell:**

```bash
ENV_NAME=demo npx ts-node scripts/generate-storage-states.cts
```

**Windows CMD:**

```cmd
set ENV_NAME=demo && npx ts-node scripts/generate-storage-states.cts
```

✅ Automatically creates the `storage-state/<env>` folder

### 📂 Output

```bash
storage-state/demo/standard_user.json
storage-state/demo/problem_user.json
```

### ♻️ Cookie Expiry

- Sets expiry to 1 year from now
- Skips regeneration if the cookie is valid for ≥ 24 hours

### ⚠️ Disclaimer

> Tested on **macOS**. Windows/Linux may need shell tweaks.

---

## 🧪 Bonus: Generate Product Locator Map

This script is useful for regenerating the list of product locators dynamically from the SauceDemo inventory page.

### 🔄 What It Does:

1. Launches the browser
2. Logs in with `standard_user`
3. Navigates to the inventory page
4. Scrapes all `add-to-cart` button selectors
5. Creates a clean, normalized locator map
6. Writes the output to `utils/products-data.ts`
7. ⚠️ Overwrites the file if it exists

### 💻 Prerequisites

```bash
npm install --save-dev ts-node @types/node
```

### ▶️ How to Run It

From project root:

```bash
ENV_NAME=demo npx ts-node scripts/generate-product-locators.ts
```

---

## 📁 Modular Test Matrices

Test design has been broken into reusable modules:

### 🔐 Login Test Matrix

```ts
export const loginMatrix = [
  { scenarioName: "Standard user completes login", user: users.standard_user, expectedOutcome: "success" },
  { scenarioName: "Locked out user login blocked", user: users.locked_out_user, expectedOutcome: "failure" },
  { scenarioName: "Problem user login proceeds", user: users.problem_user, expectedOutcome: "success" }
];
```

### 📦 Inventory Matrix

```ts
export const inventoryMatrix = [
  {
    scenarioName: "Standard user sees all 6 products",
    user: users.standard_user,
    expectedProducts: ["Sauce Labs Backpack", "Sauce Labs Bike Light", "Sauce Labs Bolt T-Shirt", "Sauce Labs Fleece Jacket", "Sauce Labs Onesie", "Test.allTheThings() T-Shirt (Red)"],
    expectedOutcome: "success"
  },
  {
    scenarioName: "Problem user sees broken inventory",
    user: users.problem_user,
    expectedProducts: [],
    expectedOutcome: "failure"
  }
];
```

### 📜 Checkout Matrix

```ts
export const checkoutMatrix = [
  {
    scenarioName: "Valid checkout with full info",
    user: users.standard_user,
    payment: { firstName: "John", lastName: "Doe", zip: "12345" },
    expectedOutcome: "success"
  },
  {
    scenarioName: "Missing first name fails checkout",
    user: users.standard_user,
    payment: { firstName: "", lastName: "Doe", zip: "12345" },
    expectedOutcome: "failure"
  }
];
```

### 🔀 End-to-End Matrix

```ts
export const endToEndMatrix = [
  {
    scenarioName: "Standard user completes checkout with 1 item",
    user: users.standard_user,
    cartItems: ["sauce-labs-backpack"],
    payment: { firstName: "John", lastName: "Doe", zip: "12345" },
    expectedOutcome: "success"
  },
  {
    scenarioName: "Problem user checkout fails",
    user: users.problem_user,
    cartItems: [],
    payment: { firstName: "Prob", lastName: "Lem", zip: "00000" },
    expectedOutcome: "failure"
  }
];
```

---

## 🧰 Feedback Incorporated & Enhancements

- ✅ All reviewer feedback has been addressed
- ✅ Redundant code and hardcoded login flows were replaced with session-based architecture
- ✅ Proposed a **data-driven model** for test expansion

By combining multiple user roles, product flows, and input variations into structured test matrices, we can create:

- 📊 High test coverage with less code
- ✅ Easy addition of new cases without modifying test logic
- 📊 Scalable CI/CD-friendly regression suites

---

## 💚 Thank You!

Looking forward to your feedback on this approach. Happy to iterate further or walk through the design.

Sharif


