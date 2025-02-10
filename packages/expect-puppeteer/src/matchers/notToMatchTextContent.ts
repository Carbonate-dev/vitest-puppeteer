import { enhanceError, PuppeteerInstance, SearchExpression } from "../utils.js";
import {
  matchTextContent,
  MatchTextContentOptions,
} from "./matchTextContent.js";

export type NotToMatchOptions = MatchTextContentOptions;

export async function notToMatchTextContent(
  instance: PuppeteerInstance,
  matcher: SearchExpression,
  options: NotToMatchOptions = {},
) {
  try {
    await matchTextContent(instance, matcher, options, "negative");
  } catch (error: unknown) {
    throw enhanceError(error as Error, `Text found "${matcher}"`);
  }
}
