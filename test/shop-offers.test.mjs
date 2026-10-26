import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { shopOffers, getShopOfferPrice, getShopEnquiryUrl, getCompleteShopPrice, SHOP_CHARGES, SHOP_GST_PERCENT } from '../lib/shop-offers.ts';
const byId = id => shopOffers.find(offer => offer.id === id);

test('owner device prices are ex-GST, with exact 18% totals', () => {
  assert.equal(SHOP_GST_PERCENT, 18);
  for (const [id, base, gst, total] of [['g17',1200,216,1416],['bt50',1200,216,1416],['gx03',1500,270,1770],['gs900',1500,270,1770],['s15',3000,540,3540],['obd',2000,360,2360],['ai-dashcam',7000,1260,8260],['non-ai-dashcam',5000,900,5900]]) {
    assert.equal(byId(id).variants[0].baseInr, base);
    assert.deepEqual(getShopOfferPrice(base), {basePaise:base*100,gstPaise:gst*100,totalPaise:total*100});
  }
  assert.equal(byId('g17').mrpInr,2500);
  assert.equal(byId('bt50').mrpInr,3000);
  assert.equal(byId('gx03').mrpInr,3500);
  assert.equal(byId('gs900').mrpInr,3500);
  assert.equal(byId('s15').mrpInr,5600);
  assert.equal(byId('obd').mrpInr,3000);
  assert.equal(byId('ai-dashcam').mrpInr,9500);
  assert.equal(byId('non-ai-dashcam').mrpInr,8500);
});
test('AIS 140 has distinct validity options and no invented MRP', () => {
  assert.equal(byId('ais140').mrpInr,undefined);
  assert.deepEqual(byId('ais140').variants.map(v=>[v.id,v.label,v.baseInr]),[['one-year','1-year validity',5000],['two-years','2-year validity',6500]]);
  assert.equal(getShopOfferPrice(5000).totalPaise,590000);
  assert.equal(getShopOfferPrice(6500).totalPaise,767000);
});
test('GX03 is not GS900 and unverified product photos/spec links are absent', () => {
  assert.notEqual(byId('gx03').id,byId('gs900').id);
  for (const id of ['gx03','s15','ais140','obd','ai-dashcam','non-ai-dashcam']) {
    assert.equal(byId(id).image,undefined);
    assert.equal(byId(id).productHref,undefined);
  }
});
test('each WhatsApp enquiry uses its exact model, variant and correct GST total', () => {
  for (const offer of shopOffers) for (const variant of offer.variants) {
    const url=new URL(getShopEnquiryUrl(offer,variant));
    assert.equal(url.origin,'https://wa.me');
    assert.equal(url.pathname,'/918899729705');
    const text=url.searchParams.get('text');
    assert.ok(text.includes(offer.name)); assert.ok(text.includes(variant.label));
    assert.ok(text.includes(`INR ${(getCompleteShopPrice(variant.baseInr,offer.chargePolicy).totalPaise/100).toFixed(2)}`));
    assert.ok(text.includes('Shipping & handling: INR 250.00 + GST INR 45.00'));
    if(offer.chargePolicy==='shipping-only') {
      assert.doesNotMatch(text,/Airtel SIM|Software platform fee/);
    }else{
      assert.ok(text.includes('Airtel SIM · 12 months: INR 540.00 + GST INR 97.20'));
      assert.ok(text.includes('Software platform fee: INR 150.00 + GST INR 27.00'));
    }
    assert.match(text,/confirm availability, exact service\/validity inclusions, installation charges/);
  }
});
test('invalid price inputs fail safely', () => {
  for (const amount of [-1,NaN,Infinity,Number.MAX_VALUE]) assert.throws(()=>getShopOfferPrice(amount),RangeError);
});
test('Shop Now uses canonical model prices without stale G17 package downloads', () => {
  const page=fs.readFileSync('app/shop-now/page.tsx','utf8');
  assert.match(page,/<ShopOffers \/>/);
  assert.doesNotMatch(page,/Request the current G17 quote|G17 first-year package/);
  assert.doesNotMatch(page,/More models coming/);
  const cards=fs.readFileSync('components/shop/ShopOffers.tsx','utf8');
  assert.doesNotMatch(cards,/G17_Product_Catalogue|Offer_Status_Poster|<del|<s>/);
});

