import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deliveryContactPayload, deliveryContactUpdate, hasConfirmedDelivery,
  handoverPresentation, canRetryHandover, fetchHandovers,
  retryHandover, fetchHandoverArtifact,
} from '../lib/customer-handover.ts';

const base = 'https://api.example.test';
const token = 'synthetic-jwt';
const job = {
  id: 'job-1', status: 'BLOCKED', reason: 'DELIVERY_DISABLED',
  recipientEmail: 'old@example.test', retryRecipientEmail: 'customer@example.test',
  ownerCopyEmail: 'owner@example.test', createdAt: '2026-10-09T10:00:00Z',
  acceptedAt: null, canRetry: true, artifactsReady: true,
  vehicleId: 'vehicle-1', customerId: 'customer-1',
};
const contact = { deliveryEmail: 'customer@example.test', deliveryEmailConfirmedAt: '2026-10-09T10:00:00Z', deliveryEmailConfirmedById: 'operator-1' };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

test('missing delivery address stays null and never uses login identity', () => {
  assert.deepEqual(deliveryContactPayload('  ', false), { deliveryEmail: null, deliveryEmailConfirmed: false });
  assert.deepEqual(deliveryContactPayload('', true), { deliveryEmail: null, deliveryEmailConfirmed: false });
});

test('delivery address requires explicit confirmation and is normalized', () => {
  assert.throws(() => deliveryContactPayload('customer@example.test', false), /Confirm/);
  assert.deepEqual(deliveryContactPayload(' Customer@Example.test ', true), { deliveryEmail: 'customer@example.test', deliveryEmailConfirmed: true });
  for (const email of ['invalid', 'x@example', 'x@y z.test', 'a@example.test,b@example.test', 'a@example.test;b@example.test', '<a@example.test>', 'a@example.test\r\nbcc:x@example.test', 'a'.repeat(250) + '@example.test']) {
    assert.throws(() => deliveryContactPayload(email, true), /valid/);
  }
});

test('operator confirmation requires server provenance, not merely an address', () => {
  assert.equal(hasConfirmedDelivery({}), false);
  assert.equal(hasConfirmedDelivery({ deliveryEmail: contact.deliveryEmail }), false);
  assert.equal(hasConfirmedDelivery({ ...contact, deliveryEmailConfirmedById: null }), false);
  assert.equal(hasConfirmedDelivery({ ...contact, deliveryEmailConfirmedAt: null }), false);
  assert.equal(hasConfirmedDelivery(contact), true);
});

test('normal profile edits omit unchanged contact fields and preserve provenance', () => {
  assert.deepEqual(deliveryContactUpdate(' Customer@Example.test ', true, contact), {});
  assert.deepEqual(deliveryContactUpdate('', false, {}), {});
  assert.deepEqual(deliveryContactUpdate('legacy@example.test', false, { deliveryEmail: 'legacy@example.test' }), {});
  assert.throws(() => deliveryContactUpdate(contact.deliveryEmail, false, contact), /Confirm/);
});

test('new or changed address needs fresh confirmation; clearing is explicit', () => {
  assert.throws(() => deliveryContactUpdate('other@example.test', false, contact), /Confirm/);
  assert.deepEqual(deliveryContactUpdate('other@example.test', true, contact), { deliveryEmail: 'other@example.test', deliveryEmailConfirmed: true });
  assert.deepEqual(deliveryContactUpdate('', false, contact), { deliveryEmail: null, deliveryEmailConfirmed: false });
  assert.deepEqual(deliveryContactUpdate(contact.deliveryEmail, true, { deliveryEmail: contact.deliveryEmail }), { deliveryEmail: contact.deliveryEmail, deliveryEmailConfirmed: true });
});

test('provider acceptance is distinct from inbox arrival and file readiness', () => {
  assert.equal(handoverPresentation('ACCEPTED').label, 'Sent to provider');
  assert.match(handoverPresentation('ACCEPTED').detail, /Inbox arrival is not confirmed/);
  assert.equal(handoverPresentation('QUEUED').label, 'Pending');
  assert.equal(handoverPresentation('NEEDS_REVIEW').label, 'Needs review');
  assert.match(handoverPresentation('NEEDS_REVIEW').detail, /retry is disabled/);
  assert.equal(handoverPresentation('not-supported').label, 'Status unavailable');
  assert.equal(canRetryHandover({ ...job, artifactsReady: false }), true);
});

test('retry needs server permission, safe state and explicit server-derived target', () => {
  assert.equal(canRetryHandover(job), true);
  assert.equal(canRetryHandover({ ...job, status: 'FAILED' }), true);
  for (const status of ['QUEUED', 'PROCESSING', 'ACCEPTED', 'NEEDS_REVIEW', 'SUPERSEDED', 'unknown']) assert.equal(canRetryHandover({ ...job, status }), false);
  for (const retryRecipientEmail of [undefined, null, '', ' ']) assert.equal(canRetryHandover({ ...job, retryRecipientEmail }), false);
  assert.equal(canRetryHandover({ ...job, canRetry: false }), false);
});

