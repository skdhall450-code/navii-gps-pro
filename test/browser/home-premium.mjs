import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

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
const priorityGuides = [
  ['Chandigarh', '/gps-tracker/chandigarh'],
  ['Dera Bassi', '/gps-tracker/punjab/sahibzada-ajit-singh-nagar/dera-bassi'],
  ['Mohali', '/gps-tracker/punjab/sahibzada-ajit-singh-nagar/mohali'],
  ['Zirakpur', '/gps-tracker/punjab/sahibzada-ajit-singh-nagar/zirakpur'],
  ['Kharar', '/gps-tracker/punjab/sahibzada-ajit-singh-nagar/kharar'],
];
async function verifyLocalLinks(page) {
  const nav = page.getByRole('navigation', { name: 'Local GPS tracking guides', exact: true });
  assert.equal(await nav.getByRole('link').count(), priorityGuides.length);
  for (const [name, path] of priorityGuides) {
    const link = nav.getByRole('link', { name: `GPS tracker in ${name}`, exact: true });
    assert.equal(await link.getAttribute('href'), path);
    assert.ok(await link.isVisible(), `${name} discovery link visible`);
  }
}
async function verifyMobileTarget(locator, label) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  assert.ok(box && box.width >= 44 && box.height >= 44, `${label}: at least 44px tap target`);
  assert.ok(box.x >= 0 && box.x + box.width <= locator.page().viewportSize().width + 1, `${label}: fits viewport`);
  // Playwright actionability also checks that a sticky header/overlay does not intercept it.
  await locator.click({ trial: true });
}
async function verifyPublicPhone(page) {
  const phones = await page.locator('a[href^="tel:"]').evaluateAll(links => links.map(link => link.getAttribute('href')));
  assert.ok(phones.length > 0, 'Public page offers a call contact');
  assert.ok(phones.every(phone => phone === 'tel:+917717394007'), 'All public call links use the owner-confirmed number');
  const schemaPhones = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => {
    const phones = [];
    function visit(value) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        if (key === 'telephone') phones.push(child);
        else visit(child);
      }
    }
    for (const script of scripts) visit(JSON.parse(script.textContent));
    return phones;
  });
  assert.ok(schemaPhones.length > 0 && schemaPhones.every(phone => phone === '+917717394007'), 'Business schema agrees with call links');
}
async function verifyLocalMobileJourney() {
  const results = [];
  for (const width of [320, 390]) {
    const context = await isolatedContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const errors = [];
    const writes = [];
    page.on('pageerror', error => errors.push(error.message));
    context.on('request', request => {
      if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.method() + ' ' + request.url());
    });
    try {
      for (const [name, path] of priorityGuides) {
        await page.goto(base, { waitUntil: 'networkidle' });
        await dismissConsent(page);
        await verifyLocalLinks(page);
        const link = page.getByRole('navigation', { name: 'Local GPS tracking guides', exact: true })
          .getByRole('link', { name: `GPS tracker in ${name}`, exact: true });
        await verifyMobileTarget(link, `${name} homepage link at ${width}`);
        await link.click();
        await page.waitForURL(base + path);
        await verifyPublicPhone(page);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://naviigps.com' + path);
        assert.ok(await page.evaluate(limit => document.documentElement.scrollWidth <= limit, width), `${name}: no overflow at ${width}`);
        const enquiry = page.getByRole('link', { name: name === 'Chandigarh' ? 'Discuss your Chandigarh fleet' : 'Request a Consultation', exact: true });
        assert.equal(await enquiry.getAttribute('href'), '/contact');
        await verifyMobileTarget(enquiry, `${name} enquiry at ${width}`);
        await page.screenshot({ path: `${output}/local-${name.toLowerCase().replaceAll(' ', '-')}-${width}.png` });
        await enquiry.click();
        await page.waitForURL(base + '/contact');
        await verifyPublicPhone(page);
        assert.ok(await page.getByRole('heading', { name: 'Request a Free Consultation', exact: true }).isVisible());
        results.push({ name, width, discovery: 'pass', canonical: 'pass', enquiryNavigation: 'pass' });
      }
      const anchor = page.getByRole('link', { name: 'Get Free Consultation', exact: true });
      await anchor.click();
      await page.waitForURL(base + '/contact#contact-form');
      assert.ok(await page.evaluate(limit => document.documentElement.scrollWidth <= limit, width), `Contact: no overflow at ${width}`);
      for (const [label, type, autocomplete] of [['Full Name', 'text', 'name'], ['Email Address', 'email', 'email'], ['Mobile Number', 'tel', 'tel']]) {
        const input = page.getByLabel(label, { exact: false });
        assert.equal(await input.getAttribute('type'), type);
        assert.equal(await input.getAttribute('autocomplete'), autocomplete);
        assert.equal(await input.evaluate(element => element.required), true);
      }
      assert.equal(await page.getByLabel('Mobile Number').getAttribute('inputmode'), 'tel');
      const fields = page.locator('#contact-form input:not([name="website"]), #contact-form textarea');
      assert.equal(await fields.count(), 6);
      for (const field of await fields.all()) {
        await verifyMobileTarget(field, `Contact ${await field.getAttribute('name')} at ${width}`);
        assert.ok(await field.evaluate(element => parseFloat(getComputedStyle(element).fontSize) >= 16), 'Form fields use at least 16px text');
      }
      await verifyMobileTarget(page.getByRole('button', { name: 'Submit Enquiry', exact: true }), `Submit control at ${width}`);
      await page.locator('#contact-form').screenshot({ path: `${output}/local-contact-${width}.png` });
      assert.deepEqual(errors, [], `No journey runtime errors at ${width}`);
      assert.deepEqual(writes, [], 'No enquiry or other write request attempted');
    } finally {
      await writeFile(`${output}/local-mobile-results.json`, JSON.stringify(results, null, 2));
      await context.close();
    }
  }
}
async function verifyContactProgressiveDisclosure() {
  for (const javaScriptEnabled of [true, false]) {
    for (const width of [320, 390]) {
      const context = await isolatedContext({ javaScriptEnabled, viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
      try {
        const page = await context.newPage();
        await page.goto(base + '/contact', { waitUntil: 'networkidle' });
        await dismissConsent(page);
        await verifyPublicPhone(page);
        const details = page.locator('details');
        assert.equal(await details.count(), 4, 'All four buyer answers are available');
        for (const item of await details.all()) {
          const answer = item.locator('p');
          assert.ok((await answer.textContent()).length > 60, 'Answer text exists before interaction');
          const summary = item.locator('summary');
          if (await item.evaluate(element => element.open)) await summary.click();
          assert.equal(await answer.isVisible(), false);
          await verifyMobileTarget(summary, `Contact disclosure at ${width}, JavaScript ${javaScriptEnabled}`);
          await summary.focus();
          await summary.press('Enter');
          assert.ok(await answer.isVisible(), 'Keyboard opens native answer');
          await summary.press('Space');
          assert.equal(await answer.isVisible(), false, 'Keyboard closes native answer');
        }
        assert.ok(await page.evaluate(limit => document.documentElement.scrollWidth <= limit, width), 'Contact FAQ fits mobile viewport');
        await page.screenshot({ path: `${output}/contact-faq-${width}-js-${javaScriptEnabled}.png` });
      } finally {
        await context.close();
      }
    }
  }
}
async function verifyDelhiGuideMobileJourney() {
  for (const javaScriptEnabled of [true, false]) {
    for (const width of [320, 390]) {
      const context = await isolatedContext({ javaScriptEnabled, viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const [slug, name, sibling] of [['janakpuri', 'Janakpuri', 'vikaspuri'], ['vikaspuri', 'Vikaspuri', 'janakpuri']]) {
          const path = `/gps-tracker/delhi/west/${slug}`;
          await page.goto(base + path, { waitUntil: 'networkidle' });
          await dismissConsent(page);
          assert.equal(await page.locator('h1').count(), 1);
          assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://naviigps.com' + path);
          const checklist = page.locator('section').filter({ has: page.getByRole('heading', { name: `${name} fleet planning checklist`, exact: true }) });
          assert.equal(await checklist.locator('article').count(), 4);
          for (const article of await checklist.locator('article').all()) {
            await article.scrollIntoViewIfNeeded();
            assert.ok(await article.locator('h3').isVisible());
            assert.ok(await article.locator('p').isVisible());
          }
          const faq = page.locator('section').filter({ has: page.getByRole('heading', { name: `GPS Tracking in ${name}: FAQs`, exact: true }) });
          const structured = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.flatMap(script => {
            const value = JSON.parse(script.textContent);
            return value['@graph'] || [value];
          }).find(value => value['@type'] === 'FAQPage').mainEntity);
          assert.equal(structured.length, 6);
          assert.equal(await faq.locator('article').count(), structured.length);
          for (const item of structured) {
            const article = faq.locator('article').filter({ has: page.getByRole('heading', { name: item.name, exact: true }) });
            assert.equal(await article.locator('p').textContent(), item.acceptedAnswer.text);
            await article.scrollIntoViewIfNeeded();
            assert.ok(await article.locator('p').isVisible(), 'FAQ is readable with and without JavaScript');
          }
          assert.ok(await page.evaluate(limit => document.documentElement.scrollWidth <= limit, width), `${name}: no mobile overflow`);
          await page.screenshot({ path: `${output}/delhi-${slug}-${width}-js-${javaScriptEnabled}.png` });
          const related = page.getByRole('navigation', { name: 'Related fleet planning', exact: true }).locator(`a[href="/gps-tracker/delhi/west/${sibling}"]`);
          await related.click();
          await page.waitForURL(base + `/gps-tracker/delhi/west/${sibling}`);
          await page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).getByRole('link', { name: 'West', exact: true }).click();
          await page.waitForURL(base + '/gps-tracker/delhi/west');
          assert.ok(await page.locator(`main a[href="${path}"]`).first().isVisible(), 'District exposes the existing guide');
        }
        assert.deepEqual(errors, [], 'No Delhi guide runtime errors');
      } finally {
        await context.close();
      }
    }
  }
  console.log('PASS Delhi guides: Janakpuri/Vikaspuri 320/390px, JS on/off, four readable sections, six visible/schema FAQs, no overflow, sibling and district navigation.');
}
async function verifyPuducherryGuideMobileJourney() {
  const path = '/gps-tracker/puducherry';
  const expectedRegions = ['Puducherry region', 'Karaikal region', 'Mahe region', 'Yanam region'];
  for (const javaScriptEnabled of [true, false]) {
    for (const width of [320, 390]) {
      const context = await isolatedContext({ javaScriptEnabled, viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base + path, { waitUntil: 'networkidle' });
        await dismissConsent(page);
        assert.equal(await page.locator('h1').count(), 1);
        assert.match(await page.locator('h1').textContent(), /GPS Tracker in Puducherry/);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://naviigps.com' + path);
        assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), await page.locator('meta[property="og:description"]').getAttribute('content'));
        const regionSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'One Union Territory, four separate operating regions', exact: true }) });
        assert.equal(await regionSection.locator('article').count(), 4);
        assert.deepEqual(await regionSection.locator('article h3').allTextContents(), expectedRegions);
        const graph = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.flatMap(script => {
          const value = JSON.parse(script.textContent);
          return value['@graph'] || [value];
        }));
        assert.ok(graph.some(item => item['@type'] === 'WebPage' && item.url === 'https://naviigps.com' + path));
        assert.ok(graph.some(item => item['@type'] === 'Service' && item.url === 'https://naviigps.com' + path && item.areaServed?.name === 'Puducherry'));
        const faqSchema = graph.find(item => item['@type'] === 'FAQPage');
        assert.ok(faqSchema);
        assert.equal(faqSchema.mainEntity.length, 4);
        const faqSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Puducherry GPS tracking FAQs', exact: true }) });
        const details = faqSection.locator('details');
        assert.equal(await details.count(), 4);
        for (const [index, item] of faqSchema.mainEntity.entries()) {
          const disclosure = details.nth(index);
          assert.equal(await disclosure.locator('summary').textContent(), item.name);
          assert.equal(await disclosure.locator('p').textContent(), item.acceptedAnswer.text);
          await disclosure.locator('summary').click();
          assert.ok(await disclosure.locator('p').isVisible(), 'FAQ answer readable with JavaScript on/off');
        }
        assert.equal(await page.getByRole('link', { name: 'Discuss Your Fleet', exact: true }).getAttribute('href'), '/contact');
        assert.equal(await page.getByRole('link', { name: 'View India Coverage', exact: true }).getAttribute('href'), '/gps-tracker-india');
        assert.ok(await page.evaluate(limit => document.documentElement.scrollWidth <= limit, width), 'No horizontal overflow');
        await page.screenshot({ path: `${output}/puducherry-${width}-js-${javaScriptEnabled}.png` });
        await page.getByRole('link', { name: 'View India Coverage', exact: true }).click();
        await page.waitForURL(base + '/gps-tracker-india');
        const directoryLink = page.locator('a[href="/gps-tracker/puducherry"]');
        assert.equal(await directoryLink.count(), 1, 'National directory links to exactly one Puducherry canonical');
        assert.ok(await directoryLink.isVisible());
        await directoryLink.click();
        await page.waitForURL(base + path);
        assert.equal(await page.locator('h1').count(), 1);
        assert.deepEqual(errors, [], 'No Puducherry guide runtime errors');
      } finally {
        await context.close();
      }
    }
  }
  console.log('PASS Puducherry guide: four regions, four visible/schema FAQs, metadata/canonical, national-directory discovery and contact links at 320/390px with JavaScript on/off.');
}
async function verifyJammuKashmirGuideMobileJourney() {
  const path = '/gps-tracker/jammu-and-kashmir';
  const expectedDivisions = [
    { name: 'Jammu Division', districts: ['Kathua', 'Jammu', 'Samba', 'Udhampur', 'Reasi', 'Rajouri', 'Poonch', 'Doda', 'Ramban', 'Kishtwar'] },
    { name: 'Kashmir Division', districts: ['Anantnag', 'Kulgam', 'Pulwama', 'Shopian', 'Budgam', 'Srinagar', 'Ganderbal', 'Bandipore', 'Baramulla', 'Kupwara'] },
  ];
  for (const javaScriptEnabled of [true, false]) {
    for (const width of [320, 390]) {
      const context = await isolatedContext({ javaScriptEnabled, viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base + path, { waitUntil: 'networkidle' });
        await dismissConsent(page);
        assert.equal(await page.locator('h1').count(), 1);
        assert.match(await page.locator('h1').textContent(), /GPS Tracker in Jammu and Kashmir/);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://naviigps.com' + path);
        assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), await page.locator('meta[property="og:description"]').getAttribute('content'));
        const divisionSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Two administrative divisions, 20 district references', exact: true }) });
        const cards = divisionSection.locator('article');
        assert.equal(await cards.count(), 2);
        const graph = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.flatMap(script => {
          const value = JSON.parse(script.textContent);
          return value['@graph'] || [value];
        }));
        assert.ok(graph.some(item => item['@type'] === 'WebPage' && item.url === 'https://naviigps.com' + path));
        assert.ok(graph.some(item => item['@type'] === 'Service' && item.url === 'https://naviigps.com' + path && item.areaServed?.name === 'Jammu and Kashmir'));
        const faqSchema = graph.find(item => item['@type'] === 'FAQPage');
        assert.ok(faqSchema);
        assert.equal(faqSchema.mainEntity.length, 4);
        for (const [index, division] of expectedDivisions.entries()) {
          const card = cards.nth(index);
          assert.equal(await card.locator('h3').textContent(), division.name);
          assert.deepEqual(await card.locator('li').allTextContents(), division.districts);
          assert.equal(await card.locator('li').count(), 10);
        }
        const faqSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Jammu and Kashmir GPS tracking FAQs', exact: true }) });
        const details = faqSection.locator('details');
        assert.equal(await details.count(), 4);
        for (const [index, item] of faqSchema.mainEntity.entries()) {
          const disclosure = details.nth(index);
          assert.equal(await disclosure.locator('summary').textContent(), item.name);
          assert.equal(await disclosure.locator('p').textContent(), item.acceptedAnswer.text);
          await disclosure.locator('summary').click();
          assert.ok(await disclosure.locator('p').isVisible(), 'FAQ answer readable with JavaScript on/off');
        }
        assert.equal(await page.getByRole('link', { name: 'Discuss Your Fleet', exact: true }).getAttribute('href'), '/contact');
        assert.equal(await page.getByRole('link', { name: 'View India Coverage', exact: true }).getAttribute('href'), '/gps-tracker-india');
        assert.ok(await page.evaluate(limit => document.documentElement.scrollWidth <= limit, width), 'No horizontal overflow');
        await page.screenshot({ path: `${output}/jammu-kashmir-${width}-js-${javaScriptEnabled}.png` });
        await page.getByRole('link', { name: 'View India Coverage', exact: true }).click();
        await page.waitForURL(base + '/gps-tracker-india');
        const northSection = page.locator('#north-india');
        const directoryLink = northSection.locator('a[href="' + path + '"]').first();
        await directoryLink.scrollIntoViewIfNeeded();
        assert.ok(await directoryLink.isVisible(), 'North India directory links to the canonical guide');
        await directoryLink.click();
        await page.waitForURL(base + path);
        assert.equal(await page.locator('h1').count(), 1);
        assert.deepEqual(errors, [], 'No Jammu and Kashmir guide runtime errors');
      } finally {
        await context.close();
      }
    }
  }
  console.log('PASS Jammu and Kashmir guide: both divisions, 20 districts, four visible/schema FAQs, metadata/canonical, national-directory discovery and mobile layout at 320/390px with JavaScript on/off.');
}
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
  await verifyPublicPhone(page);
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
  assert.equal(await cta.getByRole('link', { name: /WhatsApp/ }).getAttribute('href'), 'https://wa.me/917717394007');
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

  await verifyLocalMobileJourney();
  await verifyContactProgressiveDisclosure();
  await verifyDelhiGuideMobileJourney();
  await verifyPuducherryGuideMobileJourney();
  await verifyJammuKashmirGuideMobileJourney();

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
  await verifyLocalLinks(staticPage);
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
  console.log('PASS premium Home: original hero asset, original CTA URLs, products/back, FAQ keyboard/repeated/native no-JS toggles, responsive overflow/screenshots, five local guide journeys at 320/390px with readable contact controls and no-JS discovery, reduced-motion and progressive reveal. No forms submitted or external API calls.');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
