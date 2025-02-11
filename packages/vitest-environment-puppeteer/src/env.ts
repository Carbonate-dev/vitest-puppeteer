/* eslint-disable no-debugger */
import { readConfig } from "./config.js";
import { blockStdin } from "./stdin.js";
import { connectBrowserFromWorker } from "./browsers.js";
import type { VitestPuppeteerConfig } from "./config.js";
import type { Page, BrowserContext, Browser } from "puppeteer-core";
import { Environment } from "vitest";

type VitestPuppeteer = {
  debug: () => Promise<void>;
  resetPage: () => Promise<void>;
  resetBrowser: () => Promise<void>;
};

type StrictGlobal = {
  browser?: Browser | undefined;
  page?: Page | undefined;
  context?: BrowserContext | undefined;
  puppeteerConfig: VitestPuppeteerConfig;
  vitestPuppeteer: VitestPuppeteer;
};

export type VitestPuppeteerGlobal = Required<StrictGlobal>;

const testTimeoutSymbol = Symbol.for("TEST_TIMEOUT_SYMBOL");

const handlePageError = (error: Error) => {
  process.emit("uncaughtException", error);
};

const getBrowser = (global: StrictGlobal) => {
  if (!global.browser) {
    throw new Error("Cannot access browser before launching browser.");
  }
  return global.browser;
};

const getContext = (global: StrictGlobal) => {
  if (!global.context) {
    throw new Error("Cannot access context before launching context.");
  }
  return global.context;
};

const connectBrowser = async (global: StrictGlobal) => {
  if (global.browser) {
    throw new Error("Cannot connect browser before closing previous browser.");
  }
  global.browser = await connectBrowserFromWorker(global.puppeteerConfig);
};

const disconnectBrowser = async (global: StrictGlobal) => {
  if (!global.browser) return;
  await global.browser.disconnect();
  global.browser = undefined;
};

const getPage = (global: StrictGlobal) => {
  if (!global.page) {
    throw new Error("Cannot access page before launching browser.");
  }
  return global.page;
};

const openPage = async (global: StrictGlobal) => {
  if (global.page) {
    throw new Error("Cannot open page before closing previous page.");
  }
  const page = await getContext(global).newPage();
  if (global.puppeteerConfig.exitOnPageError) {
    page.on("pageerror", handlePageError);
  }
  global.page = page;
};

const closePage = async (global: StrictGlobal) => {
  if (!global.page) return;
  if (global.puppeteerConfig.exitOnPageError) {
    global.page.off("pageerror", handlePageError);
  }
  await global.page.close({
    runBeforeUnload: Boolean(global.puppeteerConfig.runBeforeUnloadOnClose),
  });
  global.page = undefined;
};

const createContext = async (global: StrictGlobal) => {
  if (global.context) {
    throw new Error("Cannot create context before closing previous context.");
  }
  const configBrowserContext =
    global.puppeteerConfig.browserContext ?? "default";
  const browser = getBrowser(global);
  switch (configBrowserContext) {
    case "default":
      global.context = browser.defaultBrowserContext();
      break;
    case "incognito":
      global.context =
        "createBrowserContext" in browser
          ? // API for Puppeteer v22+
            await browser.createBrowserContext()
          : // @ts-expect-error // API for Puppeteer <= v21
            await browser.createIncognitoBrowserContext();
      break;
    default:
      throw new Error(
        `browserContext should be either 'incognito' or 'default'. Received '${configBrowserContext}'`,
      );
  }
};

const closeContext = async (global: StrictGlobal) => {
  if (!global.context) return;
  const browser = getBrowser(global);
  // If a custom context was created, close it
  if (global.context !== browser.defaultBrowserContext()) {
    await global.context.close();
  }
  global.context = undefined;
};

const initAll = async (global: StrictGlobal) => {
  await connectBrowser(global);
  await createContext(global);
  await openPage(global);
};

const closeAll = async (global: StrictGlobal) => {
  await closePage(global);
  await closeContext(global);
  await disconnectBrowser(global);
};

export const PuppeteerEnvironment = <Environment>{
  name: "puppeteer",
  transformMode: "ssr",
  async setup(global) {
    global.puppeteerConfig = await readConfig();
    global.vitestPuppeteer = {
      debug: async () => {
        // Set timeout to 4 days
        global[testTimeoutSymbol] = 345600000;
        // Run a debugger (in case Puppeteer has been launched with `{ devtools: true }`)
        await getPage(global).evaluate(() => {
          debugger;
        });
        return blockStdin();
      },
      resetPage: async () => {
        await closePage(global);
        await openPage(global);
      },
      resetBrowser: async () => {
        await closeAll(global);
        await initAll(global);
      },
    };
    await initAll(global);

    return {
      async teardown() {
        await closeAll(global);
      },
    };
  },
};

export default PuppeteerEnvironment;
