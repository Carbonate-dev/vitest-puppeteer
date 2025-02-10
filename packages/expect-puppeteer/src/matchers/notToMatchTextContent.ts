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
  } catch (error: any) {
    throw enhanceError(error, `Text found "${matcher}"`);
  }
}
