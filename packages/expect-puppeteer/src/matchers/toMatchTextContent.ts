import { enhanceError, PuppeteerInstance, SearchExpression } from "../utils.js";
import {
  matchTextContent,
  MatchTextContentOptions,
} from "./matchTextContent.js";

export type ToMatchOptions = MatchTextContentOptions;

export async function toMatchTextContent(
  instance: PuppeteerInstance,
  matcher: SearchExpression,
  options: ToMatchOptions = {},
) {
  try {
    await matchTextContent(instance, matcher, options, "positive");
  } catch (error: any) {
    throw enhanceError(error, `Text not found "${matcher}"`);
  }
}
