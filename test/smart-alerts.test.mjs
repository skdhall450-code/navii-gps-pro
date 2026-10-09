import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import ts from 'typescript';
const root = new URL('../', import.meta.url).href;
registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.startsWith(root) && specifier.startsWith('.')) {
      const url = new URL(specifier, context.parentURL);
      if (existsSync(new URL(url.href + '.ts'))) return { url: url.href + '.ts', shortCircuit: true };
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith(root) && url.endsWith('.ts')) return { format: 'module', shortCircuit: true, source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText };
    return next(url, context);
  },
});
const { DEFAULT_ALERT_FILTERS, groupAlertEvents, filterAlertEvents, alertSeverity, formatAlertTimestamp, canManageAlerts, isAlertRecord } = await import('../lib/smart-alerts.ts');
const { createAlertFeed, readAlertSession } = await import('../lib/smart-alerts-client.ts');
const now = Date.parse('2026-10-07T10:00:00Z');
const event = (id, minutes = 0, patch = {}) => ({ id, type: 'OFFLINE', message: 'No communication', isResolved: false, vehicleId: 'v-1', createdAt: new Date(now - minutes * 60000).toISOString(), resolvedAt: null, vehicle: { id: 'v-1', companyId: 'c-1', vehicleNo: 'FIXTURE-1', device: { terminalId: '000123456789', model: 'GX3' } }, ...patch });
const session = { token: 'fixture-token', userId: 'u-1', role: 'ADMIN', companyId: 'c-1' };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
const list = events => json({ success: true, data: events });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
function setup(fetch) {
  let auth = { ...session }; let unauthorized = 0;
  const feed = createAlertFeed({ apiBase: 'https://fixture.test', fetch, session: () => auth, unauthorized: () => { unauthorized++; }, now: () => now });
  return { feed, setSession: value => { auth = value; }, unauthorized: () => unauthorized };
}

