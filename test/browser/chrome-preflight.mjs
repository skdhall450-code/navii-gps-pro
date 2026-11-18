import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

// CI uses the runner's existing stable Chrome. Never install a browser, retry
// with a different executable or weaken sandboxing when this check fails.
export async function verifyInstalledChrome(chromium) {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, chromiumSandbox: true, channel: 'chrome', timeout: 30000 });
    const version = browser.version();
    assert.match(version, /^\d+\.\d+\.\d+\.\d+$/, 'Installed Chrome must report a valid version');
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const unexpected = [];
    await context.route('**/*', async route => {
      unexpected.push(route.request().url());
      await route.abort();
    });
    await context.routeWebSocket('**/*', async socket => {
      unexpected.push(socket.url());
      await socket.close({ code: 1008, reason: 'Inert browser preflight' });
    });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto('about:blank', { timeout: 5000 });
    await page.setContent('<!doctype html><title>NAVII browser preflight</title><h1>Sandboxed Chrome check</h1>', { timeout: 5000 });
    assert.equal(await page.locator('h1').innerText(), 'Sandboxed Chrome check');
    assert.equal(await page.evaluate(() => 21 * 2), 42, 'Chrome must execute the inert page');
    await context.close();
    assert.deepEqual(unexpected, [], 'Preflight must not make network requests');
    return { channel: 'chrome', version, chromiumSandbox: true };
  } finally {
    if (browser) await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { chromium } = await import('playwright');
  const result = await verifyInstalledChrome(chromium);
  console.log('PASS: installed sandboxed Chrome preflight ' + JSON.stringify(result));
}
