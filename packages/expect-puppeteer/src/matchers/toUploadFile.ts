import type { ElementHandle } from "puppeteer-core";
import { PuppeteerInstance, Selector } from "../utils.js";
import { toMatchElement, ToMatchElementOptions } from "./toMatchElement.js";

const checkIsInputElement = (
  element: ElementHandle<Element>,
): element is ElementHandle<HTMLInputElement> => {
  return typeof element.uploadFile === "function";
};

export async function toUploadFile(
  instance: PuppeteerInstance,
  selector: Selector | string,
  filePaths: string | string[],
  options: ToMatchElementOptions = {},
) {
  const element = await toMatchElement(instance, selector, options);
  if (!checkIsInputElement(element)) {
    throw new Error(`Element is not an input element`);
  }
  const resolvedFilePaths = Array.isArray(filePaths) ? filePaths : [filePaths];
  return element.uploadFile(...resolvedFilePaths);
}
