import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { products } from '../components/products/data/productsData.ts';
import { formatInrPaise } from '../lib/product-pricing.ts';
import { shopOffers, getCompleteShopPrice } from '../lib/shop-offers.ts';

test('currency formatting uses exact validated integer paise', () => {
  assert.equal(formatInrPaise(252520),'₹2,525.20');
  assert.equal(formatInrPaise(0),'₹0.00');
  for(const invalid of [-1,NaN,Infinity,1.5,Number.MAX_VALUE])assert.throws(()=>formatInrPaise(invalid),RangeError);
});
test('G17 identity is unchanged but new approved pricing has one canonical source', () => {
  const product=products.find(product=>product.slug==='g17-gps-tracker');
  const offer=shopOffers.find(offer=>offer.id==='g17');
  assert.equal(product.id,1);
  assert.equal(offer.image,product.image);
  assert.equal(offer.productHref,`/products/${product.slug}`);
  assert.equal(offer.mrpInr,2500);
  assert.equal(offer.variants[0].baseInr,1200);
  assert.equal(getCompleteShopPrice(1200).totalPaise,252520);
  assert.equal(product.pricing,undefined,'obsolete inclusive bundle fields removed');
});
test('obsolete G17 posters and distance-based prices are not advertised on Shop Now', () => {
  const page=fs.readFileSync('app/shop-now/page.tsx','utf8');
  assert.doesNotMatch(page,/G17 first-year package|Offer_Status_Poster|G17_Product_Catalogue|shippingUpTo500KmInr|2,000/);
  const cards=fs.readFileSync('components/shop/ShopOffers.tsx','utf8');
  assert.doesNotMatch(cards,/500 km|Offer_Status_Poster|G17_Product_Catalogue/);
});
