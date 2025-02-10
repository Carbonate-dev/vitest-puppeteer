/* eslint-disable no-var */
import type { VitestPuppeteerGlobal } from "vitest-environment-puppeteer";

declare global {
  var browser: VitestPuppeteerGlobal["browser"];
  var page: VitestPuppeteerGlobal["page"];
  var context: VitestPuppeteerGlobal["context"];
  var puppeteerConfig: VitestPuppeteerGlobal["puppeteerConfig"];
  var vitestPuppeteer: VitestPuppeteerGlobal["vitestPuppeteer"];
}
