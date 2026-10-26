import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { products } from '../components/products/data/productsData.ts';
import { getShopEnquiryUrl, shopOffers } from '../lib/shop-offers.ts';

function sources(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
    const file=path.join(dir,entry.name);
    return entry.isDirectory() ? sources(file) : /\.(tsx?|mjs)$/.test(file) ? [file] : [];
  });
}
test('all hardcoded website contact links route to owner-approved channel numbers', () => {
  let whatsapp=0, calls=0;
  for (const file of ['app','components','lib'].flatMap(sources)) {
    const source=fs.readFileSync(file,'utf8');
    for (const [,phone] of source.matchAll(/https:\/\/wa\.me\/(\d+)/g)) {assert.equal(phone,'918899729705',file);whatsapp++;}
    for (const [,phone] of source.matchAll(/tel:(\+?\d+)/g)) {assert.equal(phone,'+917717394007',file);calls++;}
    assert.doesNotMatch(source,/telephone:\s*["']\+918899729705["']/,file);
  }
  assert.ok(whatsapp>=10);assert.ok(calls>=10);
});
test('product and shop dynamic enquiry links use WhatsApp, not call number', () => {
  for (const product of products) assert.equal(product.whatsapp,'918899729705');
  for (const offer of shopOffers) {
    const url=new URL(getShopEnquiryUrl(offer,offer.variants[0]));
    assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/918899729705');
    assert.ok(url.searchParams.get('text'));
  }
});
test('floating widget, enquiry fallback and displayed labels agree with channel destinations', () => {
  for (const file of ['components/common/FloatingWhatsApp.tsx','components/contact/form/ContactForm.tsx']) {
    const source=fs.readFileSync(file,'utf8'); assert.match(source,/"918899729705"/);assert.doesNotMatch(source,/"917717394007"/);
  }
  const footer=fs.readFileSync('components/layout/footerData.ts','utf8');
  assert.match(footer,/phone: "\+91 77173 94007"/);assert.match(footer,/whatsapp: "\+91 88997 29705"/);
  assert.match(fs.readFileSync('components/about/director/directorData.ts','utf8'),/phone: "\+91 77173 94007"/);
});
