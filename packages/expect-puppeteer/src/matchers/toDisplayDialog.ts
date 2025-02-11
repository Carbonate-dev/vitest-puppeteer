import type { Dialog, Page } from "puppeteer-core";

export async function toDisplayDialog(page: Page, block: () => Promise<void>) {
  return new Promise<Dialog>((resolve, reject) => {
    const handleDialog = (dialog: Dialog) => {
      page.off("dialog", handleDialog);
      resolve(dialog);
    };
    page.on("dialog", handleDialog);
    block().catch(reject);
  });
}
