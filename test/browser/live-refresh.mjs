import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:39113';
const user = { id: 'qa', name: 'Synthetic QA', email: 'qa@example.invalid', role: 'CUSTOMER', companyId: 'qa-company', customerId: 'qa-customer' };
const now = Date.now();
const counts = { latest: 0, history: 0 };
const held = [];
let holdLatest = false, holdHistory = false, historyFailure = false, bPoints = 2, speed = 35;
const vehicle = (id) => ({ id, vehicleNo: `QA-${id}`, name: 'Synthetic QA', vehicleType: 'CAR', companyId: user.companyId, customerId: user.customerId, dealerId: null, status: 'MOVING', speed, ignition: true, battery: 12, latitude: 30, longitude: 76, lastUpdate: new Date(now).toISOString(), device: { id: `device-${id}`, imei: `synthetic-${id}`, model: 'test', isActive: true, lastSeenAt: new Date(now).toISOString() } });
const points = n => Array.from({ length: n }, (_, i) => ({ id: `point-${i}`, latitude: 30 + i / 1000, longitude: 76, speed: 35, ignition: true, recordedAt: new Date(now - i * 1000).toISOString() }));
async function until(predicate, label) {
  const deadline = Date.now() + 15000;
  while (!(await predicate())) {
    assert.ok(Date.now() < deadline, label);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '39113'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverLog = '', browser, page;
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { serverLog = (serverLog + data).slice(-6000); });
try {
  await until(async () => {
    assert.equal(server.exitCode, null, serverLog);
    try { return (await fetch(base + '/login')).ok; } catch { return false; }
  }, 'Local server readiness');
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const unexpected = [];
  await context.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url());
    if (url.origin === base) return route.continue();
    if (!['https://api.naviigps.com', 'http://127.0.0.1:39112'].includes(url.origin)) return route.abort();
    const headers = { 'access-control-allow-origin': base, 'access-control-allow-methods': 'GET', 'access-control-allow-headers': 'authorization' };
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    assert.equal(req.method(), 'GET', 'Synthetic inspection never writes');
    let data, status = 200, message;
    if (url.pathname === '/api/auth/me') data = user;
    else if (url.pathname === '/api/gps/latest') {
      counts.latest++;
      data = [vehicle('A'), vehicle('B')];
    } else if (url.pathname.startsWith('/api/gps/history/')) {
      counts.history++;
      data = points(url.pathname.endsWith('/A') ? 1 : bPoints);
      if (historyFailure) { status = 503; message = 'Synthetic history outage'; }
    } else { unexpected.push(url.pathname); data = []; }
    const response = { status, headers, contentType: 'application/json', body: JSON.stringify({ success: status === 200, data, message }) };
    if ((url.pathname === '/api/gps/latest' && holdLatest) || (url.pathname.endsWith('/history/A') && holdHistory)) {
      await new Promise(resolve => held.push(async () => {
        // A real browser may already have aborted this retired request.
        try { await route.fulfill(response); } catch { /* expected cancellation */ }
        resolve();
      }));
      return;
    }
    await route.fulfill(response);
  });
  await context.addInitScript(({ user }) => {
    localStorage.setItem('navii_access_token', 'synthetic-test-only');
    localStorage.setItem('navii_user', JSON.stringify(user));
  }, { user });
  page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install({ time: now });
  await page.goto(base + '/dashboard/live-tracking', { waitUntil: 'domcontentloaded' });
  const routeCount = n => page.getByText(new RegExp(`^${n} GPS points loaded`));
  await routeCount(1).waitFor();

  holdHistory = true;
  await page.getByRole('button', { name: 'Refresh Route', exact: true }).click();
  await until(() => held.length === 1, 'Delayed A history request');
  await page.getByRole('button').filter({ has: page.getByText('QA-B', { exact: true }) }).click();
  await routeCount(2).waitFor();
  holdHistory = false;
  await held.shift()();
  assert.equal(await routeCount(1).count(), 0, 'Retired A history cannot replace selected B');
  bPoints = 3;
  await page.clock.runFor(15000);
  await routeCount(3).waitFor();
  console.log('PASS selected route refreshes without reselection; stale selection response ignored');

  historyFailure = true;
  await page.getByRole('button', { name: 'Refresh Route', exact: true }).click();
  await page.getByText('History Error: Synthetic history outage').waitFor();
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.clock.runFor(5000);
  assert.equal(await page.getByText('History Error: Synthetic history outage').count(), 1);
  historyFailure = false;
  await page.getByRole('button', { name: 'Refresh Route', exact: true }).click();
  await routeCount(3).waitFor();
  console.log('PASS successful fleet refresh does not hide failed route history');

  holdLatest = true;
  await page.clock.runFor(5000);
  await until(() => held.length === 1, 'Delayed fleet request');
  const started = counts.latest;
  await page.clock.runFor(10000);
  assert.equal(counts.latest, started, 'Only one fleet request while slow');
  await page.clock.runFor(5001);
  await page.getByText(/API Error: Request timed out/).waitFor();
  holdLatest = false;
  speed = 47;
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByText('47.0 km/h', { exact: true }).first().waitFor();
  await held.shift()();
  assert.equal(await page.getByText('35.0 km/h', { exact: true }).count(), 0);
  console.log('PASS slow request never overlaps; timeout recovers; late result cannot overwrite newer data');

  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const beforeHidden = { ...counts };
  await page.clock.runFor(30000);
  assert.deepEqual(counts, beforeHidden, 'Hidden tab makes no fleet/history requests');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await until(() => counts.latest > beforeHidden.latest && counts.history > beforeHidden.history, 'Visible tab immediately refreshes both resources');
  console.log('PASS hidden tab pauses; visible tab resumes immediately');

  await mkdir('test-results/gps-browser', { recursive: true });
  await page.screenshot({ path: 'test-results/gps-browser/live-refresh.png', fullPage: true });
  await page.goto(base + '/login', { waitUntil: 'domcontentloaded' });
  const beforeUnmount = { ...counts };
  await page.clock.runFor(20000);
  assert.deepEqual(counts, beforeUnmount, 'Navigation stops polling');
  assert.deepEqual(unexpected, []);
  assert.deepEqual(errors, []);
  console.log('PASS unmount stops polling; browser fixtures only; no production access');
} catch (error) {
  if (page) {
    await mkdir('test-results/gps-browser', { recursive: true });
    await page.screenshot({ path: 'test-results/gps-browser/live-refresh-failure.png', fullPage: true }).catch(() => {});
    console.error('Synthetic page state:', await page.locator('body').innerText().catch(() => 'unavailable'));
  }
  throw error;
} finally {
  for (const release of held) await release();
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
