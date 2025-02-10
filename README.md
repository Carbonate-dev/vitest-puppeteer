## This is a port of [jest-puppeteer](https://github.com/argos-ci/jest-puppeteer) to Vitest. Some of the documentation may still refer to Jest specific things so please report any issues.



# 🎪 vitest-puppeteer

[![npm version](https://img.shields.io/npm/v/vitest-puppeteer.svg)](https://www.npmjs.com/package/vitest-puppeteer)
[![npm downloads](https://img.shields.io/npm/dm/vitest-puppeteer.svg)](https://www.npmjs.com/package/vitest-puppeteer)

`vitest-puppeteer` is a Vitest preset designed for seamless integration with Puppeteer, enabling end-to-end testing in a browser environment. With a simple API, it allows you to launch browsers and interact with web pages, making it perfect for testing UI interactions in web applications.

## Table of Contents

1. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Basic Setup](#basic-setup)
   - [Writing Your First Test](#writing-your-first-test)
   - [TypeScript Setup](#typescript-setup)
   - [Visual Testing with Argos](#visual-testing-with-argos)
2. [Recipes](#recipes)
   - [Using `expect-puppeteer`](#using-expect-puppeteer)
   - [Debugging Tests](#debugging-tests)
   - [Automatic Server Management](#automatic-server-management)
   - [Customizing the Puppeteer Instance](#customizing-the-puppeteer-instance)
   - [Custom Test Setup](#custom-test-setup)
   - [Extending `PuppeteerEnvironment`](#extending-puppeteerenvironment)
   - [Global Setup and Teardown](#global-setup-and-teardown)
3. [vitest-puppeteer Configuration](#vitest-puppeteer-configuration)
4. [API Reference](#api-reference)
5. [Troubleshooting](#troubleshooting)
6. [Acknowledgements](#acknowledgements)

## Getting Started

### Installation

To start using `vitest-puppeteer`, you’ll need to install the following packages:

```bash
npm install --save-dev vitest-puppeteer puppeteer vitest
```

This will install Vitest (the testing framework), Puppeteer (the headless browser tool), and `vitest-puppeteer` (the integration between the two).

### Basic Setup

In your Vitest configuration file (`vitest.config.js`), add `vitest-puppeteer` as the `environment` and `globalSetup`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "./vitest-environment-puppeteer/dist/env.ts",
    globalSetup: "./vitest-environment-puppeteer/dist/global-init.ts",
  },
});
```

This will configure Vitest to use Puppeteer for running your tests.

### Writing Your First Test

Once you’ve configured Vitest, you can start writing tests using Puppeteer’s `page` object, which is automatically provided by `vitest-puppeteer`.

Create a test file (e.g., `google.test.js`):

```js
import "expect-puppeteer";

describe("Google Homepage", () => {
  beforeAll(async () => {
    await page.goto("https://google.com");
  });

  it('should display "google" text on page', async () => {
    await expect(page).toMatchTextContent(/Google/);
  });
});
```

This example test navigates to Google’s homepage and checks if the page contains the word "Google". `vitest-puppeteer` simplifies working with Puppeteer by exposing the `page` object, allowing you to write tests using a familiar syntax.

### TypeScript Setup

If you’re using TypeScript, make sure to include `vitest-puppeteer` to include the necessary type definitions.

```ts
import "vitest-puppeteer";
import "expect-puppeteer";

describe("Google Homepage", (): void => {
  beforeAll(async (): Promise<void> => {
    await page.goto("https://google.com");
  });

  it('should display "google" text on page', async (): Promise<void> => {
    await expect(page).toMatchTextContent(/Google/);
  });
});
```

### Visual Testing with Argos

[Argos](https://argos-ci.com) is a powerful tool for visual testing, allowing you to track visual changes introduced by each pull request. By integrating Argos with `vitest-puppeteer`, you can easily capture and compare screenshots to maintain the visual consistency of your application.

To get started, check out the [Puppeteer Quickstart Guide](https://argos-ci.com/docs/quickstart/puppeteer).

## Recipes

### Using `expect-puppeteer`

Writing tests with Puppeteer’s core API can be verbose. The `expect-puppeteer` library simplifies this by adding custom matchers, such as checking for text content or interacting with elements. Some examples:

- Assert that a page contains certain text:

```js
await expect(page).toMatchTextContent("Expected text");
```

- Simulate a button click:

```js
await expect(page).toClick("button", { text: "Submit" });
```

- Fill out a form:

```js
await expect(page).toFillForm('form[name="login"]', {
  username: "testuser",
  password: "password",
});
```

### Debugging Tests

Debugging can sometimes be tricky in headless browser environments. `vitest-puppeteer` provides a helpful `debug()` function, which pauses test execution and opens the browser for manual inspection:

```js
await vitestPuppeteer.debug();
```

To prevent the test from timing out, increase Vitest’s timeout:

```js
vi.setTimeout(300000); // 5 minutes
```

This can be particularly useful when you need to step through interactions or inspect the state of the page during test execution.

### Automatic Server Management

If your tests depend on a running server (e.g., an Express app), you can configure `vitest-puppeteer` to automatically start and stop the server before and after tests:

```js
export default {
  server: {
    command: "node server.js",
    port: 4444,
  },
};
```

This eliminates the need to manually manage your server during testing.

### Customizing the Puppeteer Instance

You can easily customize the Puppeteer instance used in your tests by modifying the `vitest-puppeteer.config.js` file. For example, if you want to launch Firefox instead of Chrome:

```js
export default {
  launch: {
    browser: "firefox",
    headless: process.env.HEADLESS !== "false",
  },
};
```

This file allows you to configure browser options, set up browser contexts, and more.

### vitest-puppeteer Configuration

vitest-puppeteer supports various configuration formats through [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), allowing flexible ways to define your setup. By default, the configuration is looked for at the root of your project, but you can also define a custom path using the `VITEST_PUPPETEER_CONFIG` environment variable.

Possible configuration formats:

- A `"vitest-puppeteer"` key in your `package.json`.
- A `.vitest-puppeteerrc` file (JSON, YAML, or JavaScript).
- A `.vitest-puppeteer.config.js` or `.vitest-puppeteer.config.cjs` file that exports a configuration object.

Example of a basic configuration file (`vitest-puppeteer.config.js`):

```js
export default {
  launch: {
    headless: process.env.HEADLESS !== "false",
    dumpio: true, // Show browser console logs
  },
  browserContext: "default", // Use "incognito" if you want isolated sessions per test
  server: {
    command: "node server.js",
    port: 4444,
    launchTimeout: 10000,
    debug: true,
  },
};
```

You can further extend this configuration to connect to a remote instance of Chrome or customize the environment for your test runs.

## API Reference

vitest-puppeteer exposes several global objects and methods to facilitate test writing:

- **`global.browser`**: Provides access to the Puppeteer [Browser](https://pptr.dev/api/puppeteer.browser/) instance.

  Example:

  ```js
  const page = await browser.newPage();
  await page.goto("https://example.com");
  ```

- **`global.page`**: The default Puppeteer [Page](https://pptr.dev/api/puppeteer.page/) object, automatically created and available in tests.

  Example:

  ```js
  await page.type("#input", "Hello World");
  ```

- **`global.context`**: Gives access to the [browser context](https://pptr.dev/api/puppeteer.browsercontext/), useful for isolating tests in separate contexts.

- **`global.expect(page)`**: The enhanced `expect` API provided by `expect-puppeteer`. You can use this to make assertions on the Puppeteer `page`.

  Example:

  ```js
  await expect(page).toMatchTextContent("Expected text on page");
  ```

- **`global.vitestPuppeteer.debug()`**: Suspends test execution, allowing you to inspect the browser and debug.

  Example:

  ```js
  await vitestPuppeteer.debug();
  ```

- **`global.vitestPuppeteer.resetPage()`**: Resets the `page` object before each test.

  Example:

  ```js
  beforeEach(async () => {
    await vitestPuppeteer.resetPage();
  });
  ```

- **`global.vitestPuppeteer.resetBrowser()`**: Resets the `browser`, `context`, and `page` objects, ensuring a clean slate for each test.

  Example:

  ```js
  beforeEach(async () => {
    await vitestPuppeteer.resetBrowser();
  });
  ```

These methods simplify the setup and teardown process for tests, making it easier to work with Puppeteer in a Vitest environment.

## Troubleshooting

### CI Timeout Issues

In CI environments, tests may occasionally time out due to limited resources. vitest-puppeteer allows you to control the number of workers used to run tests. Running tests serially can help avoid these timeouts:

Run tests in a single process:

```bash
vitest run --no-file-parallelism
```

Alternatively, you can limit the number of parallel workers:

```bash
jest --maxWorkers=2
```

This ensures that your CI environment doesn’t get overloaded by too many concurrent processes, which can improve the reliability of your tests.

### Debugging CI Failures

Sometimes, failures happen only in CI environments and not locally. In such cases, use the `debug()` method to open a browser during CI runs and inspect the page manually:

```js
await vitestPuppeteer.debug();
```

To avoid test timeouts in CI, set a larger timeout during the debugging process:

```js
vitest.setTimeout(600000); // 10 minutes
```

### Preventing ESLint Errors with Global Variables

vitest-puppeteer introduces global variables like `page`, `browser`, `context`, etc., which ESLint may flag as undefined. You can prevent this by adding these globals to your ESLint configuration:

```js
// .eslintrc.js
export default {
  env: {
    jest: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    puppeteerConfig: true,
    vitestPuppeteer: true,
  },
};
```

This configuration will prevent ESLint from throwing errors about undefined globals.

## Acknowledgements

Special thanks to [Fumihiro Xue](https://github.com/xfumihiro) for providing an excellent [Jest Puppeteer example](https://github.com/xfumihiro/vitest-puppeteer-example), which served as an inspiration for this package.
