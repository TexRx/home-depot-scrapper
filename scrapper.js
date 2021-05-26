const puppeteer = require("puppeteer");

(async function scrape() {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(
    "https://www.homedepot.com/b/Tools-Power-Tools/Special-Buys/N-5yc1vZc298Z1z11ao3?storeSelection="
  );

  await page.waitForSelector("#footer");

  let products = await page.evaluate(() => {
    let productElements = document.body.querySelectorAll(".product-pod");
    let products = Object.values(productElements).map((x) => {
      return {
        productTitle:
          x.querySelector(".product-pod__title__product").textContent ?? null,
        modelNumber: x.querySelector(".product-pod__model").textContent ?? null,
        productImage:
          x
            .querySelector(".product-pod__image-wrapper > img:first-child")
            .getAttribute("src") ?? null,
        productDetailLink:
          document.location.protocol +
            "//" +
            document.location.host +
            x.querySelector("a[href]").getAttribute("href") ?? null,
        price: x.querySelector(".price-format__main-price")
          ? x.querySelector(".price-format__main-price").textContent
          : null,
        wasPrice: x.querySelector(".price__was-price .u__strike span")
          ? x.querySelector(".price__was-price .u__strike span").textContent
          : null,
        storeStock: x.querySelector(".store__success")
          ? x.querySelector(".store__success").textContent
          : null,
        limitedStock: x.querySelector(".store__warning")
          ? x.querySelector(".store__warning").textContent
          : null,
      };
    });
    return products;
  });

  console.log(products);
  await browser.close();
})();
