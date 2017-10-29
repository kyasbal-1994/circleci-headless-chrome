import { launch } from "puppeteer";

async function test() {
    const browser = await launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://grimoire.gl");
    await page.waitFor("canvas.gr-resource-loaded-canvas");
    await page.screenshot({ path: "ss.png" });
    await browser.close();
}

test();