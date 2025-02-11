/* eslint-disable no-console, no-var */
import {
  setup as setupServer,
  teardown as teardownServer,
  ERROR_TIMEOUT,
  ERROR_NO_COMMAND,
} from "vitest-dev-server";
import chalk from "chalk";
import { closeBrowsers, startBrowsers } from "./browsers.js";
import { VitestPuppeteerConfig, readConfig } from "./config.js";
import type { Browser } from "puppeteer-core";
import { GlobalSetupContext } from "vitest/node";

type Context = {
  config?: VitestPuppeteerConfig;
  browsers?: Browser[];
  servers?: Awaited<ReturnType<typeof setupServer>>;
};

declare global {
  var __jestPptr: Context | undefined;
}

export const setup = async ({ config: viConfig }: GlobalSetupContext) => {
  globalThis.__jestPptr = globalThis.__jestPptr || {};
  const ctx = globalThis.__jestPptr;

  if (!ctx.config) {
    const config = await readConfig();
    ctx.config = config;
  }

  const config = ctx.config;

  if (!ctx.browsers) {
    const browsers = await startBrowsers({
      config,
      viConfig,
    });
    ctx.browsers = browsers;
  }

  if (config.server && !ctx.servers) {
    try {
      const servers = await setupServer(config.server);
      ctx.servers = servers;
    } catch (error) {
      /* eslint-disable no-fallthrough */
      switch (error.code) {
        case ERROR_TIMEOUT: {
          console.log("");
          console.error(chalk.red(error.message));
          console.error(
            chalk.blue(
              `\n☝️ You can set "server.launchTimeout" in vitest-puppeteer.config.js`,
            ),
          );
          process.exit(1);
        }
        case ERROR_NO_COMMAND: {
          console.log("");
          console.error(chalk.red(error.message));
          console.error(
            chalk.blue(
              `\n☝️ You must set "server.command" in vitest-puppeteer.config.js`,
            ),
          );
          process.exit(1);
        }
        default: {
          throw error;
        }
      }
      /* eslint-enable no-fallthrough */
    }
  }
};

export const teardown = async () => {
  const ctx = globalThis.__jestPptr;

  if (!ctx || !ctx.config) return;

  if (ctx.browsers) {
    await closeBrowsers(ctx.config, ctx.browsers);
    delete ctx.browsers;
  }

  if (ctx.servers) {
    await teardownServer(ctx.servers);
    delete ctx.servers;
  }
};
