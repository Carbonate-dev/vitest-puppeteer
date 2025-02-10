const port = process.env.TEST_SERVER_PORT
  ? Number(process.env.TEST_SERVER_PORT)
  : 4444;

process.env.TEST_SERVER_PORT = port;

/**
 * @type {import('packages/vitest-environment-puppeteer').VitestPuppeteerConfig}
 */
const vitestPuppeteerConfig = {
  launch: {
    headless: "new",
    args: ["--no-sandbox"],
  },
  browserContext: process.env.INCOGNITO ? "incognito" : "default",
  server: {
    // command: `cross-env PORT=${port} node server`,
    command: `PORT=${port} node server`,
    port,
    launchTimeout: 4000,
    usedPortAction: "kill",
  },
};

export default vitestPuppeteerConfig;
