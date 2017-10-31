import { launch, Page } from "puppeteer";
import { join } from "path";
import ConfigParser from "./ConfigParser";
import IE2ETest from "./IE2ETest";
import { exec } from "child_process";
import { readFile } from "fs";
const exportDir: string = process.env.CIRCLE_ARTIFACTS || "ss";
const nodeTotal: number = Number.parseInt(process.env.CIRCLE_NODE_TOTAL) || 1;
const nodeIndex: number = Number.parseInt(process.env.CIRCLE_NODE_INDEX) || 0;
const artifactoryURL = process.env.ARTIFACTORY_URL;

async function readTrigger() {
    return new Promise((resolve, reject) => {
        readFile("trigger.json", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        })
    });
}
async function test() {
    const browser = await launch({ headless: false });
    const page = await browser.newPage();
    const config = await ConfigParser.loadAll();
    const filteredConfig = config.filter((v, i) => (i % nodeTotal) === nodeIndex);
    for (let i = 0; i < filteredConfig.length; i++) {
        await captureWithPage(page, filteredConfig[i]);
    }
    await browser.close();
    const trigger: any = await readTrigger();
    await sendToS3(trigger.destination);
}

async function sendToS3(folder: string) {
    return new Promise((resolve, reject) => {
        exec(`aws s3 cp $CIRCLE_ARTIFACTS/ s3://$S3_BUCKET_URL/ss/${folder}--recursive --acl public-read`, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                console.log(`[LOG]${stdout}`);
                console.error(`[ERROR]${stderr}`);
            }
        });
    });
}

async function captureWithPage(page: Page, config: IE2ETest) {
    await page.setViewport({ width: config.width, height: config.height });
    console.log(`[E2E TEST (${config.group} - ${config.name})] (${config.url})`);
    let beginTime = Date.now();
    await page.goto(config.url);
    console.log(`--> Loaded in ${Date.now() - beginTime}ms`);
    beginTime = Date.now();
    await page.waitFor("canvas.gr-resource-loaded-canvas");
    console.log(`--> Grimoire.js got ready state to render in ${Date.now() - beginTime}ms`);
    if (config.waitFor !== null) {
        beginTime = Date.now();
        await page.waitFor(config.waitFor);
        console.log(`--> Waiting for custom waiting criteria ${Date.now() - beginTime}ms`);
    }
    await page.screenshot({ path: join(exportDir, config.group + config.name + ".png"), type: "png" });
}

test();