import { cosmiconfig } from "cosmiconfig";
import type { ConnectOptions, PuppeteerLaunchOptions } from "puppeteer";
import type { Config as VitestDevServerConfig } from "vitest-dev-server";

export interface VitestPuppeteerConfig {
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
  server?: VitestDevServerConfig | VitestDevServerConfig[];
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

const DEFAULT_CONFIG: VitestPuppeteerConfig = {
  browserContext: "default",
  exitOnPageError: true,
};

const explorer = cosmiconfig("vitest-puppeteer");

const getDefaultConfig = () => {
  if (process.env.CI) {
    return {
      ...DEFAULT_CONFIG,
      launch: {
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
        ],
      } as VitestPuppeteerConfig["launch"],
    };
  }
  return DEFAULT_CONFIG;
};

const readConfigFile = async (
  configFile?: string,
  searchFrom?: string,
): Promise<VitestPuppeteerConfig | null> => {
  if (!configFile) {
    const result = await explorer.search(searchFrom);
    return result ? result.config : null;
  }
  const result = await explorer.load(configFile);
  return result ? result.config : null;
};

export const readConfig = async (searchFrom?: string) => {
  const defaultConfig = getDefaultConfig();
  const config = await readConfigFile(
    process.env.VITEST_PUPPETEER_CONFIG,
    searchFrom,
  );
  if (!config) return defaultConfig;
  return { ...defaultConfig, ...config };
};
