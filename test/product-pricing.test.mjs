import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { products } from '../components/products/data/productsData.ts';
import { formatInrPaise, getProductPriceBreakdown } from '../lib/product-pricing.ts';

const g17 = products.find(product => product.slug === 'g17-gps-tracker');
const source = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('approved G17 first-year GST-inclusive bundle matches all quoted figures', () => {
  const breakdown = getProductPriceBreakdown(g17.pricing);
  assert.equal(breakdown.devicePaise, 112492);
  assert.equal(breakdown.simAnnualPaise, 42000);
  assert.equal(breakdown.platformAnnualPaise, 15000);
  assert.equal(breakdown.subtotalPaise, 169492);
  assert.equal(breakdown.gstPaise, 30508);
  assert.equal(breakdown.firstYearPaise, 200000);
  assert.equal(breakdown.subtotalPaise + breakdown.gstPaise, breakdown.firstYearPaise);
  assert.equal(formatInrPaise(breakdown.firstYearPaise), '₹2,000.00');
});

test('quantities multiply the rounded bundle, never aggregate-round a different total', () => {
  for (const quantity of [1, 2, 3, 10, 100, 1000]) {
    const breakdown = getProductPriceBreakdown(g17.pricing, quantity);
    assert.equal(breakdown.firstYearPaise, 200000 * quantity);
    assert.equal(breakdown.subtotalPaise, 169492 * quantity);
    assert.equal(breakdown.gstPaise, 30508 * quantity);
    assert.equal(breakdown.subtotalPaise + breakdown.gstPaise, breakdown.firstYearPaise);
  }
});

test('current-rate renewal is separately derived and is not a locked future commitment', () => {
  const breakdown = getProductPriceBreakdown(g17.pricing);
  assert.equal(breakdown.renewalSubtotalPaise, 57000);
  assert.equal(breakdown.renewalGstPaise, 10260);
  assert.equal(breakdown.renewalAnnualPaise, 67260);
  assert.match(source('app/shop-now/page.tsx'), /future rates may change/);
});

test('invalid quantities or inconsistent bundle quotes fail instead of silently charging differently', () => {
  for (const quantity of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
    assert.throws(() => getProductPriceBreakdown(g17.pricing, quantity), RangeError);
  }
  for (const patch of [{ firstYearTotalInr: 2001 }, { deviceSaleInr: 700 }, { deviceSaleInr: -1 }, { gstRatePercent: -1 }]) {
    assert.throws(() => getProductPriceBreakdown({ ...g17.pricing, ...patch }), RangeError);
  }
});

test('store headline and WhatsApp enquiry share the bundle amount and no device-MRP comparison', () => {
  const page = source('app/shop-now/page.tsx');
  assert.match(page, /getProductPriceBreakdown\(pricing\)/);
  assert.match(page, /G17 first-year package/);
  assert.match(page, /first-year package at \$\{money\(firstYearTotal\)\}/);
  assert.doesNotMatch(page, /1,463\.20|1463\.20|637\.20|deviceMrpInr|deviceGst|simGst|platformGst/);
  assert.equal(g17.pricing.deviceMrpInr, 2000);
  assert.deepEqual(products.filter(product => product.pricing).map(product => product.slug), ['g17-gps-tracker']);
});
