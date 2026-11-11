/** Real-browser session isolation. Every non-local request is intercepted.
 * Uses synthetic accounts only. Run against an already completed production build.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const base = 'http://127.0.0.1:39125';
const output = 'test-results/dashboard-session';
const tokenA = 'synthetic-session-A', tokenB = 'synthetic-session-B';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const profile = (role, account = 'A') => ({ id: `synthetic-${account}`, name: `Synthetic account ${account}`, role, companyId: `company-${account}`, email: `${account}@example.invalid` });
const caps = { geofenceWrite: true, overspeedConfiguration: true, eventEvaluation: false, emailDelivery: false, smsDelivery: false, lowBattery: false };
const vehicle = account => ({ id: `vehicle-${account}`, vehicleNo: `PRIVATE-VEHICLE-${account}`, name: `PRIVATE-VEHICLE-${account}`, latitude: 30, longitude: 76, speed: 35, battery: 12, ignition: null, lastUpdate: new Date().toISOString(), device: { id: `device-${account}`, imei: 'synthetic-imei', isActive: true, lastSeenAt: new Date().toISOString() } });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '39125'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser, log = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => { log = (log + chunk).slice(-6000); });

async function fixture(role, delayPath = null) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
  const state = { calls: [], errors: [], writes: [], held: [], delayPath, released: false, console: [], failedRequests: [] };
  context.on('page', page => {
    page.on('pageerror', error => state.errors.push(error.message));
    page.on('console', message => { if (state.console.length < 100) state.console.push({ type: message.type(), text: message.text() }); });
    page.on('requestfailed', request => { if (state.failedRequests.length < 100) state.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }); });
  });
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === base) return route.continue();
    // Nothing else can reach the network, including analytics, fonts and tiles.
    if (!['https://api.naviigps.com', 'http://127.0.0.1:39112'].includes(url.origin)) return route.abort();
    const headers = { 'access-control-allow-origin': base, 'access-control-allow-methods': 'GET', 'access-control-allow-headers': 'authorization,content-type' };
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    state.calls.push({ path: url.pathname, token: request.headers().authorization });
    if (request.method() !== 'GET') { state.writes.push(url.pathname); return route.fulfill({ status: 405, headers, body: '{}' }); }
    const account = request.headers().authorization === `Bearer ${tokenB}` ? 'B' : 'A';
    let body;
    if (url.pathname === '/api/auth/me') body = { success: true, data: profile(role, account) };
    else if (url.pathname === '/api/gps/vehicles') body = { success: true, data: [vehicle(account)] };
    else if (url.pathname === '/api/gps/customer-alert-settings') body = { success: true, truncated: false, vehicles: [vehicle(account)], capabilities: caps, data: [{ vehicleId: `vehicle-${account}`, revision: 1, overspeedEnabled: true, speedLimitKph: 65, cooldownMinutes: 10, emailRequested: true, emailRecipients: [`private-${account}@example.invalid`] }] };
    else if (url.pathname === '/api/gps/customer-geofences') body = { success: true, truncated: false, data: [{ id: `area-${account}`, vehicleId: `vehicle-${account}`, name: `PRIVATE-AREA-${account}`, latitude: 30, longitude: 76, radius: 500, isActive: true, alertOnEntry: true, alertOnExit: true, revision: 1, clientRequestId: `fixture-${account}` }] };
    else throw Error(`Unexpected fixture API read: ${url.pathname}`);
    if (url.pathname === state.delayPath && !state.released) await new Promise(resolve => state.held.push(resolve));
    // Navigation may abort this held request; no alternate network path is used.
    await route.fulfill({ status: 200, headers, contentType: 'application/json', body: JSON.stringify(body) }).catch(() => {});
  });
  const page = await context.newPage();
  await page.goto(base + '/login');
  await page.evaluate(({ token, user }) => { localStorage.setItem('navii_access_token', token); localStorage.setItem('navii_user', JSON.stringify(user)); }, { token: tokenA, user: profile(role) });
  const other = await context.newPage(); await other.goto(base + '/login');
  return { context, page, other, state };
}
async function until(check, message, attempts = 100) { for (let i = 0; i < attempts; i++) { if (await check()) return; await sleep(50); } assert.fail(message); }
async function noOldContent(page) {
  await until(async () => !/Synthetic account A|PRIVATE-VEHICLE-A|PRIVATE-AREA-A/.test(await page.locator('body').innerText()), 'Old account content must disappear');
  assert.equal(await page.locator('textarea').filter({ hasText: 'private-A@example.invalid' }).count(), 0);
  assert.ok(!(await page.locator('input, textarea').evaluateAll(nodes => nodes.map(node => node.value))).includes('private-A@example.invalid'));
}
async function recordFailure(fixture, name, error) {
  await mkdir(output, { recursive: true });
  const prefix = name.replace(/[^a-zA-Z0-9_-]/g, '-');
  const pages = [];
  for (const [index, page] of fixture.context.pages().entries()) {
    if (page.isClosed()) continue;
    pages.push({ index, url: page.url() });
    // Only synthetic fixture pages are opened. Capture before releasing held
    // requests or closing either tab so the original failure remains visible.
    await page.screenshot({ path: `${output}/${prefix}-tab-${index}.png`, fullPage: true, timeout: 5000 }).catch(() => {});
    await page.content().then(html => writeFile(`${output}/${prefix}-tab-${index}.html`, html)).catch(() => {});
    await page.locator('input:not([type=password]), textarea, select').evaluateAll(nodes => nodes.map(node => ({ tag: node.tagName, placeholder: node.getAttribute('placeholder'), value: node.value })))
      .then(fields => writeFile(`${output}/${prefix}-tab-${index}-fields.json`, JSON.stringify(fields, null, 2))).catch(() => {});
  }
  const { calls, errors, writes, delayPath, released, console: consoleMessages, failedRequests } = fixture.state;
  await writeFile(`${output}/${prefix}.json`, JSON.stringify({ failure: error.stack || String(error), pages, calls, errors, writes, delayPath, released, consoleMessages, failedRequests, serverLog: log }, null, 2));
}
function release(state) { state.released = true; for (const resolve of state.held.splice(0)) resolve(); }

try {
  await until(async () => { if (server.exitCode !== null) throw Error(log); try { return (await fetch(base + '/login')).ok; } catch { return false; } }, 'Local production server did not start: ' + log, 900);
  browser = await chromium.launch({ headless: true, chromiumSandbox: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : process.env.CI ? { channel: 'chrome' } : {}) });
  for (const role of ['CUSTOMER', 'ADMIN', 'DEALER']) {
    for (const change of ['replace', 'logout']) {
      const paths = role === 'CUSTOMER' ? [null, '/api/gps/customer-alert-settings', '/api/gps/customer-geofences', '/api/gps/vehicles'] : [null, '/api/gps/vehicles'];
      for (const delayed of paths) {
        const f = await fixture(role, delayed);
        try {
          const settings = role === 'CUSTOMER' && delayed !== '/api/gps/vehicles';
          await f.page.goto(base + (settings ? '/dashboard/customer-settings' : '/dashboard'));
          if (delayed) await until(() => f.state.held.length > 0, 'Expected pending API request');
          else if (settings) {
            await f.page.getByRole('button', { name: 'Edit PRIVATE-AREA-A', exact: true }).waitFor();
            // Use the component's unique placeholder for the already-populated
            // textarea; the existing suite fills this field while initially empty.
            const recipients = f.page.getByPlaceholder('name@example.com, other@example.com', { exact: true });
            assert.equal(await recipients.count(), 1, 'Exactly one source-defined recipients field');
            assert.equal(await recipients.inputValue(), 'private-A@example.invalid');
          } else await f.page.getByText('PRIVATE-VEHICLE-A', { exact: true }).first().waitFor();
          // Keep an authenticated history entry behind the invalidated one so
          // Back actually revisits the dashboard, rather than another login URL.
          await f.page.evaluate(() => history.pushState({}, '', location.pathname + '?session-history=1'));
          await f.other.evaluate(({ change, token, user }) => {
            if (change === 'logout') { localStorage.removeItem('navii_access_token'); localStorage.removeItem('navii_user'); }
            else { localStorage.setItem('navii_access_token', token); localStorage.setItem('navii_user', JSON.stringify(user)); }
          }, { change, token: tokenB, user: profile(role, 'B') });
          await f.page.waitForURL('**/login'); await noOldContent(f.page);
          release(f.state); await sleep(150); await noOldContent(f.page);
          assert.ok(!f.state.calls.some(call => call.token === `Bearer ${tokenB}`), 'Replacement credentials cannot fetch under the old mounted workspace');
          // A deliberately revisited dashboard may verify B afresh, but never restore A.
          await f.page.goBack(); await sleep(200); await noOldContent(f.page);
          await f.page.goForward(); await sleep(200); await noOldContent(f.page);
          assert.deepEqual(f.state.errors, []); assert.deepEqual(f.state.writes, []);
          console.log(`PASS ${role} ${change} ${delayed || 'loaded data'} with history traversal`);
        } catch (error) {
          await recordFailure(f, `${role}-${change}-${delayed || 'loaded'}`, error);
          throw error;
        } finally { release(f.state); await f.context.close(); }
      }
    }
  }
  for (const role of ['CUSTOMER', 'ADMIN', 'DEALER']) {
    const f = await fixture(role);
    try {
      await f.page.goto(base + '/dashboard');
      await f.page.getByText('PRIVATE-VEHICLE-A', { exact: true }).first().waitFor();
      // Same task: replace storage then invoke the still-mounted A logout before
      // any focus/storage-event invalidation can hide the button.
      await f.page.evaluate(({ token, user }) => {
        localStorage.setItem('navii_access_token', token); localStorage.setItem('navii_user', JSON.stringify(user));
        const button = [...document.querySelectorAll('button')].find(node => /log\s*out/i.test(node.getAttribute('aria-label') || node.textContent || ''));
        if (!button) throw Error('Logout button missing'); button.click();
      }, { token: tokenB, user: profile(role, 'B') });
      await f.page.waitForURL('**/login'); await noOldContent(f.page);
      assert.deepEqual(await f.page.evaluate(() => [localStorage.getItem('navii_access_token'), JSON.parse(localStorage.getItem('navii_user')).id]), [tokenB, 'synthetic-B']);
      assert.ok(!f.state.calls.some(call => call.token === `Bearer ${tokenB}`));
      assert.deepEqual(f.state.errors, []); assert.deepEqual(f.state.writes, []);
      console.log(`PASS ${role} stale logout preserves newer credentials`);
    } catch (error) {
      await recordFailure(f, `${role}-stale-logout`, error);
      throw error;
    } finally { await f.context.close(); }
  }
  console.log('PASS synthetic-only cross-tab session browser regressions');
} catch (error) {
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/failure.log`, `${error.stack || error}\n\nLocal server:\n${log}`);
  throw error;
} finally { if (browser) await browser.close(); server.kill('SIGTERM'); }
