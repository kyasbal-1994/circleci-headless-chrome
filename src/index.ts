import { launch, Page } from "puppeteer";
import { join } from "path";
const exportDir = process.env.CIRCLE_ARTIFACTS || "ss";
async function test() {
    const browser = await launch({ headless: false });
    const page = await browser.newPage();
    await captureWithPage(page, "https://grimoire.gl");
    await browser.close();
}

async function captureWithPage(page: Page, addr: string) {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(addr);
    await page.waitFor("canvas.gr-resource-loaded-canvas");
    await page.screenshot({ path: join(exportDir, Math.random() + ".png"), type: "png" });
}

test();