test('GPS service policy adds exactly the approved SIM, platform and flat shipping fees', () => {
  assert.deepEqual(SHOP_CHARGES.map(c => c.baseInr),[540,150,250]);
  for (const [base,total] of [[1200,252520],[1500,287920],[3000,464920],[5000,700920],[6500,877920],[2000,346920],[7000,936920]]) {
    const price=getCompleteShopPrice(base);
    assert.equal(price.extraBasePaise,94000);
    assert.equal(price.extraGstPaise,16920);
    assert.equal(price.extraTotalPaise,110920);
    assert.equal(price.totalPaise,total);
    assert.equal(price.basePaise+price.gstPaise,price.totalPaise);
    assert.deepEqual(price.charges.map(c=>c.totalPaise),[63720,17700,29500]);
  }
});
test('two-year AIS validity does not silently double the 12-month SIM or platform', () => {
  const offer=byId('ais140');
  const one=getCompleteShopPrice(offer.variants[0].baseInr);
  const two=getCompleteShopPrice(offer.variants[1].baseInr);
  assert.deepEqual(one.charges,two.charges);
  const cards=fs.readFileSync('components/shop/ShopOffers.tsx','utf8');
  assert.match(cards,/SIM shown covers 12 months only/);
  assert.match(cards,/Confirm platform coverage/);
});

test('final payable rounds to nearest rupee without altering GST or components', () => {
  for(const [base,rounded] of [[1200,252500],[1500,287900],[3000,464900],[5000,700900],[6500,877900],[2000,346900],[7000,936900]]){
    const price=getCompleteShopPrice(base);
    assert.equal(price.payablePaise,rounded);
    assert.equal(price.roundOffPaise,-20);
    assert.equal(price.basePaise+price.gstPaise+price.roundOffPaise,price.payablePaise);
    assert.equal(price.device.gstPaise,Math.round(base*100*.18));
  }
  for(const offer of shopOffers)for(const variant of offer.variants){
    const price=getCompleteShopPrice(variant.baseInr,offer.chargePolicy);
    const text=new URL(getShopEnquiryUrl(offer,variant)).searchParams.get('text');
    assert.ok(text.includes(`Final payable: INR ${(price.payablePaise/100).toFixed(2)}`));
    assert.ok(text.includes(offer.chargePolicy==='shipping-only'?'Round-off: +INR 0.00':'Round-off: -INR 0.20'));
  }
});

test('both dash cams charge shipping only, while OBD includes all approved services', () => {
  for(const [id,total] of [['non-ai-dashcam',619500],['ai-dashcam',855500]]) {
    const offer=byId(id), price=getCompleteShopPrice(offer.variants[0].baseInr,offer.chargePolicy);
    assert.equal(offer.chargePolicy,'shipping-only');
    assert.deepEqual(price.charges.map(c=>c.id),['shipping']);
    assert.equal(price.extraBasePaise,25000);
    assert.equal(price.extraGstPaise,4500);
    assert.equal(price.totalPaise,total);
    assert.equal(price.payablePaise,total);
    assert.equal(price.roundOffPaise,0);
    assert.equal(price.basePaise+price.gstPaise+price.roundOffPaise,total);
  }
  const obd=byId('obd');
  assert.deepEqual(getCompleteShopPrice(obd.variants[0].baseInr,obd.chargePolicy).charges.map(c=>c.id),['sim','platform','shipping']);
  assert.equal(shopOffers.length,9);
  assert.equal(shopOffers.flatMap(o=>o.variants).length,10);
});
