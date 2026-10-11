import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as context from '../lib/enquiry-context.ts';

// Evaluate the actual route with isolated environment and mocked delivery. No network calls.
function route(env = {}, fetch = async () => { throw new Error('Unexpected delivery'); }) {
  const compiled = ts.transpileModule(fs.readFileSync(new URL('../app/api/enquiries/route.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: testModule.exports, module: testModule,
    require: name => name === 'next/server' ? { NextResponse: { json: (data, options) => Response.json(data, options) } } : context,
    process: { env }, fetch, console: { error() {} }, Request, Response,
  });
  return testModule.exports.POST;
}
const input = { name: 'Test Buyer', email: 'test@example.com', phone: '9876543210', vehicles: '2', message: 'Test only', intent: 'software-demo', source: 'software', product: 'g17-gps-tracker', attribution: { utm_source: 'google', landing_path: '/', token: 'never-forward', utm_campaign: 'private@example.com' } };
const request = data => new Request('https://naviigps.com/api/enquiries', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });

test('Web3Forms delivery retains routing and only bounded attribution', async () => {
  const calls = [];
  const post = route({ WEB3FORMS_ACCESS_KEY: 'test-fixture' }, async (url, options) => { calls.push({ url, body: JSON.parse(options.body) }); return Response.json({ success: true }); });
  const response = await post(request(input));
  assert.equal(response.status, 200); assert.equal((await response.json()).ok, true);
  assert.equal(calls.length, 1); assert.equal(calls[0].url, 'https://api.web3forms.com/submit');
  const { body } = calls[0];
  assert.equal(body.enquiry_intent, 'Software demo'); assert.equal(body.source_page, '/software'); assert.equal(body.product, 'g17-gps-tracker');
  assert.equal(body.utm_source, 'google'); assert.equal(body.landing_path, '/');
  assert.ok(!('token' in body)); assert.ok(!('utm_campaign' in body));
});

test('failed provider delivery never reports a successful enquiry', async () => {
  for (const outcome of [() => Response.json({ success: false }), () => Response.json({ success: true }, { status: 503 }), () => { throw new Error('offline'); }]) {
    const response = await route({ WEB3FORMS_ACCESS_KEY: 'test-fixture' }, async () => outcome())(request(input));
    assert.equal(response.status, 503); assert.equal((await response.json()).ok, false);
  }
  assert.equal((await route()(request(input))).status, 503);
});

test('validation and honeypot prevent delivery and preserve existing behavior', async () => {
  const noDelivery = route({ WEB3FORMS_ACCESS_KEY: 'test-fixture' });
  assert.equal((await noDelivery(request({ ...input, email: 'invalid' }))).status, 400);
  assert.equal((await noDelivery(request({ ...input, website: 'bot-filled' }))).status, 200);
});

test('email and webhook receive equivalent normalized routing with safe HTML', async () => {
  const calls = [];
  const post = route({ RESEND_API_KEY: 'test-fixture', CONTACT_WEBHOOK_URL: 'https://example.com/test-only' }, async (url, options) => { calls.push({ url, body: JSON.parse(options.body) }); return Response.json({}); });
  assert.equal((await post(request({ ...input, name: '<Buyer>' }))).status, 200);
  const email = calls.find(c => c.url.includes('resend')).body;
  assert.match(email.text, /Enquiry type: Software demo/); assert.match(email.text, /Enquiry from: \/software/);
  assert.match(email.html, /&lt;Buyer&gt;/); assert.doesNotMatch(email.html, /<Buyer>/);
  const webhook = calls.find(c => c.url.includes('example.com')).body;
  assert.deepEqual(webhook.context, { intent: 'software-demo', product: 'g17-gps-tracker', source: '/software' });
  assert.deepEqual(webhook.attribution, { utm_source: 'google', landing_path: '/' });
});
