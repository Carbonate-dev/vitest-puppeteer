import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["node_modules/**/*"],
    globals: true,
    environment: "./packages/vitest-environment-puppeteer/src/env.ts",
    globalSetup: "./packages/vitest-environment-puppeteer/src/global-init.ts",
  },
});
