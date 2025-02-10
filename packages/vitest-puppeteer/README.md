## This is a port of [jest-puppeteer](https://github.com/argos-ci/jest-puppeteer) to Vitest. Some of the documentation may still refer to Jest specific things so please report any issues.

# vitest-puppeteer

[![npm version](https://img.shields.io/npm/v/jest-puppeteer.svg)](https://www.npmjs.com/package/jest-puppeteer)
[![npm dm](https://img.shields.io/npm/dm/jest-puppeteer.svg)](https://www.npmjs.com/package/jest-puppeteer)
[![npm dt](https://img.shields.io/npm/dt/jest-puppeteer.svg)](https://www.npmjs.com/package/jest-puppeteer)

Vitest environment containing all required configuration for writing integration tests using Puppeteer.

```
npm install vitest-puppeteer puppeteer
```

## Usage

```js
// jest.config.js
module.exports = {
  preset: "jest-puppeteer",
};
```
