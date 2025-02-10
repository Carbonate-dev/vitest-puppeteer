import { vi } from "vitest";
// import globals
import "vitest-puppeteer";

describe("runBeforeUnloadOnClose", () => {
  it("shouldn’t call page.close with runBeforeUnload by default", async () => {
    const closeSpy = vi.spyOn(page, "close");
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}`);
    await vitestPuppeteer.resetPage();
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith({ runBeforeUnload: false });
  });

  it("should call page.close({ runBeforeUnload: true }) when runBeforeUnloadOnClose is set to true", async () => {
    const closeSpy = vi.spyOn(page, "close");
    puppeteerConfig.runBeforeUnloadOnClose = true;
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}`);
    await vitestPuppeteer.resetPage();
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith({ runBeforeUnload: true });
  });
});
