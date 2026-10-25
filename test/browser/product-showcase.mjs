import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:39113';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '39113'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverLog = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { serverLog = (serverLog + data).slice(-6000); });
let browser;
try {
  let ready = false;
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(serverLog);
    try { if ((await fetch(base + '/products')).ok) { ready = true; break; } } catch { /* Server starting. */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, 'Local server ready');
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  // Read-only local UI tests. Never contact analytics, WhatsApp, or production APIs.
  await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await mkdir('test-results/product-browser', { recursive: true });
  await page.goto(base + '/products', { waitUntil: 'networkidle' });
  const originalCount = await page.locator('#product-catalog article').count();
  assert.equal(originalCount, 7);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://naviigps.com/products');
  for (const image of await page.locator('#product-catalog img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(image => image.decode());
  }
  await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/product-browser/catalog-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'AI Dashcam', exact: true }).click();
  assert.equal(await page.locator('#product-catalog article').count(), 1);
  await page.getByRole('button', { name: 'All Products', exact: true }).click();
  await page.getByRole('searchbox').fill('no_such_product');
  assert.ok(await page.getByText('No Products Found').isVisible());
  await page.getByRole('searchbox').fill('G17');
  assert.equal(await page.locator('#product-catalog article').count(), 1);
  await page.locator('summary').click();
  assert.ok(await page.locator('details').evaluate(element => element.open));
  await page.locator('summary').press('Enter');
  assert.equal(await page.locator('details').evaluate(element => element.open), false);
  assert.match(await page.getByRole('link', { name: /Enquire about/ }).getAttribute('href'), /^https:\/\/wa.me\/917717394007\?text=/);
  await page.getByRole('link', { name: 'View Details', exact: true }).click();
  await page.waitForURL('**/products/g17-gps-tracker');
  await page.goBack({ waitUntil: 'networkidle' });
  await page.getByRole('searchbox').fill('');
  assert.equal(await page.locator('#product-catalog article').count(), originalCount);
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No catalogue overflow at ${width}`);
    for (const image of await page.locator('#product-catalog img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
    }
    const images = await page.locator('#product-catalog img').evaluateAll(images => images.map(image => ({ width: image.naturalWidth, height: image.naturalHeight })));
    assert.ok(images.every(image => image.width > 0 && image.height > 0), 'All product assets load');
    await page.screenshot({ path: `test-results/product-browser/catalog-${width}.png`, fullPage: true });
  }
  await page.goto(base, { waitUntil: 'networkidle' });
  const home = page.locator('[aria-labelledby="home-products-heading"]');
  assert.equal(await home.locator('article').count(), 7);
  for (const image of await home.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(image => image.decode());
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await home.screenshot({ path: `test-results/product-browser/home-${width}.png` });
    assert.ok(await home.evaluate(element => element.scrollWidth <= element.clientWidth), `No product section overflow at ${width}`);
  }
  assert.deepEqual(errors, []);
  console.log('PASS product showcase: filtering, search/empty/reset, keyboard disclosure, details/back, original assets, canonical, responsive 320/390/768/1440, reduced-motion rendering; no external writes.');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
