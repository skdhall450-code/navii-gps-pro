import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
const source = fs.readFileSync(new URL('../public/tracking-share/viewer.js', import.meta.url), 'utf8');
const fixture = { vehicleLabel: 'SYNTHETIC', status: 'CURRENT', position: { latitude: 1, longitude: 2, speedKph: 3 }, gpsAgeSeconds: 0, lastGpsAt: '2026-10-07T10:00:00.000Z', serverTime: '2026-10-07T10:00:00.000Z', expiresAt: '2026-10-07T11:00:00.000Z' };
const flush = () => new Promise(resolve => setImmediate(resolve));
function boot(hash = '#nvl_' + 'a'.repeat(43)) {
  const els = Object.fromEntries(['location', 'vehicle', 'status', 'age', 'coordinates', 'speed', 'expires', 'refresh', 'notice'].map(id => [id, { hidden: true, textContent: '', disabled: false, addEventListener() {} }]));
  const listeners = {}, intervals = [], fetches = [];
  let clock = 0, replaced;
  const document = { hidden: false, getElementById: id => els[id], querySelector: () => ({ content: 'http://127.0.0.1/position' }), addEventListener: (name, fn) => listeners[name] = fn };
  const window = { location: { hash, pathname: '/share' }, history: { replaceState: (...args) => { replaced = args; window.location.hash = ''; } }, addEventListener: (name, fn) => listeners[name] = fn };
  vm.runInNewContext(source, { window, document, performance: { now: () => clock }, AbortController, setTimeout: () => 1, clearTimeout() {}, setInterval: fn => { intervals.push(fn); return intervals.length; }, clearInterval() {}, fetch: (url, options) => new Promise(resolve => fetches.push({ url, options, resolve })), Date, Number, Math });
  listeners.DOMContentLoaded();
  return { els, listeners, intervals, document, window, fetches, clock: value => clock = value, get replaced() { return replaced; } };
}
function respond(fetch, data = fixture) { fetch.resolve({ ok: true, status: 200, json: async () => ({ data }) }); }
test('delayed response already past expiry never reveals location', async () => {
  const s = boot(); s.clock(9000); respond(s.fetches[0], { ...fixture, expiresAt: '2026-10-07T10:00:01.000Z' }); await flush();
  assert.equal(s.els.location.hidden, true); assert.match(s.els.notice.textContent, /expired/);
});
test('reload without secret makes no API request', () => {
  const s = boot(''); assert.equal(s.fetches.length, 0); assert.match(s.els.notice.textContent, /original/);
});
test('pagehide and BFCache return reject late response', async () => {
  const s = boot(); s.listeners.pagehide(); respond(s.fetches[0]); await flush(); s.listeners.pageshow({ persisted: true });
  assert.equal(s.els.location.hidden, true); assert.match(s.els.notice.textContent, /privacy/); assert.equal(s.fetches[0].options.signal.aborted, true);
});
test('hide aborts in-flight request and return requires fresh validation', async () => {
  const s = boot(); s.document.hidden = true; s.listeners.visibilitychange(); assert.equal(s.fetches[0].options.signal.aborted, true);
  respond(s.fetches[0]); await flush(); assert.equal(s.els.location.hidden, true);
  s.document.hidden = false; s.listeners.visibilitychange(); assert.equal(s.fetches.length, 2); assert.equal(s.els.location.hidden, true);
  respond(s.fetches[1]); await flush(); assert.equal(s.els.location.hidden, false);
});
test('fragment removed and fetch omits cookies, caching, referrer and redirects', () => {
  const s = boot(); assert.deepEqual(Array.from(s.replaced), [null, '', '/share']); const options = s.fetches[0].options;
  assert.equal(options.credentials, 'omit'); assert.equal(options.cache, 'no-store'); assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.redirect, 'error'); assert.equal(s.fetches[0].url.includes('nvl_'), false);
});
test('refresh clears previous location before checking authorization again',async()=>{const s=boot();respond(s.fetches[0]);await flush();assert.equal(s.els.location.hidden,false);s.intervals[0]();assert.equal(s.els.location.hidden,true);});

test('inconsistent CURRENT payload with null position fails closed',async()=>{const s=boot();respond(s.fetches[0],{...fixture,position:null});await flush();assert.equal(s.els.location.hidden,true);assert.match(s.els.notice.textContent,/could not be verified/);});
test('second same-document link is scrubbed and supersedes the old vehicle session', async () => {
  const s = boot();
  s.window.location.hash = '#nvl_' + 'b'.repeat(43);
  s.listeners.hashchange();
  assert.equal(s.window.location.hash, '');
  assert.deepEqual(Array.from(s.replaced), [null, '', '/share']);
  assert.equal(s.fetches[0].options.signal.aborted, true);
  assert.equal(s.fetches.length, 2);
  assert.equal(s.fetches[1].options.headers.Authorization, 'Bearer nvl_' + 'b'.repeat(43));
  respond(s.fetches[0], { ...fixture, vehicleLabel: 'OLD VEHICLE' }); await flush();
  assert.equal(s.els.location.hidden, true);
  respond(s.fetches[1], { ...fixture, vehicleLabel: 'NEW VEHICLE' }); await flush();
  assert.equal(s.els.vehicle.textContent, 'NEW VEHICLE');
  assert.equal(s.els.location.hidden, false);
});
test('invalid second fragment clears the old location and does not make another request', async () => {
  const s = boot(); respond(s.fetches[0]); await flush();
  s.window.location.hash = '#invalid'; s.listeners.hashchange();
  assert.equal(s.window.location.hash, ''); assert.equal(s.els.location.hidden, true);
  assert.equal(s.fetches.length, 1); assert.match(s.els.notice.textContent, /original/);
});
test('a valid link can initialize an already-open empty viewer; Back clears its capability', async () => {
  const s = boot(''); assert.equal(s.fetches.length, 0);
  s.window.location.hash = '#nvl_' + 'c'.repeat(43); s.listeners.hashchange();
  assert.equal(s.fetches.length, 1); respond(s.fetches[0]); await flush();
  assert.equal(s.els.location.hidden, false);
  s.listeners.popstate(); assert.equal(s.els.location.hidden, true); assert.match(s.els.notice.textContent, /privacy/);
});