test('groups exact repeats within a bounded five-minute span and preserves originals', () => {
  const events = [event('a', 6), event('b', 3), event('c', 0)];
  const groups = groupAlertEvents(events);
  assert.equal(groups.length, 2); assert.deepEqual(groups[0].events.map(row => row.id), ['c', 'b']);
  assert.equal(groups[0].firstAt, events[1].createdAt); assert.equal(groups[0].lastAt, events[2].createdAt);
  assert.equal(groups.flatMap(group => group.events).length, events.length); assert.deepEqual(events.map(row => row.id), ['a', 'b', 'c']);
});
test('five-minute boundary is inclusive, sixth minute forms a new group', () => assert.deepEqual(groupAlertEvents([event('a'), event('b', 5), event('c', 5.001)]).map(group => group.events.length), [2, 1]));
test('never groups different companies, vehicles, types, messages, or resolved state', () => {
  const variants = [event('a'), event('b', 1, { vehicle: { ...event('x').vehicle, companyId: 'another' } }), event('c', 1, { vehicleId: 'v-2', vehicle: { ...event('x').vehicle, id: 'v-2' } }), event('d', 1, { type: 'SOS' }), event('e', 1, { message: 'Different geofence or event' }), event('f', 1, { isResolved: true })];
  assert.equal(groupAlertEvents(variants).length, variants.length);
});
test('invalid timestamps stay separate and never show Invalid Date', () => {
  assert.equal(groupAlertEvents([event('a', 0, { createdAt: 'bad' }), event('b', 0, { createdAt: 'bad' })]).length, 2);
  assert.equal(formatAlertTimestamp('bad'), 'Time unavailable'); assert.match(formatAlertTimestamp(event('a').createdAt), /UTC$/);
});
test('ungrouped view keeps every original and UTC sort is deterministic', () => {
  assert.deepEqual(groupAlertEvents([event('b'), event('a'), event('c', 1)], false).map(group => group.id), ['a', 'b', 'c']);
});
test('filters operate on original events before grouping including terminal-only GX3', () => {
  const events = [event('a'), event('b', 70), event('c', 0, { isResolved: true }), event('d', 0, { type: 'SOS' })];
  assert.deepEqual(filterAlertEvents(events, { ...DEFAULT_ALERT_FILTERS, period: 'HOUR', type: 'OFFLINE', search: '000123456789' }, now).map(row => row.id), ['a']);
  assert.deepEqual(filterAlertEvents(events, { ...DEFAULT_ALERT_FILTERS, severity: 'CRITICAL' }, now).map(row => row.id), ['d']);
});
test('relative time filters exclude unknown and future record times without manufacturing events', () => {
  const events = [event('a', -1), event('b', 0, { createdAt: 'bad' }), event('c', 60), event('d', 60.001)];
  assert.deepEqual(filterAlertEvents(events, { ...DEFAULT_ALERT_FILTERS, period: 'HOUR' }, now).map(row => row.id), ['c']);
  assert.equal(filterAlertEvents(events, DEFAULT_ALERT_FILTERS, now).length, 4);
});
test('severity is type-derived; only managing roles can write', () => {
  assert.equal(alertSeverity('SOS'), 'CRITICAL'); assert.equal(alertSeverity('UNKNOWN'), 'INFO');
  for (const role of ['CUSTOMER', 'USER', undefined]) assert.equal(canManageAlerts(role), false);
  for (const role of ['ADMIN', 'DEALER', 'SUPER_ADMIN']) assert.equal(canManageAlerts(role), true);
});
test('record validation rejects malformed or mismatched vehicle identities but accepts unknown timestamps', () => {
  assert.equal(isAlertRecord(event('a')), true); assert.equal(isAlertRecord(event('a', 0, { createdAt: 'unknown' })), true);
  for (const patch of [{ vehicle: null }, { vehicleId: 'other' }, { isResolved: 'yes' }, { id: '' }, { vehicle: { ...event('x').vehicle, device: { terminalId: 123 } } }]) assert.equal(isAlertRecord(event('a', 0, patch)), false);
});
test('stored identity requires a known role, user, company and token', () => {
  const storage = values => ({ getItem: key => values[key] ?? null });
  assert.deepEqual(readAlertSession(storage({ navii_access_token: 'fixture', navii_user: JSON.stringify({ id: 'u', companyId: 'c', role: 'ADMIN' }) })), { token: 'fixture', userId: 'u', companyId: 'c', role: 'ADMIN', dealerId: undefined, customerId: undefined });
  for (const user of ['bad json', JSON.stringify({ id: 'u', companyId: 'c', role: 'OWNER' }), JSON.stringify({ id: 'u', role: 'ADMIN' })]) assert.equal(readAlertSession(storage({ navii_access_token: 'fixture', navii_user: user })), null);
});
test('refresh uses scoped authenticated API and commits only verified success', async () => {
  const { feed } = setup(async (url, init) => { assert.equal(url, 'https://fixture.test/api/gps/alerts'); assert.equal(init.headers.Authorization, 'Bearer fixture-token'); assert.equal(init.cache, 'no-store'); return list([event('a')]); });
  await feed.refresh(); assert.equal(feed.getSnapshot().events.length, 1); assert.equal(feed.getSnapshot().stale, false); assert.equal(feed.getSnapshot().lastRefresh, now);
});
test('concurrent polling coalesces rather than allowing old responses to overwrite new data', async () => {
  const request = deferred(); let calls = 0;
  const { feed } = setup(async () => { calls++; return request.promise; });
  const first = feed.refresh(); await feed.refresh(); assert.equal(calls, 1); request.resolve(list([event('a')])); await first; assert.equal(feed.getSnapshot().events[0].id, 'a');
});
test('account changes during fetch discard old records and clear prior scope', async () => {
  const request = deferred(); const { feed, setSession } = setup(() => request.promise);
  const first = feed.refresh(); setSession({ ...session, userId: 'u-2', companyId: 'c-2' }); request.resolve(list([event('a')])); await first;
  assert.equal(feed.getSnapshot().events.length, 0); assert.equal(feed.getSnapshot().lastRefresh, null);
});
test('401 expires session and 403 immediately removes visible cached records', async () => {
  for (const status of [401, 403]) {
    let calls = 0; const result = setup(async () => ++calls === 1 ? list([event('a')]) : json({}, status));
    await result.feed.refresh(); await result.feed.refresh(); assert.equal(result.feed.getSnapshot().events.length, 0); assert.equal(result.feed.getSnapshot().lastRefresh, null); assert.equal(result.unauthorized(), status === 401 ? 1 : 0);
  }
});
test('transient refresh failure is labelled stale and disables mutations', async () => {
  let calls = 0; const { feed } = setup(async () => { calls++; if (calls === 1) return list([event('a')]); throw new Error('offline fixture'); });
  await feed.refresh(); await feed.refresh(); assert.equal(feed.getSnapshot().events.length, 1); assert.equal(feed.getSnapshot().stale, true); await feed.changeState(['a'], true); assert.equal(calls, 2);
});
test('rejects malformed success, duplicate IDs and unexpected cross-company records', async () => {
  for (const payload of [json({ success: false, data: [] }), json({ success: true, data: {} }), list([event('a'), event('a')]), list([event('a', 0, { vehicle: { ...event('x').vehicle, companyId: 'other' } })])]) {
    const { feed } = setup(async () => payload); await feed.refresh(); assert.equal(feed.getSnapshot().stale, true); assert.equal(feed.getSnapshot().events.length, 0);
  }
});
test('resolved state changes only after server confirmation; repeated clicks are serialized', async () => {
  const update = deferred(); let patches = 0; let saved = event('a');
  const { feed } = setup(async (_, init) => init.method === 'PATCH' ? (patches++, update.promise) : list([saved]));
  await feed.refresh(); const first = feed.changeState(['a'], true); await feed.changeState(['a'], true);
  assert.equal(patches, 1); assert.equal(feed.getSnapshot().events[0].isResolved, false);
  saved = { ...saved, isResolved: true, resolvedAt: new Date(now).toISOString() }; update.resolve(json({ success: true, data: saved })); await first;
  assert.equal(feed.getSnapshot().events[0].isResolved, true); assert.match(feed.getSnapshot().notice, /1 event resolved/);
});
test('a pre-write polling response cannot undo a confirmed mutation', async () => {
  const oldRead = deferred(); let reads = 0; let saved = event('a');
  const { feed } = setup(async (_, init) => {
    if (init.method === 'PATCH') { saved = { ...saved, isResolved: true, resolvedAt: new Date(now).toISOString() }; return json({ success: true, data: saved }); }
    return ++reads === 2 ? oldRead.promise : list([saved]);
  });
  await feed.refresh(); const poll = feed.refresh(); await feed.changeState(['a'], true); oldRead.resolve(list([event('a')])); await poll;
  assert.equal(feed.getSnapshot().events[0].isResolved, true);
});
test('partial group failure preserves confirmed updates, stops remaining calls, and reports actual count', async () => {
  let saved = [event('a'), event('b'), event('c')]; let patches = 0;
  const { feed } = setup(async (_, init) => {
    if (init.method !== 'PATCH') return list(saved);
    if (++patches === 2) return json({ success: false }, 500);
    saved = saved.map(row => row.id === 'a' ? { ...row, isResolved: true, resolvedAt: new Date(now).toISOString() } : row);
    return json({ success: true, data: saved[0] });
  });
  await feed.refresh(); await feed.changeState(['a', 'b', 'c'], true);
  assert.equal(patches, 2); assert.match(feed.getSnapshot().actionError, /1 of 3 updates confirmed/); assert.equal(feed.getSnapshot().events[0].isResolved, true); assert.equal(feed.getSnapshot().events[1].isResolved, false);
});
test('a successful HTTP response without success or matching identity does not confirm an update', async () => {
  for (const result of [{ data: event('a', 0, { isResolved: true }) }, { success: true, data: event('other', 0, { isResolved: true }) }, { success: true, data: event('a') }]) {
    const { feed } = setup(async (_, init) => init.method === 'PATCH' ? json(result) : list([event('a')]));
    await feed.refresh(); await feed.changeState(['a'], true); assert.match(feed.getSnapshot().actionError, /0 of 1 updates confirmed/); assert.equal(feed.getSnapshot().notice, null);
  }
});
test('read-only actors and out-of-list identifiers cannot trigger writes', async () => {
  let patches = 0; const { feed, setSession } = setup(async (_, init) => { if (init.method === 'PATCH') patches++; return list([event('a')]); });
  await feed.refresh(); await feed.changeState(['not-visible'], true); setSession({ ...session, role: 'CUSTOMER' }); await feed.refresh(); await feed.changeState(['a'], true); assert.equal(patches, 0);
});
test('account change mid-batch stops the next mutation and discards old response', async () => {
  const request = deferred(); let patches = 0; const { feed, setSession } = setup(async (_, init) => init.method === 'PATCH' ? (patches++, request.promise) : list([event('a'), event('b')]));
  await feed.refresh(); const write = feed.changeState(['a', 'b'], true); setSession({ ...session, userId: 'u-2' }); request.resolve(json({ success: true, data: event('a', 0, { isResolved: true }) })); await write;
  assert.equal(patches, 1); assert.equal(feed.getSnapshot().events.length, 0); assert.equal(feed.getSnapshot().actionPending, false);
});
test('permission revoked mid-batch clears records and does not retry or read after denial', async () => {
  let calls = 0; const { feed } = setup(async (_, init) => { calls++; return init.method === 'PATCH' ? json({}, 403) : list([event('a'), event('b')]); });
  await feed.refresh(); await feed.changeState(['a', 'b'], true); assert.equal(calls, 2); assert.equal(feed.getSnapshot().events.length, 0); assert.match(feed.getSnapshot().actionError, /Permission changed/);
});
test('dispose aborts reads and ignores eventual responses', async () => {
  const request = deferred(); let signal; const { feed } = setup(async (_, init) => { signal = init.signal; return request.promise; });
  const pending = feed.refresh(); feed.dispose(); assert.equal(signal.aborted, true); request.resolve(list([event('a')])); await pending; assert.equal(feed.getSnapshot().events.length, 0);
});

