## This is a port of [jest-puppeteer](https://github.com/argos-ci/jest-puppeteer) to Vitest. Some of the documentation may still refer to Jest specific things so please report any issues.

# vitest-puppeteer

[![npm version](https://img.shields.io/npm/v/vitest-puppeteer.svg)](https://www.npmjs.com/package/vitest-puppeteer)
[![npm dm](https://img.shields.io/npm/dm/vitest-puppeteer.svg)](https://www.npmjs.com/package/vitest-puppeteer)
[![npm dt](https://img.shields.io/npm/dt/vitest-puppeteer.svg)](https://www.npmjs.com/package/vitest-puppeteer)

Vitest environment containing all required configuration for writing integration tests using Puppeteer.

```
npm install vitest-puppeteer puppeteer
```

## Usage

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "puppeteer",
    globalSetup: "node_modules/vitest-environment-puppeteer/dist/global-init.js",
  },
});
```
