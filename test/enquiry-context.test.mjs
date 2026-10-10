import assert from 'node:assert/strict';
import test from 'node:test';
import { ENQUIRY_INTENTS, ANALYTICS_CONSENT_KEY, ATTRIBUTION_STORAGE_KEY, normalizeEnquiryContext, normalizeAttribution, enquirySourceKey, captureCampaignAttribution, readCampaignAttribution, clearCampaignAttribution } from '../lib/enquiry-context.ts';

const storage = () => { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }; };
const mockWindow = (consent = null, path = '/') => {
  const w = { localStorage: storage(), sessionStorage: storage(), location: { pathname: path, search: '?utm_source=google&utm_medium=search&utm_campaign=g17-offer&email=private@example.com&token=secret' } };
  if (consent) w.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  return w;
};

test('enquiry links accept only supported intent, product and source values', () => {
  for (const intent of Object.keys(ENQUIRY_INTENTS)) assert.equal(normalizeEnquiryContext({ intent }).intent, intent);
  assert.deepEqual(normalizeEnquiryContext({ intent: 'product-quote', product: 'g17-gps-tracker', source: 'products' }), { intent: 'product-quote', product: 'g17-gps-tracker', source: '/products' });
  for (const value of ['__proto__', 'constructor', '<script>', 'https://evil.test?secret=123', null, 10]) {
    assert.deepEqual(normalizeEnquiryContext({ intent: value, product: value, source: value }), { intent: 'consultation', product: '', source: '/contact' });
  }
  assert.equal(enquirySourceKey('/software'), 'software');
  assert.equal(enquirySourceKey('/products/g17-gps-tracker'), 'products');
  assert.equal(enquirySourceKey('/dashboard/private-id'), 'contact');
});

test('campaign context drops PII, credentials, long IDs, URLs and unknown fields', () => {
  assert.deepEqual(normalizeAttribution({ utm_source: 'Google', utm_medium: 'paid-search', utm_campaign: 'g17_oct', landing_path: '/products/g17-gps-tracker', email: 'private@example.com', gclid: 'unknown-id' }), { utm_source: 'google', utm_medium: 'paid-search', landing_path: '/products/g17-gps-tracker' });
  for (const value of ['private@example.com', 'https://example.com', 'hello world', 'a'.repeat(49), 'user123456789', 'api_key_private', 'authToken', 'password', 'customer-jane-smith', 'phone-98765-43210', 'opaqueCustomerIDabc', '\nsearch', {}, 123]) {
    assert.deepEqual(normalizeAttribution({ utm_source: value }), {});
  }
  assert.deepEqual(normalizeAttribution({ utm_campaign: 'g17-offer', utm_content: 'customer-jane-smith', utm_term: 'private' }), {});
  for (const path of ['/dashboard/customer/123', '/contact?email=private@example.com', '/products/private-id', 'https://naviigps.com/']) assert.deepEqual(normalizeAttribution({ landing_path: path }), {});
});

test('campaign storage is consent-gated, tab-scoped and retains only first eligible campaign', () => {
  const original = globalThis.window;
  try {
    globalThis.window = mockWindow();
    captureCampaignAttribution(); assert.deepEqual(readCampaignAttribution(), {});
    assert.equal(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY), null);
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');
    captureCampaignAttribution();
    const first = { utm_source: 'google', utm_medium: 'search', landing_path: '/' };
    assert.deepEqual(readCampaignAttribution(), first);
    window.location = { pathname: '/contact', search: '?utm_campaign=other' };
    captureCampaignAttribution(); assert.deepEqual(readCampaignAttribution(), first);
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'denied');
    assert.deepEqual(readCampaignAttribution(), {}); captureCampaignAttribution();
    assert.equal(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY), null);
  } finally { globalThis.window = original; }
});

test('storage errors, private routes and malformed cached context do not block enquiries', () => {
  const original = globalThis.window;
  try {
    globalThis.window = mockWindow('granted', '/dashboard');
    captureCampaignAttribution(); assert.deepEqual(readCampaignAttribution(), {});
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, '{bad-json');
    assert.deepEqual(readCampaignAttribution(), {});
    window.localStorage.getItem = () => { throw new Error('storage blocked'); };
    assert.doesNotThrow(captureCampaignAttribution); assert.deepEqual(readCampaignAttribution(), {});
    window.sessionStorage.removeItem = () => { throw new Error('storage blocked'); };
    assert.doesNotThrow(clearCampaignAttribution);
  } finally { globalThis.window = original; }
});
