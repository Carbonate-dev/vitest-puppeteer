// import globals
import "vitest-puppeteer";

describe("resetPage", () => {
  test("should reset page", async () => {
    const oldPage = page;
    await vitestPuppeteer.resetPage();
    expect(page).not.toBe(oldPage);
    expect(page.isClosed()).toBe(false);
    expect(oldPage.isClosed()).toBe(true);
  });
});
