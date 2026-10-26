import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';

const state = { effects: [] };
globalThis.__pollingTest = state;
const dataModule = code => 'data:text/javascript,' + encodeURIComponent(code);
const source = ts.transpileModule(readFileSync(new URL('../hooks/use-visible-poll.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const hookUrl = dataModule(source);
registerHooks({ resolve(specifier, context, next) {
  if (context.parentURL === hookUrl && specifier === 'react') return { shortCircuit: true, url: dataModule(`
    export const useEffect = fn => globalThis.__pollingTest.effects.push(fn);
    export const useState = initial => [initial, () => {}];
    export const useRef = initial => ({ current: initial });
    export const useCallback = fn => fn;
  `) };
  return next(specifier, context);
} });
const { useVisiblePoll } = await import(hookUrl);
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

function PollHarness(t, enabled = true) {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  globalThis.window = Object.assign(new EventTarget(), { setTimeout, clearTimeout, setInterval, clearInterval });
  globalThis.document = Object.assign(new EventTarget(), { hidden: false });
  state.effects = [];
  const requests = [], values = [], errors = [];
  const poll = useVisiblePoll({ enabled, intervalMs: 5000, timeoutMs: 15000,
    request: signal => new Promise(resolve => requests.push({ signal, resolve })),
    onSuccess: data => values.push(data), onError: error => errors.push(error.message),
  });
  const cleanup = state.effects[0]();
  t.after(() => { cleanup(); delete globalThis.window; delete globalThis.document; });
  return { ...poll, requests, values, errors, cleanup };
}

test('slow API never overlaps; timeout permits retry and retires an uncooperative old response', async t => {
  const h = PollHarness(t);
  for (let i = 0; i < 50; i++) h.refresh();
  t.mock.timers.tick(10000);
  assert.equal(h.requests.length, 1);
  t.mock.timers.tick(5000);
  await flush();
  assert.equal(h.requests[0].signal.aborted, true);
  assert.match(h.errors[0], /timed out/);
  h.refresh();
  assert.equal(h.requests.length, 2);
  h.requests[1].resolve('new');
  await flush();
  h.requests[0].resolve('old');
  await flush();
  assert.deepEqual(h.values, ['new']);
});

test('hidden tab aborts and pauses; visibility and online events coalesce on resume', async t => {
  const h = PollHarness(t);
  document.hidden = true;
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(h.requests[0].signal.aborted, true);
  t.mock.timers.tick(30000);
  await flush();
  assert.equal(h.requests.length, 1);
  assert.deepEqual(h.errors, []);
  document.hidden = false;
  document.dispatchEvent(new Event('visibilitychange'));
  window.dispatchEvent(new Event('online'));
  h.refresh();
  assert.equal(h.requests.length, 2);
  h.requests[0].resolve('retired');
  h.requests[1].resolve('visible');
  await flush();
  assert.deepEqual(h.values, ['visible']);
});

test('selection cleanup retires pending work and removes all future triggers', async t => {
  const h = PollHarness(t);
  h.cleanup();
  assert.equal(h.requests[0].signal.aborted, true);
  h.requests[0].resolve('previous vehicle');
  t.mock.timers.tick(60000);
  window.dispatchEvent(new Event('online'));
  document.dispatchEvent(new Event('visibilitychange'));
  h.refresh();
  await flush();
  assert.equal(h.requests.length, 1);
  assert.deepEqual(h.values, []);
  assert.deepEqual(h.errors, []);
});

test('no selected vehicle produces no history request', async t => {
  const h = PollHarness(t, false);
  h.refresh();
  t.mock.timers.tick(60000);
  await flush();
  assert.equal(h.requests.length, 0);
});
