import test from 'node:test';
import assert from 'node:assert/strict';
import { NAVII_SHOP_URL, shopNavigationProps } from '../lib/shop-destination.ts';

test('Shop Now opens the approved public store in an isolated new tab', () => {
  assert.equal(NAVII_SHOP_URL, 'https://shop.naviigps.com/');
  assert.deepEqual(shopNavigationProps('/shop-now'), {
    href: NAVII_SHOP_URL,
    target: '_blank',
    rel: 'noopener noreferrer',
    title: 'Open NAVII Shop in a new tab',
  });
});

test('all other navigation URLs preserve their current destination and behavior', () => {
  for (const href of ['/', '/about', '/products', '/software', '/industries', '/contact', '/login', '/gps-tracker/chandigarh', '/shop-now/details']) {
    assert.deepEqual(shopNavigationProps(href), { href });
  }
});
