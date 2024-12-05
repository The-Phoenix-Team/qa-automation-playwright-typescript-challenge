# QA Automation Playwright TypeScript

## Coding Challenge Requirements

- Use Playwright for the project.
- Use TypeScript for the project.
- Fork this repository so that you can work on it separately.
- Write tests for https://www.saucedemo.com
- Work out a way to make logins fluid/reusable when testing features on and/or after the login page.
- Lead the path on what should be tested and how it should be tested.
- There's not a requirement to write tests for all features. The goal is to show the team how you can adapt and create. We'll be checking for best practices generally and how you think when working through new Playwright tests.
- To complete the challenge, submit a pull request from your fork to this repository, main branch.
- Have fun! 🎉

## Setup

Note for Windows Users: It's not recommended to run Playwright in WSL. It will run in headless mode fine, yet if wanting to run in UI/headed mode for any reason, it gets very complicated to get the windows to show with lots of extra flaky dependencies.

## Install NVM (Node Version Manager)

See: https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating

Windows users: Download and run an installer found at:
[https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

Install a recent version of npm with nvm.

```
nvm install 20
```

Then use the version of npm specified in terminal output, example:|

```
# example only, use output of terminal
nvm use 20
```

Install Playwright dependencies.

```
npm i
npx playwright install --with-deps
```

Also download new browser binaries and their dependencies:

```
npx playwright install --with-deps
```

## Setting the UI URL

Copy .env.example to .env.

Update `UI_BASE_URL` in .env. Example:

```
UI_BASE_URL="https://www.saucedemo.com/"
```

## How To Run Tests

```
npx playwright test
or
npm run test
```

To see results after completion, run:

```
npx playwright show-report
```

## Run In Headed Mode

See what Playwright is doing when running tests (note, this opens as many windows at once based on number of tests happening in paralell).

```
npx playwright test --headed
```

## Run the Tests in UI Mode

```
npx playwright test --ui
or
npm run test-ui
```

## Run Single Test

```
npx playwright test tests/todo-page.spec.ts
```

## Run Set of Tests

```
npx playwright test tests/todo-page/ tests/landing-page/
```

## Run Test With a Title

```
npx playwright test -g "add a todo item"
```

## Run global setup, then tests separately

```
npx playwright test tests/global.setup.ts --project=setup
```

then

```
npx playwright test tests/admin.spec.ts tests/alert-editor.spec.ts tests/viewer.spec.ts
```

This of course runs setup then tests as usual as with many commands above:

```
npx playwright test
```

Generate code! It's not the full solution for creating tests, yet can help with gathering locators quickly most of the time.

```
npx playwright codegen --ignore-https-errors http://localhost:3000
```

More cool commands:
[https://playwright.dev/docs/running-tests](https://playwright.dev/docs/running-tests)

## How To Update Playwright

```
npm install -D @playwright/test@latest
```

Also download new browser binaries and their dependencies:

```
npx playwright install --with-deps
```

## Playwright Generator

```
npx playwright codegen playwright.dev
```

Also VS Code extension:
https://playwright.dev/docs/getting-started-vscode

More about the inspector
https://playwright.dev/docs/debug#playwright-inspector

## Best Practices

- [9 Playwright Best Practices and Pitfalls to Avoid](https://betterstack.com/community/guides/testing/playwright-best-practices/)
- [https://playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices)
