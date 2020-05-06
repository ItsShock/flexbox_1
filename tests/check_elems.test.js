const Differencify = require("differencify");
const differencify = new Differencify({ mismatchThreshold: 0 });
let urlToTest = "http://127.0.0.1:8080/";

describe("Zadanie", () => {
  const timeout = 30000;
  let page;

  beforeAll(async () => {
    await differencify.launchBrowser({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const target = differencify.init({ chain: false });
    page = await target.newPage();
    await page.goto(urlToTest);
    await page.waitFor(1000);
  }, timeout);
  afterAll(async () => {
    await differencify.cleanup();
  });

  it("Dodano div", async () => {
    const div = await page.$eval("div", elem => !!elem);
    expect(div).toBe(true);
  }, timeout);

  it("Div ma rozmiar 500 x 500", async () => {
    const div = await page.$eval("div", elem => {
      return getComputedStyle(elem).width === "500px"
        && getComputedStyle(elem).height === "500px"
    });

    expect(div).toBe(true);
  }, timeout);

  it("Divy mogą wyświetlić się po 2 w rzędzie dzięki flexbox", async () => {
    const divs = await page.$eval("div", elem => {
      return getComputedStyle(elem).display === "flex"
        &&getComputedStyle(elem).flexWrap === "wrap"
    });
    expect(divs).toBe(true);
  }, timeout);

  it("Ma 4 divy w środku po 50% szerokości i wysokości", async () => {
    const divs = await page.$$eval("div div", elems => {
      return getComputedStyle(elems[0]).width === "250px"
        && getComputedStyle(elems[1]).width === "250px"
        && getComputedStyle(elems[2]).width === "250px"
        && getComputedStyle(elems[2]).width === "250px"
        && getComputedStyle(elems[0]).height === "250px"
        && getComputedStyle(elems[1]).height === "250px"
        && getComputedStyle(elems[2]).height === "250px"
        && getComputedStyle(elems[2]).height === "250px";
    });
    expect(divs).toBe(true);
  }, timeout);
});
