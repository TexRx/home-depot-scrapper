const puppeteer = require("puppeteer");

(async function main() {
  try {
    const getLastItem = (thePath) =>
      thePath.substring(thePath.lastIndexOf("/") + 1);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
    );

    await page.goto("https://www.homedepot.com/StoreFinder/storeDirectory");
    await page.waitForSelector("#footer");

    const stateHrefs = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("a.stateList__link[href]"),
        (a) => a.href
      )
    );

    const storeUrls = [];
    for (i = 0, len = stateHrefs.length; i < len; i++) {
      await page.goto(stateHrefs[i]);
      await page.waitForSelector("#footer");

      const stores = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            ".grid:first-of-type .storeList__item > .u__default-link"
          ),
          (a) => a.href
        )
      );

      storeUrls.push(stores);
    }

    const flattened = storeUrls.flat();
    for (i = 0, len = flattened.length; i < len; i++) {
      console.log(getLastItem(flattened[i]));
    }

    await browser.close();
  } catch (e) {
    console.log("our error", e);
  }
})();
