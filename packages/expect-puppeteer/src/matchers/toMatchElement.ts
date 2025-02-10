import {
  enhanceError,
  PuppeteerInstance,
  Selector,
  resolveSelector,
  getSelectorMessage,
} from "../utils.js";
import type { ElementHandle } from "puppeteer";
import { defaultOptions, Options } from "../options.js";
import { getElementFactory, GetElementOptions } from "./getElementFactory.js";

export type ToMatchElementOptions = GetElementOptions & Options;

export async function toMatchElement(
  instance: PuppeteerInstance,
  selector: Selector | string,
  options: ToMatchElementOptions = {},
) {
  const { text, visible, ...otherOptions } = options;
  const frameOptions = defaultOptions(otherOptions);
  const rSelector = resolveSelector(selector);

  const [getElement, getElementArgs, ctx] = await getElementFactory(
    instance,
    rSelector,
    { text, visible },
  );

  try {
    await ctx.page.waitForFunction(
      getElement,
      frameOptions,
      ...getElementArgs,
      "positive" as const,
    );
  } catch (error: unknown) {
    throw enhanceError(
      error as Error,
      `${getSelectorMessage(rSelector, text)} not found`,
    );
  }

  const jsHandle = await ctx.page.evaluateHandle(
    getElement,
    ...getElementArgs,
    "element" as const,
  );
  return jsHandle.asElement() as ElementHandle<Element>;
}
