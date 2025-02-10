# vitest-environment-puppeteer

[![npm version](https://img.shields.io/npm/v/vitest-environment-puppeteer.svg)](https://www.npmjs.com/package/vitest-environment-puppeteer)
[![npm dm](https://img.shields.io/npm/dm/vitest-environment-puppeteer.svg)](https://www.npmjs.com/package/vitest-environment-puppeteer)
[![npm dt](https://img.shields.io/npm/dt/vitest-environment-puppeteer.svg)](https://www.npmjs.com/package/vitest-environment-puppeteer)

Run your tests using Jest & Puppeteer 🎪✨

```
npm install vitest-environment-puppeteer puppeteer
```

## Usage

Update your Jest configuration:

```json
{
  "globalSetup": "vitest-environment-puppeteer/setup",
  "globalTeardown": "vitest-environment-puppeteer/teardown",
  "testEnvironment": "vitest-environment-puppeteer"
}
```

Use Puppeteer in your tests:

```js
describe("Google", () => {
  beforeAll(async () => {
    await page.goto("https://google.com");
  });

  it('should display "google" text on page', async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain("google");
  });
});
```

## TypeScript Setup

If you’re using TypeScript, `vitest-puppeteer` natively supports it from version `8.0.0`. To get started with TypeScript, follow these steps:

1. Make sure your project is using the correct type definitions. If you’ve upgraded to version `10.1.2` or above, uninstall old types:

```bash
npm uninstall --save-dev @types/vitest-environment-puppeteer @types/expect-puppeteer
```

2. Install `@types/jest` (`vitest-puppeteer` does not support `@jest/globals`) :

```bash
npm install --save-dev @types/jest
```

3. Import the `vitest-puppeteer` module to expose the global API :

```ts
import "vitest-puppeteer";
```

## API

### `global.browser`

Give access to the [Puppeteer Browser](https://pptr.dev/api/puppeteer.browser).

```js
it("should open a new page", async () => {
  const page = await browser.newPage();
  await page.goto("https://google.com");
});
```

### `global.page`

Give access to a [Puppeteer Page](https://pptr.dev/api/puppeteer.page) opened at start (you will use it most of time).

```js
it("should fill an input", async () => {
  await page.type("#myinput", "Hello");
});
```

### `global.context`

Give access to a [browser context](https://pptr.dev/api/puppeteer.browsercontext) that is instantiated when the browser is launched. You can control whether each test has its own isolated browser context using the `browserContext` option in config.

### `global.vitestPuppeteer.debug()`

Put test in debug mode.

- Jest is suspended (no timeout)
- A `debugger` instruction to Chromium, if Puppeteer has been launched with `{ devtools: true }` it will stop

```js
it("should put test in debug mode", async () => {
  await vitestPuppeteer.debug();
});
```

### `global.vitestPuppeteer.resetPage()`

Reset global.page

```js
beforeEach(async () => {
  await vitestPuppeteer.resetPage();
});
```

### `global.vitestPuppeteer.resetBrowser()`

Reset global.browser, global.context, and global.page

```js
beforeEach(async () => {
  await vitestPuppeteer.resetBrowser();
});
```

### Config

Jest Puppeteer uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration file support. This means you can configure Jest Puppeteer via (in order of precedence):

- A `"vitest-puppeteer"` key in your `package.json` file.
- A `.vitest-puppeteerrc` file written in JSON or YAML.
- A `.vitest-puppeteerrc.json`, `.vitest-puppeteerrc.yml`, `.vitest-puppeteerrc.yaml`, or `.vitest-puppeteerrc.json5` file.
- A `.vitest-puppeteerrc.js`, `.vitest-puppeteerrc.cjs`, `vitest-puppeteer.config.js`, or `vitest-puppeteer.config.cjs` file that exports an object using `module.exports`.
- A `.vitest-puppeteerrc.toml` file.

By default it looks for config at the root of the project. You can define a custom path using `VITEST_PUPPETEER_CONFIG` environment variable.

It should export a config object or a Promise that returns a config object.

```ts
interface VitestPuppeteerConfig {
  /**
   * Puppeteer connect options.
   * @see https://pptr.dev/api/puppeteer.connectoptions
   */
  connect?: ConnectOptions;
  /**
   * Puppeteer launch options.
   * @see https://pptr.dev/api/puppeteer.launchoptions
   */
  launch?: PuppeteerLaunchOptions;
  /**
   * Server config for `vitest-dev-server`.
   * @see https://www.npmjs.com/package/vitest-dev-server
   */
  server?: JestDevServerConfig | JestDevServerConfig[];
  /**
   * Allow to run one browser per worker.
   * @default false
   */
  browserPerWorker?: boolean;
  /**
   * Browser context to use.
   * @default "default"
   */
  browserContext?: "default" | "incognito";
  /**
   * Exit on page error.
   * @default true
   */
  exitOnPageError?: boolean;
  /**
   * Use `runBeforeUnload` in `page.close`.
   * @see https://pptr.dev/api/puppeteer.page.close
   * @default false
   */
  runBeforeUnloadOnClose?: boolean;
}
```

#### Sync config

```js
// vitest-puppeteer.config.cjs

/** @type {import('packages/vitest-environment-puppeteer').VitestPuppeteerConfig} */
module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== "false",
  },
  server: {
    command: "node server.js",
    port: 4444,
    launchTimeout: 10000,
    debug: true,
  },
};
```

#### Async config

This example uses an already running instance of Chrome by passing the active web socket endpoint to `connect`. This is useful, for example, when you want to connect to Chrome running in the cloud.

```js
// vitest-puppeteer.config.cjs
const dockerHost = "http://localhost:9222";

async function getConfig() {
  const data = await fetch(`${dockerHost}/json/version`).json();
  const browserWSEndpoint = data.webSocketDebuggerUrl;
  /** @type {import('packages/vitest-environment-puppeteer').VitestPuppeteerConfig} */
  return {
    connect: {
      browserWSEndpoint,
    },
    server: {
      command: "node server.js",
      port: 3000,
      launchTimeout: 10000,
      debug: true,
    },
  };
}

module.exports = getConfig();
```

## Create custom environment

It is possible to create a custom environment from the Jest Puppeteer's one. It is not different from creating a custom environment from "jest-environment-node". See [Jest `testEnvironment` documentation](https://jestjs.io/docs/configuration#testenvironment-string) to learn more about it.

```js
// my-custom-environment
const VitestPuppeteerEnvironment =
  require("packages/vitest-environment-puppeteer").TestEnvironment;

class CustomEnvironment extends VitestPuppeteerEnvironment {
  // Implement your own environment
}
```

## Inspiration

Thanks to Fumihiro Xue for his great [Jest example](https://github.com/xfumihiro/vitest-puppeteer-example).
