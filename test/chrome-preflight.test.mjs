import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verifyInstalledChrome } from './browser/chrome-preflight.mjs';

const suites = ['gps-freshness', 'live-refresh', 'vehicle-detail-refresh', 'product-showcase', 'home-premium', 'shop-pricing'];

test('CI requires bounded real Chrome preflight and retains all six existing main browser suites', () => {
  const workflow = readFileSync(new URL('../.github/workflows/seo-quality.yml', import.meta.url), 'utf8');
  const steps = workflow.split(/^      - name: /m);
  const preflight = steps.find(step => step.startsWith('Verify installed sandboxed Chrome\n'));
  assert.ok(preflight);
  assert.match(preflight, /timeout-minutes: 2/);
  assert.match(preflight, /run: node test\/browser\/chrome-preflight\.mjs\s*$/);
  assert.doesNotMatch(preflight, /continue-on-error|if:|--list|\|\|/);
  assert.doesNotMatch(workflow, /playwright install|apt-get|continue-on-error/);
  assert.match(workflow, /node-version: 22/);
  assert.match(workflow, /run: npm ci/);
  const commands = [...workflow.matchAll(/run: node test\/browser\/([a-z-]+)\.mjs/g)].map(match => match[1]);
  assert.deepEqual(commands, ['chrome-preflight', ...suites]);
  assert.ok(workflow.includes('run: npm run build'));
  assert.ok(workflow.indexOf('run: npm run build') < workflow.indexOf(preflight));
  for (const suite of suites) {
    const step = steps.find(item => item.includes(`run: node test/browser/${suite}.mjs`));
    assert.doesNotMatch(step, /continue-on-error|--list|\|\|/);
    assert.ok(workflow.indexOf(preflight) < workflow.indexOf(step));
  }
});

test('Every browser suite selects installed Chrome on CI with sandboxing and no weakening flags', () => {
  for (const suite of suites) {
    const source = readFileSync(new URL(`./browser/${suite}.mjs`, import.meta.url), 'utf8');
    assert.match(source, /chromium\.launch\(/, suite);
    assert.match(source, /chromiumSandbox\s*:\s*true/, suite);
    assert.match(source, /process\.env\.CI\s*\?\s*\{\s*channel\s*:\s*['"]chrome['"]/, suite);
    assert.doesNotMatch(source, /--no-sandbox|--disable-setuid-sandbox|chromiumSandbox\s*:\s*false/, suite);
  }
});

function fixture({ fail, version = '142.0.7444.175', network } = {}) {
  const calls = [], handlers = {};
  async function stage(name, value) {
    calls.push(name);
    if (fail === name) throw Error(`Synthetic ${name} failure`);
    return value;
  }
  const page = {
    setDefaultTimeout(value) { assert.equal(value, 5000); },
    goto(url, options) { assert.equal(url, 'about:blank'); assert.deepEqual(options, { timeout: 5000 }); return stage('goto'); },
    async setContent(html, options) {
      assert.equal(html, '<!doctype html><title>NAVII browser preflight</title><h1>Sandboxed Chrome check</h1>');
      assert.deepEqual(options, { timeout: 5000 });
      await stage('setContent');
      if (network === 'http') await handlers.http({ request: () => ({ url: () => 'https://unexpected.example.invalid/' }), abort: () => stage('abort') });
      if (network === 'websocket') await handlers.websocket({ url: () => 'wss://unexpected.example.invalid/', close: options => { assert.equal(options.code, 1008); return stage('socketClose'); } });
    },
    locator(selector) { assert.equal(selector, 'h1'); return { innerText: () => stage('read', 'Sandboxed Chrome check') }; },
    evaluate(callback) { return stage('evaluate', callback()); },
  };
  const context = {
    async route(pattern, callback) { assert.equal(pattern, '**/*'); handlers.http = callback; },
    async routeWebSocket(pattern, callback) { assert.equal(pattern, '**/*'); handlers.websocket = callback; },
    newPage: () => stage('newPage', page),
    close: () => stage('contextClose'),
  };
  const browser = {
    version: () => version,
    newContext(options) { assert.deepEqual(options, { serviceWorkers: 'block' }); return stage('newContext', context); },
    close: () => stage('browserClose'),
  };
  const chromium = {
    launch(options) {
      assert.deepEqual(options, { headless: true, chromiumSandbox: true, channel: 'chrome', timeout: 30000 });
      return stage('launch', browser);
    },
  };
  return { chromium, calls };
}

test('Preflight requires real launch, version, inert DOM and script execution before success', async () => {
  const f = fixture();
  assert.deepEqual(await verifyInstalledChrome(f.chromium), { channel: 'chrome', version: '142.0.7444.175', chromiumSandbox: true });
  assert.deepEqual(f.calls, ['launch', 'newContext', 'newPage', 'goto', 'setContent', 'read', 'evaluate', 'contextClose', 'browserClose']);
});

for (const fail of ['launch', 'newContext', 'newPage', 'goto', 'setContent', 'read', 'evaluate', 'contextClose', 'browserClose']) {
  test(`Preflight fails closed on ${fail} failure, without a fallback or ignored error`, async () => {
    const f = fixture({ fail });
    await assert.rejects(verifyInstalledChrome(f.chromium), new RegExp(`Synthetic ${fail} failure`));
    assert.equal(f.calls.filter(call => call === 'launch').length, 1);
    if (fail !== 'launch') assert.equal(f.calls.filter(call => call === 'browserClose').length, 1);
  });
}

test('Missing browser version cannot pass and still closes the launched browser', async () => {
  const f = fixture({ version: '' });
  await assert.rejects(verifyInstalledChrome(f.chromium), /valid version/);
  assert.deepEqual(f.calls, ['launch', 'browserClose']);
});

for (const network of ['http', 'websocket']) {
  test(`Preflight blocks unexpected ${network} traffic and fails instead of claiming success`, async () => {
    const f = fixture({ network });
    await assert.rejects(verifyInstalledChrome(f.chromium), /must not make network requests/);
    assert.ok(f.calls.includes(network === 'http' ? 'abort' : 'socketClose'));
    assert.equal(f.calls.at(-1), 'browserClose');
  });
}

test('Preflight CLI invokes actual verification before printing PASS', () => {
  const source = readFileSync(new URL('./browser/chrome-preflight.mjs', import.meta.url), 'utf8');
  assert.match(source, /const \{ chromium \} = await import\('playwright'\)/);
  assert.match(source, /const result = await verifyInstalledChrome\(chromium\);\s*console\.log\('PASS:/);
  assert.doesNotMatch(source, /--list|process\.exit\(0\)|\.catch\(|no-sandbox|execSync|spawn\(/);
});
