import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:39114';
const now = Date.now();
const user = { id: 'qa', name: 'Synthetic QA', email: 'qa@example.invalid', role: 'CUSTOMER', companyId: 'qa-company', customerId: 'qa-customer' };
let speed = 35, holdVehicles = false, holdHistory = false, forbidden = false;
const counts = { vehicles: 0, history: 0 }, held = [], unexpected = [], errors = [];
const vehicle = () => ({ id: 'A', vehicleNo: 'QA-A', name: 'Synthetic vehicle', latitude: 30, longitude: 76, speed, ignition: true, battery: 12, lastUpdate: new Date(now).toISOString(), device: { id: 'qa-device', imei: 'synthetic', isActive: true, lastSeenAt: new Date(now).toISOString() } });
async function until(predicate, label) {
  const deadline = Date.now() + 15000;
  while (!(await predicate())) {
    assert.ok(Date.now() < deadline, label);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '39114'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverLog = '', browser, page;
for (const stream of [server.stdout, server.stderr]) stream.on('data', data => { serverLog = (serverLog + data).slice(-6000); });
try {
  await until(async () => {
    assert.equal(server.exitCode, null, serverLog);
    try { return (await fetch(base + '/login')).ok; } catch { return false; }
  }, 'Local server readiness');
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();
  await context.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url());
    if (url.origin === base) return route.continue();
    if (!['https://api.naviigps.com', 'http://127.0.0.1:39112'].includes(url.origin)) return route.abort();
    const headers = { 'access-control-allow-origin': base, 'access-control-allow-methods': 'GET', 'access-control-allow-headers': 'authorization' };
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    assert.equal(req.method(), 'GET');
    let data, status = 200;
    if (url.pathname === '/api/auth/me') data = user;
    else if (url.pathname === '/api/gps/vehicles') { counts.vehicles++; data = [vehicle()]; if (forbidden) status = 403; }
    else if (url.pathname === '/api/gps/history/A') { counts.history++; data = [{ id: 'qa-point', latitude: 30, longitude: 76, speed: 17, ignition: true, battery: 12, recordedAt: new Date(now).toISOString() }]; }
    else { unexpected.push(url.pathname); data = []; }
    const response = { status, headers, contentType: 'application/json', body: JSON.stringify({ success: status === 200, data }) };
    if ((url.pathname === '/api/gps/vehicles' && holdVehicles) || (url.pathname === '/api/gps/history/A' && holdHistory)) {
      await new Promise(resolve => held.push({ resource: url.pathname, release: async () => {
        try { await route.fulfill(response); } catch { /* already cancelled */ }
        resolve();
      } }));
      return;
    }
    await route.fulfill(response);
  });
  await context.addInitScript(user => {
    localStorage.setItem('navii_access_token', 'synthetic-test-only');
    localStorage.setItem('navii_user', JSON.stringify(user));
  }, user);
  page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install({ time: now });
  await page.goto(base + '/dashboard/vehicles/A', { waitUntil: 'domcontentloaded' });
  await page.getByText('35.0 km/h', { exact: true }).first().waitFor();
  await until(() => counts.history > 0, 'Initial history request');

  holdVehicles = true;
  await page.clock.runFor(5000);
  await until(() => held.length === 1, 'First slow vehicle request');
  const first = counts.vehicles;
  await page.clock.runFor(10000);
  assert.equal(counts.vehicles, first, 'A slow detail request must not overlap with subsequent polling');
  await page.clock.runFor(5001);
  await page.getByText(/Request timed out/).waitFor();
  holdVehicles = false; speed = 47;
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByText('47.0 km/h', { exact: true }).first().waitFor();
  for (const item of held.splice(0)) await item.release();
  assert.equal(await page.getByText('35.0 km/h', { exact: true }).count(), 0, 'Late old response cannot overwrite recovered speed');
  console.log('PASS detail requests coalesce; timeout recovers; late old response is ignored');

  holdHistory = true;
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await until(() => held.some(h => h.resource.endsWith('/history/A')), 'Slow history request');
  speed = 51;
  await page.clock.runFor(5000);
  await page.getByText('51.0 km/h', { exact: true }).first().waitFor();
  await page.clock.runFor(10001);
  await page.getByText(/History Error: Request timed out/).waitFor();
  await page.clock.runFor(5000);
  assert.equal(await page.getByText(/History Error: Request timed out/).count(), 1, 'Fleet success does not erase history error');
  holdHistory = false;
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await until(async () => await page.getByText(/History Error:/).count() === 0, 'History recovers');
  for (const item of held.splice(0)) await item.release();
  console.log('PASS live detail refresh is independent of slow history and its error');

  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const paused = { ...counts };
  await page.clock.runFor(130000);
  assert.deepEqual(counts, paused, 'Hidden detail view pauses all polling');
  assert.equal(await page.getByText('51.0 km/h', { exact: true }).count(), 0, 'Cached GPS speed expires independently of successful requests');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('online'));
  });
  await until(() => counts.vehicles > paused.vehicles && counts.history > paused.history, 'Resume refreshes both resources');
  await page.getByText('Last GPS fix', { exact: true }).waitFor();
  assert.equal(await page.getByText('51.0 km/h', { exact: true }).count(), 0, 'A heartbeat/request does not refresh the real GPS event time');
  console.log('PASS hidden pause, immediate resume and stale-speed suppression');

  forbidden = true;
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByRole('heading', { name: 'Vehicle Unavailable' }).waitFor();
  assert.equal(await page.getByText('QA-A', { exact: true }).count(), 0, 'Access revocation clears cached vehicle');
  await mkdir('test-results/gps-browser', { recursive: true });
  await page.screenshot({ path: 'test-results/gps-browser/vehicle-detail-refresh.png' });
  await page.goto(base + '/login', { waitUntil: 'domcontentloaded' });
  const stopped = { ...counts };
  await page.clock.runFor(20000);
  assert.deepEqual(counts, stopped, 'Navigation stops polling');
  assert.deepEqual(unexpected, []); assert.deepEqual(errors, []);
  console.log('PASS revoked access clears cached detail; navigation cancels polling; synthetic traffic only');
} finally {
  for (const item of held) await item.release();
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
