import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { beforeEach, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
const root = new URL('../', import.meta.url).href;
const state = { React, cursor: 0, values: [], feed: {} };
globalThis.__smartAlertTests = state;
const moduleUrl = source => 'data:text/javascript,' + encodeURIComponent(source);
const hooks = moduleUrl(`const s = globalThis.__smartAlertTests; export const useState = initial => { const i = s.cursor++; return [i in s.values ? s.values[i] : typeof initial === 'function' ? initial() : initial, () => {}]; }; export const useEffect = () => {}; export const useMemo = f => f(); export const useSyncExternalStore = () => s.feed;`);
const link = moduleUrl(`export default props => globalThis.__smartAlertTests.React.createElement('a', { href: props.href }, props.children);`);
registerHooks({
  resolve(specifier, context, next) {
    const local = context.parentURL?.startsWith(root) && !context.parentURL.includes('/node_modules/');
    if (specifier === 'react' && local) return { url: hooks, shortCircuit: true };
    if (specifier === 'next/link') return { url: link, shortCircuit: true };
    if (specifier.startsWith('@/') || local && specifier.startsWith('.')) {
      const base = specifier.startsWith('@/') ? new URL('../' + specifier.slice(2), import.meta.url) : new URL(specifier, context.parentURL);
      const url = ['', '.ts', '.tsx'].map(ext => new URL(base.href + ext)).find(url => /\.tsx?$/.test(url.href) && existsSync(url));
      if (url) return { url: url.href, shortCircuit: true };
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith(root) && !url.includes('/node_modules/') && /\.tsx?$/.test(url)) return { format: 'module', shortCircuit: true, source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText };
    return next(url, context);
  },
});
const { default: Panel, AlertGroupCard, AlertWorkflowControls } = await import('../components/alerts/SmartAlertsPanel.tsx');
const now = Date.parse('2026-10-07T10:00:00Z');
const createdAt = new Date(now).toISOString();
const fixture = { id: 'a', type: 'OFFLINE', message: 'Synthetic offline alert', isResolved: false, vehicleId: 'v-1', createdAt, resolvedAt: null, vehicle: { id: 'v-1', vehicleNo: 'FIXTURE-1', companyId: 'c-1', device: { terminalId: '000123456789', model: 'GX3' } }, workflowVersion: 1, workflowRevision: 0, owner: null, assignedAt: null, acknowledgedAt: null, acknowledgedBy: null, acknowledgementDueAt: null, deadlineStatus: 'NONE' };
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
const workflow = patch => render(AlertWorkflowControls, { event: { ...fixture, ...patch }, canManage: true, currentUserId: 'u-1', disabled: false, onWorkflow() {} });
beforeEach(() => { state.cursor = 0; state.values = []; state.feed = { events: [fixture], role: 'ADMIN', userId: 'u-1', loading: false, refreshing: false, actionPending: false, stale: false, lastRefresh: now, feedError: null, actionError: null, notice: null }; });

test('rendered panel exposes filters, UTC and truthful capability instead of a live-database claim', () => {
  const html = render(Panel); for (const text of ['Smart Alerts', 'Recorded time', 'Acknowledgement', 'Group exact repeats within 5 minutes', 'UTC', 'Overdue is an in-app review queue']) assert.match(html, new RegExp(text));
  assert.doesNotMatch(html, /LIVE DATABASE|Invalid Date/);
});
test('customer panel is read-only including workflow ownership and resolve controls', () => {
  state.feed.role = 'CUSTOMER'; const html = render(Panel); assert.match(html, /read-only alert access/); assert.doesNotMatch(html, />Resolve 1 event<|>Take ownership<|>Acknowledge<|>Set deadline</);
});
test('unconfirmed stale panel labels cached results and disables actions', () => {
  state.feed.stale = true; state.feed.feedError = 'Network unavailable'; const html = render(Panel); assert.match(html, /Refresh unconfirmed/); assert.match(html, /Showing the last confirmed records/); assert.match(html, /disabled="">Resolve 1 event/); assert.match(html, /disabled="">Take ownership/);
});
test('unknown initial data never appears as verified zero or empty success', () => {
  state.feed = { ...state.feed, events: [], stale: true, lastRefresh: null, feedError: 'Access unavailable' }; const html = render(Panel); assert.match(html, /Alerts unavailable/); assert.doesNotMatch(html, /No matching events/); assert.equal((html.match(/>—<\/p>/g) ?? []).length, 4);
});
test('legacy API hides ownership controls and explains missing capability', () => {
  const legacy = { ...fixture }; delete legacy.workflowVersion; state.feed.events = [legacy]; const html = render(Panel); assert.match(html, /require the Smart Alerts backend upgrade/); assert.doesNotMatch(html, />Take ownership<|>Acknowledge<|>Set deadline</);
});
test('expanded group preserves all original IDs and targets exact vehicle links', () => {
  state.values = [true]; const second = { ...fixture, id: 'b', createdAt: new Date(now - 60000).toISOString() };
  const html = render(AlertGroupCard, { group: { id: 'a', events: [fixture, second], firstAt: second.createdAt, lastAt: fixture.createdAt }, canManage: true, currentUserId: 'u-1', disabled: false, busy: false, onChange() {}, onWorkflow() {} });
  assert.match(html, /Event ID: a/); assert.match(html, /Event ID: b/); assert.match(html, /Terminal ID: 000123456789/); assert.match(html, /href="\/dashboard\/live-tracking\?vehicleId=v-1"/); assert.match(html, /First recorded/); assert.match(html, /Last recorded/); assert.match(html, /per original event/); assert.match(html, />Resolve 2 events</);
});
test('only unowned open events offer take ownership', () => {
  assert.match(workflow({}), />Take ownership</); state.cursor = 0; assert.doesNotMatch(workflow({ isResolved: true }), />Take ownership</);
});
test('only the current owner sees acknowledgement and deadline controls', () => {
  assert.match(workflow({ owner: { id: 'u-1', name: 'Fixture owner' } }), />Acknowledge</); state.cursor = 0;
  const html = workflow({ owner: { id: 'u-other', name: 'Other owner' } }); assert.match(html, /Only the owner/); assert.doesNotMatch(html, />Acknowledge<|>Set deadline<|>Take ownership</);
});
test('acknowledged open events do not imply resolved, and do not offer another deadline edit', () => {
  const html = workflow({ owner: { id: 'u-1', name: 'Fixture owner' }, acknowledgedAt: createdAt, acknowledgedBy: { id: 'u-1', name: 'Fixture owner' }, deadlineStatus: 'ACKNOWLEDGED' }); assert.match(html, /stays open until it is resolved/); assert.doesNotMatch(html, />Acknowledge<|>Set deadline</);
});
test('overdue state shows the exact deadline and does not claim an escalation was sent', () => {
  const html = workflow({ acknowledgementDueAt: createdAt, deadlineStatus: 'OVERDUE' }); assert.match(html, /2026-10-07 10:00:00 UTC/); assert.match(html, /OVERDUE/); assert.doesNotMatch(html, /escalat/i);
});
test('an empty accessible list does not imply the backend upgrade is missing', () => {
  state.feed.events = []; const html = render(Panel); assert.match(html, /No matching events/); assert.doesNotMatch(html, /require the Smart Alerts backend upgrade/);
});
test('server-authorized orphan recovery explains reset consequences', () => {
  const html = workflow({ owner: { id: 'former', name: 'Former owner' }, ownershipRecoverable: true }); assert.match(html, />Reclaim ownership</); assert.match(html, /resets the acknowledgement and deadline/);
});
