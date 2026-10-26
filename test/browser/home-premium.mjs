import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:39114';
const output = 'test-results/home-browser';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '39114'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverLog = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { serverLog = (serverLog + data).slice(-6000); });
let browser;
const headings = {
  why: /Trusted GPS &.*Fleet Management Partner/,
  software: /Powerful Fleet.*Management Dashboard/,
  cta: /Transform Your Fleet With.*NAVII GPS Platform/,
  faq: /Got Questions\?.*We've Got Answers/,
};
async function isolatedContext(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', serviceWorkers: 'block', ...options });
  // Local document/assets only. Never submit forms, call production, or invoke local APIs.
  await context.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    return url.origin === base && !url.pathname.startsWith('/api/') && ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort();
  });
  await context.addInitScript(() => {
    window.__premiumRevealAnimations = 0;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      if (String(this.className).includes('reveal')) window.__premiumRevealAnimations++;
      return animate.apply(this, args);
    };
  });
  return context;
}
async function dismissConsent(page) {
  const consent = page.getByRole('button', { name: 'Necessary Only', exact: true });
  if (await consent.isVisible()) await consent.click();
}
async function verifyFAQ(page) {
  const details = page.locator('details[name="navii-home-faq"]');
  assert.equal(await details.count(), 8);
  const item = details.nth(1);
  const summary = item.locator('summary');
  for (let cycle = 0; cycle < 3; cycle++) {
    await summary.focus();
    await summary.press('Enter');
    await page.waitForFunction(() => document.querySelectorAll('details[name="navii-home-faq"]')[1].open);
    assert.ok(await item.locator('p').isVisible(), 'Expanded FAQ answer visible');
    await summary.press('Space');
    await page.waitForFunction(() => !document.querySelectorAll('details[name="navii-home-faq"]')[1].open);
    assert.equal(await item.locator('p').isVisible(), false);
  }
}
try {
  let ready = false;
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(serverLog);
    try { if ((await fetch(base, { signal: AbortSignal.timeout(3000) })).ok) { ready = true; break; } } catch { /* Server starting. */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, 'Local Home server ready');
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  await mkdir(output, { recursive: true });
  const context = await isolatedContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  await dismissConsent(page);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://naviigps.com');
  const hero = page.locator('[aria-labelledby="home-hero-title"]');
  const heroImage = hero.locator('img');
  await heroImage.evaluate(image => image.decode());
  assert.ok(await heroImage.evaluate(image => image.naturalWidth > 0 && decodeURIComponent(image.currentSrc).includes('/assets/hero/hero.png')), 'Original hero asset loads');
  assert.equal(await hero.getByRole('link', { name: 'Explore Products', exact: true }).getAttribute('href'), '/products');
  assert.equal(await hero.getByRole('link', { name: 'Book a free NAVII GPS product and software demo' }).getAttribute('href'), '/contact');
  const cta = page.locator('section').filter({ has: page.getByRole('heading', { name: headings.cta }) });
  assert.equal(await cta.getByRole('link', { name: /Get Free Demo/ }).getAttribute('href'), '/contact');
  assert.equal(await cta.getByRole('link', { name: /Call Now/ }).getAttribute('href'), 'tel:+917717394007');
  assert.equal(await cta.getByRole('link', { name: /WhatsApp/ }).getAttribute('href'), 'https://wa.me/918899729705');
  await verifyFAQ(page);
  await hero.getByRole('link', { name: 'Explore Products', exact: true }).click();
  await page.waitForURL(base + '/products');
  await page.goBack({ waitUntil: 'networkidle' });
  assert.ok(await page.locator('#home-hero-title').isVisible());
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width >= 768 ? 1000 : 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No Home overflow at ${width}`);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${output}/hero-${width}.png` });
    const signs = hero.locator('[data-hero-feature]');
    assert.equal(await signs.count(), 4);
    assert.ok(await hero.getByText('Illustrative data, not live telemetry', { exact: true }).isVisible());
    await heroImage.scrollIntoViewIfNeeded();
    for (const sign of await signs.all()) {
      assert.ok(await sign.isVisible(), 'Floating feature sign visible');
      if (await sign.getAttribute('data-hero-feature') !== 'dashboard') assert.equal(await sign.locator('svg').count(), 1, 'Feature has an actual SVG icon');
      assert.ok(await sign.evaluate(element => {
        const box = element.getBoundingClientRect();
        const parent = element.parentElement.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && box.left >= parent.left && box.right <= parent.right && box.top >= parent.top && box.bottom <= parent.bottom && getComputedStyle(element).animationName === 'none';
      }), 'Reduced-motion floating sign stays visible within stage');
    }
    const boxes = await signs.evaluateAll(elements => elements.map(element => {
      const { left, right, top, bottom } = element.getBoundingClientRect();
      return { left, right, top, bottom };
    }));
    for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
      assert.ok(boxes[a].right <= boxes[b].left || boxes[b].right <= boxes[a].left || boxes[a].bottom <= boxes[b].top || boxes[b].bottom <= boxes[a].top, `Glass cards do not overlap at ${width}`);
    }
    if ([320, 390, 1440].includes(width)) await page.screenshot({ path: `${output}/hero-device-${width}.png` });
    for (const [name, pattern] of Object.entries(headings)) {
      const heading = page.getByRole('heading', { name: pattern });
      assert.ok(await heading.isVisible(), `${name} visible at ${width}`);
      await heading.evaluate(element => window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - 110, behavior: 'instant' }));
      if ([390, 1440].includes(width)) await page.screenshot({ path: `${output}/${name}-${width}.png` });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No ${name} overflow at ${width}`);
    }
  }
  assert.equal(await page.evaluate(() => window.__premiumRevealAnimations), 0, 'Reduced motion skips reveal animation');
  assert.deepEqual(errors, [], 'No Home runtime errors');
  await context.close();

  const motionContext = await isolatedContext({ reducedMotion: 'no-preference' });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(base, { waitUntil: 'networkidle' });
  await motionPage.waitForFunction(() => window.__premiumRevealAnimations > 0);
  const initialAnimations = await motionPage.evaluate(() => window.__premiumRevealAnimations);
  await motionPage.getByRole('heading', { name: headings.why }).scrollIntoViewIfNeeded();
  await motionPage.waitForFunction(before => window.__premiumRevealAnimations > before, initialAnimations);
  assert.ok(await motionPage.getByRole('heading', { name: headings.why }).isVisible(), 'Scrolled reveal content visible');
  await motionContext.close();

  const noJS = await isolatedContext({ javaScriptEnabled: false });
  const staticPage = await noJS.newPage();
  await staticPage.goto(base, { waitUntil: 'networkidle' });
  assert.ok(await staticPage.locator('#home-hero-title').isVisible(), 'Hero available without JavaScript');
  assert.equal(await staticPage.locator('[data-hero-feature] svg').count(), 3, 'Floating icons present in server HTML');
  for (const pattern of Object.values(headings)) {
    const heading = staticPage.getByRole('heading', { name: pattern });
    assert.ok(await heading.isVisible(), 'Section heading available without JavaScript');
    assert.ok(await heading.evaluate(element => {
      for (let current = element; current; current = current.parentElement) {
        if (Number(getComputedStyle(current).opacity) === 0) return false;
      }
      return true;
    }), 'SSR heading not hidden by opacity');
  }
  assert.ok(await staticPage.locator('details[name="navii-home-faq"]').first().locator('p').isVisible(), 'Initial FAQ answer visible without JavaScript');
  await verifyFAQ(staticPage);
  await noJS.close();
  console.log('PASS premium Home: original hero asset, original CTA URLs, products/back, FAQ keyboard/repeated/native no-JS toggles, responsive overflow/screenshots, reduced-motion and progressive reveal. No forms submitted or external API calls.');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
