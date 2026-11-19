/** Isolated customer/login browser QA. All API, map and third-party traffic is intercepted.
 * Run against a completed production build: node test/browser/customer-portal.mjs
 * Screenshots contain synthetic vehicles and synthetic map tiles, never customer data.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:39121';
const output = 'test-results/customer-portal';
const apiOrigins = new Set(['https://api.naviigps.com', 'http://127.0.0.1:39112']);
const fixtureUser = (role = 'CUSTOMER') => ({ id: 'qa-user', name: 'Synthetic Customer', email: 'qa@example.invalid', role, companyId: 'qa-company', customerId: 'qa-customer' });
const vehicle = (id, type, name, speed = 35) => ({ id, vehicleNo: name, name, vehicleType: type, companyId: 'qa-company', customerId: 'qa-customer', dealerId: null, status: 'MOVING', speed, ignition: true, battery: 12.3, latitude: 30, longitude: 76, lastUpdate: new Date().toISOString(), device: { id: `${id}-device`, imei: `${id}-synthetic-imei`, model: 'Synthetic fixture', simNumber: 'synthetic-sim', isActive: true, lastSeenAt: new Date().toISOString() } });
const tiles = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#eef1e9"/><path d="M0 100H256M80 0V256M0 180L256 40" fill="none" stroke="#fff" stroke-width="12"/><text x="8" y="240" font-size="10" fill="#68777a">SYNTHETIC QA MAP</text></svg>';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function createFixture(browser, options = {}) {
  const state = { role: 'CUSTOMER', login: 'success', profile: 'success', requests: [], writes: [], unexpected: [], zooms: [], loginCount: 0, delay: 0, ...options };
  const context = await browser.newContext({ viewport: options.viewport || { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await context.route('**/*', async route => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.origin === base) return route.continue();
    if (apiOrigins.has(url.origin)) {
      const headers = { 'access-control-allow-origin': base, 'access-control-allow-methods': 'GET,POST', 'access-control-allow-headers': 'authorization,content-type' };
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
      state.requests.push(`${req.method()} ${url.pathname}`);
      let status = 200, data;
      if (url.pathname === '/api/auth/login' && req.method() === 'POST') {
        state.loginCount++;
        state.writes.push(req.postDataJSON());
        if (state.delay) await sleep(state.delay);
        if (state.login === 'offline') return route.abort('failed');
        status = state.login === 'failure' ? 401 : 200;
        data = { accessToken: 'synthetic-test-only', user: fixtureUser('ADMIN') }; // Never trust the login response role.
      } else if (req.method() !== 'GET') {
        state.unexpected.push(`${req.method()} ${url.pathname}`);
        return route.fulfill({ status: 405, headers, body: '{}' });
      } else if (url.pathname === '/api/auth/me') {
        status = state.profile === 'failure' ? 401 : 200;
        data = fixtureUser(state.role);
      } else if (['/api/gps/vehicles', '/api/gps/latest'].includes(url.pathname)) {
        data = [vehicle('qa-car', 'CAR', 'QA CAR'), vehicle('qa-scooter', 'EV_SCOOTER', 'QA EV SCOOTER', 0)];
      } else if (url.pathname.startsWith('/api/gps/history/')) data = [];
      else if (/capabilit/.test(url.pathname)) status = 404;
      else { state.unexpected.push(`${req.method()} ${url.pathname}`); status = 404; }
      return route.fulfill({ status, headers, contentType: 'application/json', body: JSON.stringify({ success: status === 200, data, message: status === 401 ? 'Synthetic verification failed' : 'Synthetic unsupported capability' }) });
    }
    if (/\.tile\.openstreetmap\.org$/.test(url.hostname)) {
      state.zooms.push(Number(url.pathname.split('/')[1]));
      return route.fulfill({ contentType: 'image/svg+xml', body: tiles });
    }
    return route.abort(); // Never contact production, analytics, map vendors, or third parties.
  });
  if (options.session) await context.addInitScript(user => {
    localStorage.setItem('navii_access_token', 'synthetic-test-only');
    localStorage.setItem('navii_user', JSON.stringify(user));
  }, fixtureUser(options.storedRole || state.role));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.stack || error.message));
  return { context, page, state, errors };
}
async function noOverflow(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'No horizontal page overflow');
}
async function fillLogin(page) {
  await page.getByLabel('Email Address', { exact: true }).fill('QA@EXAMPLE.INVALID');
  await page.getByLabel('Password', { exact: true }).fill('synthetic-not-a-real-password');
}
async function emptySession(page) {
  assert.deepEqual(await page.evaluate(() => [localStorage.getItem('navii_access_token'), localStorage.getItem('navii_user')]), [null, null]);
}

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '39121'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverLog = '', browser;
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { serverLog = (serverLog + data).slice(-6000); });
try {
  const deadline = Date.now() + 45000;
  let ready = false;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw Error('Local Next server exited: ' + serverLog);
    try { if ((await fetch(base + '/login')).ok) { ready = true; break; } } catch { /* local startup */ }
    await sleep(500);
  }
  assert.ok(ready, 'Local Next readiness timeout: ' + serverLog);
  browser = await chromium.launch({ headless: true, chromiumSandbox: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : process.env.CI ? { channel: "chrome" } : {}) });
  await mkdir(output, { recursive: true });
  const f = await createFixture(browser);
  await f.page.goto(base + '/login');
  await fillLogin(f.page);
  await f.page.getByRole('button', { name: 'Show password', exact: true }).click();
  assert.equal(await f.page.getByLabel('Password', { exact: true }).getAttribute('type'), 'text');
  await f.page.getByRole('button', { name: 'Hide password', exact: true }).click();
  f.state.login = 'failure';
  await f.page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await f.page.getByRole('alert').waitFor();
  await emptySession(f.page);
  await f.page.waitForFunction(() => document.activeElement?.id === "login-error", null, { timeout: 5000 });
  assert.equal(await f.page.evaluate(() => document.activeElement?.id), "login-error");
  f.state.login = 'success'; f.state.profile = 'failure';
  await f.page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await f.page.getByRole('button', { name: 'Sign In', exact: true }).waitFor();
  await emptySession(f.page);
  f.state.login = 'offline'; f.state.profile = 'success';
  await f.page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await f.page.getByRole('alert').filter({ hasText: 'Unable to connect' }).waitFor();
  await emptySession(f.page);
  await noOverflow(f.page);
  await f.page.screenshot({ path: `${output}/login-recoverable-error.png`, fullPage: true });
  f.state.login = 'success'; f.state.delay = 500;
  const before = f.state.loginCount;
  await f.page.locator('form').evaluate(form => { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  await f.page.getByTestId('customer-home').waitFor();
  assert.equal(f.state.loginCount, before + 1, 'Repeated submit while pending sends exactly one login POST');
  assert.equal(f.state.writes.at(-1).email, 'qa@example.invalid');
  assert.equal(JSON.parse(await f.page.evaluate(() => localStorage.getItem('navii_user'))).role, 'CUSTOMER', 'Verified profile role wins over login payload');
  assert.deepEqual(f.errors, []);
  await f.context.close();
  console.log('PASS login failure, profile rejection, network interruption, retry, normalized email, duplicate submit guard');
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }], ['small-mobile', { width: 320, height: 740 }]]) {
    const f = await createFixture(browser, { session: true, viewport });
    await f.page.goto(base + '/dashboard');
    await f.page.getByTestId('customer-home').waitFor();
    await f.page.getByText('35.0 km/h', { exact: true }).first().waitFor();
    await f.page.getByTestId('customer-map').waitFor();
    await f.page.getByTestId('customer-device-details').getByText('qa-car-synthetic-imei', { exact: true }).waitFor();
    const mapBox = await f.page.getByTestId('customer-map').boundingBox();
    const detailsBox = await f.page.getByTestId('customer-device-details').boundingBox();
    assert.ok(detailsBox.y >= mapBox.y + mapBox.height - 1, 'Identifiers must be below the map, never overlay it');
    await noOverflow(f.page);
    const mapSurface = f.page.getByTestId('customer-map').locator('.leaflet-container');
    assert.equal(await mapSurface.evaluate(node => getComputedStyle(node).filter), 'none', 'Map is not darkened with a CSS filter');
    await f.page.locator('.leaflet-control-zoom-in').click();
    for (let tries = 0; tries < 30 && !f.state.zooms.includes(16); tries++) await sleep(100);
    assert.ok(f.state.zooms.includes(16), 'Zoom in requests zoom-16 map tiles');
    f.state.zooms.length = 0;
    await f.page.getByRole('button', { name: 'Refresh tracking', exact: true }).click();
    await sleep(650);
    assert.ok(!f.state.zooms.includes(15), 'Tracking refresh must not reset user zoom');
    await f.page.locator('.leaflet-control-zoom-out').click();
    await f.page.getByRole('button', { name: 'Recenter', exact: true }).click();
    const consent = f.page.getByRole("button", { name: "Necessary Only", exact: true });
    if (await consent.isVisible()) await consent.click();
    if (viewport.width <= 800) {
      const cookieBox = await f.page.getByRole("button", {name: "Open analytics cookie settings", exact: true}).boundingBox();
      const dockBox = await f.page.getByRole("navigation", {name: "Quick navigation", exact: true}).boundingBox();
      assert.ok(cookieBox && dockBox && cookieBox.y + cookieBox.height <= dockBox.y, "Cookie preferences stay accessible above the dock");
    }
    await f.page.locator("h1").click();
    await f.page.evaluate(() => window.scrollTo(0, 0));
    await f.page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    await f.page.getByLabel('Vehicle', { exact: true }).selectOption('qa-scooter');
    await f.page.getByText('0.0 km/h', { exact: true }).first().waitFor();
    await f.page.getByTestId('customer-device-details').getByText('qa-scooter-synthetic-imei', { exact: true }).waitFor();
    assert.ok((await f.page.locator('img[src*="ev_scooter.svg"]').count()) > 0, 'Selected EV scooter uses its detailed vehicle-specific asset');
    await f.page.getByRole('button', { name: 'Refresh tracking', exact: true }).click();
    assert.equal(await f.page.getByLabel('Vehicle', { exact: true }).inputValue(), 'qa-scooter', 'Refresh preserves selection');
    assert.deepEqual(f.state.writes, []);
    assert.deepEqual(f.state.unexpected, []);
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log('PASS customer responsive/map identifiers/selection:', name);
  }
  for (const role of ['USER', 'ADMIN', 'DEALER']) {
    const f = await createFixture(browser, { role, storedRole: role === 'USER' ? 'ADMIN' : 'CUSTOMER', session: true });
    await f.page.goto(base + '/dashboard');
    await f.page.getByText('35.0 km/h', { exact: true }).first().waitFor();
    assert.equal(await f.page.getByTestId('customer-home').count(), role === 'USER' ? 1 : 0, 'Verified server role, not persisted stale role, decides customer UI');
    if (role !== 'USER') assert.ok(await f.page.getByText('Open Alerts', { exact: true }).count(), 'Existing admin/dealer dashboard retained');
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log('PASS verified role boundary:', role);
  }
  console.log('PASS synthetic-only customer portal browser QA');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