const workflowEvent = (id, patch = {}) => event(id, 0, { workflowVersion: 1, workflowRevision: 0, owner: null, assignedAt: null, acknowledgedAt: null, acknowledgedBy: null, acknowledgementDueAt: null, deadlineStatus: 'NONE', ...patch });
test('workflow filters show only explicitly supported events and use server-declared overdue state', () => {
  const events = [event('legacy'), workflowEvent('new'), workflowEvent('owned', { owner: { id: 'u-1', name: 'Fixture owner' }, deadlineStatus: 'OVERDUE', acknowledgementDueAt: new Date(now - 1).toISOString() }), workflowEvent('ack', { acknowledgedAt: new Date(now).toISOString(), acknowledgedBy: { id: 'u-1', name: 'Fixture owner' }, deadlineStatus: 'ACKNOWLEDGED' })];
  assert.deepEqual(filterAlertEvents(events, { ...DEFAULT_ALERT_FILTERS, workflow: 'OVERDUE' }, now).map(row => row.id), ['owned']);
  assert.deepEqual(filterAlertEvents(events, { ...DEFAULT_ALERT_FILTERS, workflow: 'PENDING' }, now).map(row => row.id), ['new', 'owned']);
  assert.deepEqual(filterAlertEvents(events, { ...DEFAULT_ALERT_FILTERS, workflow: 'ACKNOWLEDGED' }, now).map(row => row.id), ['ack']);
});
test('new workflow capabilities require complete well-typed fields; legacy alert API stays supported', () => {
  assert.equal(isAlertRecord(event('legacy')), true); assert.equal(isAlertRecord(workflowEvent('new')), true);
  assert.equal(isAlertRecord(event('bad', 0, { workflowVersion: 1 })), false);
  assert.equal(isAlertRecord(workflowEvent('bad', { owner: { id: 'u-1' } })), false);
  assert.equal(isAlertRecord(workflowEvent('bad', { acknowledgementDueAt: 'bad' })), false);
});
test('ownership uses the workflow API, current actor, explicit action, and confirmed server record', async () => {
  let saved = workflowEvent('a'); let patches = 0;
  const { feed } = setup(async (url, init) => {
    if (init.method !== 'PATCH') return list([saved]);
    patches++; assert.match(url, /\/a\/workflow$/); assert.deepEqual(JSON.parse(init.body), { action: 'TAKE_OWNERSHIP' });
    saved = { ...saved, workflowRevision: 1, owner: { id: 'u-1', name: 'Fixture owner' }, assignedAt: new Date(now).toISOString() };
    return json({ success: true, data: saved });
  });
  await feed.refresh(); await feed.changeWorkflow('a', { action: 'TAKE_OWNERSHIP' }); assert.equal(patches, 1); assert.match(feed.getSnapshot().notice, /now own/);
});
test('workflow actions cannot mutate legacy, resolved, read-only, or another manager-owned alerts', async () => {
  let patches = 0; let saved = event('a');
  const { feed, setSession } = setup(async (_, init) => { if (init.method === 'PATCH') patches++; return list([saved]); });
  for (const fixture of [event('a'), workflowEvent('a', { isResolved: true }), workflowEvent('a', { owner: { id: 'u-other', name: 'Other' } })]) {
    saved = fixture; await feed.refresh(); await feed.changeWorkflow('a', { action: 'TAKE_OWNERSHIP' }); await feed.changeWorkflow('a', { action: 'ACKNOWLEDGE' });
  }
  saved = workflowEvent('a'); setSession({ ...session, role: 'CUSTOMER' }); await feed.refresh(); await feed.changeWorkflow('a', { action: 'TAKE_OWNERSHIP' }); assert.equal(patches, 0);
});
test('acknowledgement stays distinct from resolving and checks confirmed actor', async () => {
  let saved = workflowEvent('a', { owner: { id: 'u-1', name: 'Owner' }, assignedAt: new Date(now).toISOString() });
  const { feed } = setup(async (_, init) => {
    if (init.method !== 'PATCH') return list([saved]);
    saved = { ...saved, acknowledgedAt: new Date(now).toISOString(), acknowledgedBy: { id: 'u-1', name: 'Owner' }, deadlineStatus: 'ACKNOWLEDGED', workflowRevision: 1 };
    return json({ success: true, data: saved });
  });
  await feed.refresh(); await feed.changeWorkflow('a', { action: 'ACKNOWLEDGE' }); assert.equal(feed.getSnapshot().events[0].isResolved, false); assert.match(feed.getSnapshot().notice, /remains open/);
});
test('ownership conflict is reconciled without claiming the requested mutation succeeded', async () => {
  let saved = workflowEvent('a'); const { feed } = setup(async (_, init) => {
    if (init.method !== 'PATCH') return list([saved]); saved = { ...saved, owner: { id: 'u-other', name: 'Other' }, assignedAt: new Date(now).toISOString() }; return json({ message: 'Owned' }, 409);
  });
  await feed.refresh(); await feed.changeWorkflow('a', { action: 'TAKE_OWNERSHIP' }); assert.equal(feed.getSnapshot().notice, null); assert.match(feed.getSnapshot().actionError, /owned by another/); assert.equal(feed.getSnapshot().events[0].owner.id, 'u-other');
});
test('deadline updates require the server to confirm the requested deadline', async () => {
  let saved = workflowEvent('a', { owner: { id: 'u-1', name: 'Owner' }, assignedAt: new Date(now).toISOString() });
  const due = new Date(now + 3600000).toISOString();
  const { feed } = setup(async (_, init) => { if (init.method !== 'PATCH') return list([saved]); saved = { ...saved, acknowledgementDueAt: JSON.parse(init.body).acknowledgementDueAt, deadlineStatus: 'PENDING' }; return json({ success: true, data: saved }); });
  await feed.refresh(); await feed.changeWorkflow('a', { action: 'SET_DEADLINE', acknowledgementDueAt: due }); assert.equal(feed.getSnapshot().events[0].acknowledgementDueAt, due); assert.match(feed.getSnapshot().notice, /deadline updated/);
});
test('hung refresh and hung response bodies time out, label records stale, and permit manual recovery', async () => {
  for (const mode of ['fetch', 'body']) {
    let calls = 0;
    const feed = createAlertFeed({ apiBase: 'https://fixture.test', session: () => session, unauthorized() {}, requestTimeoutMs: 10, fetch: async () => { calls++; if (calls === 2) return mode === 'fetch' ? new Promise(() => {}) : { status: 200, ok: true, json: () => new Promise(() => {}) }; return list([event('a')]); } });
    await feed.refresh(); await feed.refresh(); assert.equal(feed.getSnapshot().stale, true); assert.equal(feed.getSnapshot().refreshing, false); assert.match(feed.getSnapshot().feedError, /timed out/); await feed.refresh(); assert.equal(feed.getSnapshot().stale, false); assert.equal(calls, 3);
  }
});
test('uncertain timed-out writes are never resent; a read reconciles actual server state', async () => {
  let saved = event('a'); let patches = 0;
  const feed = createAlertFeed({ apiBase: 'https://fixture.test', session: () => session, unauthorized() {}, requestTimeoutMs: 10, fetch: async (_, init) => { if (init.method !== 'PATCH') return list([saved]); patches++; saved = { ...saved, isResolved: true, resolvedAt: new Date(now).toISOString() }; return new Promise(() => {}); } });
  await feed.refresh(); await feed.changeState(['a'], true); assert.equal(patches, 1); assert.equal(feed.getSnapshot().actionPending, false); assert.equal(feed.getSnapshot().events[0].isResolved, true); assert.match(feed.getSnapshot().actionError, /0 of 1 updates confirmed/); assert.equal(feed.getSnapshot().notice, null);
});
test('token, role, dealer, and customer changes all discard stale in-flight reads', async () => {
  for (const patch of [{ token: 'new' }, { role: 'DEALER' }, { dealerId: 'another' }, { customerId: 'another' }]) {
    const request = deferred(); const { feed, setSession } = setup(() => request.promise); const pending = feed.refresh(); setSession({ ...session, ...patch }); request.resolve(list([event('a')])); await pending; assert.equal(feed.getSnapshot().events.length, 0);
  }
});
test('disposal during a batch stops later writes and suppresses notifications', async () => {
  const request = deferred(); let patches = 0; const { feed } = setup(async (_, init) => init.method === 'PATCH' ? (patches++, request.promise) : list([event('a'), event('b')]));
  await feed.refresh(); const pending = feed.changeState(['a', 'b'], true); feed.dispose(); request.resolve(json({ success: true, data: event('a', 0, { isResolved: true }) })); await pending; assert.equal(patches, 1); assert.equal(feed.getSnapshot().notice, null);
});
test('partial write failure followed by failed reconciliation retains confirmed records with actions paused', async () => {
  let patches = 0; let reads = 0;
  const { feed } = setup(async (_, init) => { if (init.method !== 'PATCH') { if (++reads > 1) throw new Error('Reconciliation offline'); return list([event('a'), event('b')]); } if (++patches === 2) throw new Error('Write failed'); return json({ success: true, data: event('a', 0, { isResolved: true }) }); });
  await feed.refresh(); await feed.changeState(['a', 'b'], true); assert.equal(feed.getSnapshot().stale, true); assert.equal(feed.getSnapshot().events[0].isResolved, true); assert.match(feed.getSnapshot().actionError, /1 of 2/); assert.match(feed.getSnapshot().feedError, /Reconciliation offline/);
});
test('only a server-identified orphan assignment can be reclaimed by an administrator', async () => {
  for (const [role, recoverable, allowed] of [['ADMIN', true, true], ['SUPER_ADMIN', true, true], ['DEALER', true, false], ['ADMIN', false, false]]) {
    let saved = workflowEvent('a', { owner: { id: 'former', name: 'Former owner' }, assignedAt: new Date(now).toISOString(), ownershipRecoverable: recoverable }); let patches = 0;
    const { feed, setSession } = setup(async (_, init) => { if (init.method !== 'PATCH') return list([saved]); patches++; saved = { ...saved, owner: { id: 'u-1', name: 'Current manager' }, ownershipRecoverable: false }; return json({ success: true, data: saved }); });
    setSession({ ...session, role }); await feed.refresh(); await feed.changeWorkflow('a', { action: 'TAKE_OWNERSHIP' }); assert.equal(patches, allowed ? 1 : 0);
  }
});
