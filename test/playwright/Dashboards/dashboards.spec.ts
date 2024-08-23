import { test as base, expect } from '@playwright/test';

// BrowserStack Specific Capabilities.
// Set 'browserstack.local:true For Local testing
const caps = {
  osVersion: "12.0",
  deviceName: "Samsung Galaxy S22", // "Samsung Galaxy S22 Ultra", "Google Pixel 7 Pro", "OnePlus 9", etc.
  browserName: "chrome",
  realMobile: "true",
  name: "My android playwright test",
  build: "playwright-build-1",
  "browserstack.username": process.env.BROWSERSTACK_USERNAME || "<USERNAME>",
  "browserstack.accessKey":
    process.env.BROWSERSTACK_ACCESS_KEY || "<ACCESS_KEY>",
  "browserstack.local": process.env.BROWSERSTACK_LOCAL || false,
  "browserstack.localIdentifier": process.env.BROWSERSTACK_LOCAL_IDENTIFIER || "abc123",
};

console.log(caps);

const patchMobileCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, deviceName] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let osVersion = osCapsSplit.join(" ");
  caps.deviceName = deviceName ? deviceName : "Samsung Galaxy S22 Ultra";
  caps.osVersion = osVersion ? osVersion : "12.0";
  caps.name = title;
  caps.realMobile = "true";
};

const test = base.extend({
    page: async ({ page, playwright }, use, testInfo) => {
        patchMobileCaps(
            testInfo.project.name,
            `${testInfo.file} - ${testInfo.title}`
        );
        const vDevice = await playwright._android.connect(
          `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify(caps)
          )}`
        );
        await vDevice.shell("am force-stop com.android.chrome");
        const vContext = await vDevice.launchBrowser();

        const vPage = await vContext.newPage();
        await use(vPage);

        await vPage.close();
        await vDevice.close();
    }
})

test('stock tools gui is working', async ({ page }) => {
    const baseUrl = 'http://localhost:3030/samples/view?mobile=true&path=/';
    await page.goto(baseUrl + 'highcharts/cypress/stock-tools-gui');
    await page.locator('.highcharts-indicators').first().click();
    await page.locator('div.highcharts-popup').isVisible();
});