test('listing is a scoped, authenticated GET without tokens in URLs', async () => {
  const requests = [];
  const request = async (url, init) => { requests.push({ url, init }); return json({ success: true, data: [job] }); };
  assert.deepEqual(await fetchHandovers(base + '/', token, { customerId: 'customer/?1' }, undefined, request), [job]);
  await fetchHandovers(base, token, { vehicleId: 'vehicle-1' }, undefined, request);
  assert.equal(requests[0].url, base + '/api/gps/handovers?customerId=customer%2F%3F1');
  assert.equal(requests[1].url, base + '/api/gps/handovers?vehicleId=vehicle-1');
  for (const { url, init } of requests) {
    assert.equal(init.headers.Authorization, 'Bearer ' + token);
    assert.equal(init.method, undefined);
    assert.equal(init.cache, 'no-store');
    assert.equal(url.includes(token), false);
  }
});

test('safe retry pins reviewed recipient, not stale job recipient, in POST body', async () => {
  let captured;
  await retryHandover(base, token, { ...job, id: 'job/1' }, undefined, async (url, init) => {
    captured = { url, init };
    return json({ success: true, data: { ...job, status: 'QUEUED', canRetry: false } });
  });
  assert.equal(captured.url, base + '/api/gps/handovers/job%2F1/retry');
  assert.equal(captured.init.method, 'POST');
  assert.equal(captured.init.headers.Authorization, 'Bearer ' + token);
  assert.deepEqual(JSON.parse(captured.init.body), { expectedRecipientEmail: job.retryRecipientEmail });
});

test('unsafe retry and missing auth fail before any request', async () => {
  let requests = 0;
  const request = async () => { requests++; throw new Error('must not fetch'); };
  await assert.rejects(retryHandover(base, token, { ...job, status: 'NEEDS_REVIEW' }, undefined, request), /not eligible/);
  await assert.rejects(fetchHandovers(base, '', { customerId: 'c' }, undefined, request), /session/);
  await assert.rejects(fetchHandovers(base, token, {}, undefined, request), /required/);
  await assert.rejects(fetchHandoverArtifact(base, token, { ...job, artifactsReady: false }, 'pdf', undefined, request), /not ready/);
  assert.equal(requests, 0);
});

test('downloads fetch authenticated blobs from fixed endpoints', async () => {
  for (const [format, mime] of [['pdf', 'application/pdf'], ['png', 'image/png']]) {
    const blob = await fetchHandoverArtifact(base, token, job, format, undefined, async (url, init) => {
      assert.equal(url, `${base}/api/gps/handovers/job-1/download/${format}`);
      assert.equal(init.headers.Authorization, 'Bearer ' + token);
      assert.equal(url.includes(token), false);
      assert.equal(init.cache, 'no-store');
      return new Response('synthetic-file', { headers: { 'Content-Type': mime } });
    });
    assert.equal(blob.type, mime);
    assert.ok(blob.size > 0);
  }
});

test('wrong MIME, empty files and unsupported formats do not download', async () => {
  await assert.rejects(fetchHandoverArtifact(base, token, job, 'pdf', undefined, async () => new Response('login', { headers: { 'Content-Type': 'text/html' } })), /requested handover file/);
  await assert.rejects(fetchHandoverArtifact(base, token, job, 'pdf', undefined, async () => new Response('', { headers: { 'Content-Type': 'application/pdf' } })), /empty/);
  await assert.rejects(fetchHandoverArtifact(base, token, job, 'html'), /Unsupported/);
});

test('authorization failures and recipient conflicts stay actionable', async () => {
  for (const [status, text] of [[401, /session/], [403, /permission/], [409, /recipient changed/]]) {
    await assert.rejects(fetchHandovers(base, token, { customerId: 'c' }, undefined, async () => json({}, status)), text);
  }
  await assert.rejects(retryHandover(base, token, job, undefined, async () => json({}, 409)), /Refresh and review/);
});

test('malformed and unsuccessful responses never become a successful empty view', async () => {
  for (const result of [null, {}, { success: false, data: [] }, { success: true, data: null }, { success: true, data: [{}] }, { success: true, data: [{ ...job, artifactsReady: 'yes' }] }]) {
    await assert.rejects(fetchHandovers(base, token, { customerId: 'c' }, undefined, async () => json(result)));
  }
  await assert.rejects(fetchHandovers(base, token, { customerId: 'c' }, undefined, async () => new Response('<html>')), /invalid response/);
});

test('abort signals are forwarded on reads, downloads and retries', async () => {
  const controller = new AbortController();
  const request = async (_url, init) => {
    assert.equal(init.signal, controller.signal);
    throw new DOMException('Cancelled', 'AbortError');
  };
  for (const promise of [fetchHandovers(base, token, { customerId: 'c' }, controller.signal, request), retryHandover(base, token, job, controller.signal, request), fetchHandoverArtifact(base, token, job, 'png', controller.signal, request)]) {
    await assert.rejects(promise, { name: 'AbortError' });
  }
});
