import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { products } from '../components/products/data/productsData.ts';
import { getProductPriceBreakdown } from '../lib/product-pricing.ts';
const source = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage and G17 have direct offer paths and product PDF is real', () => {
  assert.match(source('components/home/HeroContent.tsx'), /href="\/shop-now#g17"/);
  assert.match(source('components/layout/FooterV2.tsx'), /href="\/shop-now"/);
  assert.match(source('components/products/details/ProductHero.tsx'), /href="\/shop-now#g17"/);
  const product = products.find(p => p.slug === 'g17-gps-tracker');
  assert.equal(product.brochure, '/catalogs/NAVII_GPS_G17_Product_Catalogue.pdf');
  assert.equal(fs.readFileSync(new URL(`../public${product.brochure}`, import.meta.url)).subarray(0, 5).toString(), '%PDF-');
  const price = getProductPriceBreakdown(product.pricing);
  assert.equal(price.firstYearPaise, 200000);
  assert.equal(price.subtotalPaise, 169492);
  assert.equal(price.gstPaise, 30508);
  assert.equal(price.renewalAnnualPaise, 67260);
  assert.equal(getProductPriceBreakdown(product.pricing, 2).firstYearPaise, 400000);
});

test('product/store footer has persistent legal links and no fake subscription form', () => {
  const footer = source('components/layout/Footer.tsx');
  for (const path of ['/terms', '/privacy-policy', '/account-deletion']) assert.ok(footer.includes(`href="${path}"`));
  assert.doesNotMatch(footer, /<form|Subscribe|type="email"/);
  for (const page of ['app/shop-now/page.tsx', 'app/products/[slug]/page.tsx']) assert.match(source(page), /PurchaseChecks/);
  const checks = source('components/products/details/PurchaseChecks.tsx');
  for (const topic of ['Warranty duration', 'Return or cancellation', 'installation', 'delivery', 'tax treatment']) assert.ok(checks.includes(topic));
});

test('software app links are role-specific Android links, not dead buttons or guessed iOS', () => {
  const apps = source('components/software/apps/MobileApps.tsx');
  for (const id of ['com.naviigps.app', 'com.naviigps.dealer', 'com.naviigps.customer']) assert.ok(apps.includes(id));
  assert.match(apps, /play.google.com\/store\/apps\/details\?id=/);
  assert.doesNotMatch(apps, /com\.naviigps\.fleet|apps\.apple\.com|<button|Scan QR/);
  assert.match(apps, /assigned NAVII GPS account role/);
});

test('demo and mobile calls to action carry intent directly to the enquiry form', () => {
  for (const [file, intent] of [
    ['components/home/HeroContent.tsx', 'software-demo'],
    ['components/home/CTA/CTAButtons.tsx', 'software-demo'],
    ['components/software/hero/SoftwareHero.tsx', 'software-demo'],
    ['components/software/CTA.tsx', 'software-demo'],
    ['components/software/apps/MobileApps.tsx', 'mobile-access'],
  ]) assert.ok(source(file).includes(`intent=${intent}`) && source(file).includes('#contact-form'));
  const form = source('components/contact/form/ContactForm.tsx');
  assert.match(form, /<select name="intent"/); assert.match(form, /submissionLock\.current/);
  assert.match(form, /NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY/); assert.match(form, /fetch\("\/api\/enquiries"/);
  assert.match(form, /readCampaignAttribution\(\)/); assert.match(form, /body: JSON.stringify\(\{ \.\.\.form, \.\.\.routing, attribution \}\)/);
});

test('sample dashboards and rendered trust sections do not present unsupported metrics', () => {
  for (const file of ['components/home/HeroVisual.tsx', 'components/home/Software/DashboardCard.tsx']) {
    const content = source(file); assert.match(content, /Illustrative demo/); assert.match(content, /Sample data/);
    assert.doesNotMatch(content, /Live Dashboard|25,486|4,250|>\s*Online\s*</);
  }
  for (const file of ['components/products/hero/ProductHero.tsx', 'components/home/HeroContent.tsx', 'components/home/Stats.tsx', 'components/home/WhyChoose/featuresData.ts', 'components/home/CTA/CTAStats.tsx', 'components/about/AboutHero.tsx', 'components/about/CompanyStory.tsx', 'components/about/WhyNavii.tsx']) assert.doesNotMatch(source(file), /25K\+|500\+|98%|24×7|100% Secure|10\+/);
  assert.doesNotMatch(source('components/products/hero/ProductHero.tsx'), /Certified Device|AIS.?140 Certified|LTE Tracking/);
  assert.doesNotMatch(source('app/page.tsx'), /<Testimonials/);
  assert.doesNotMatch(source('app/about/page.tsx'), /<Timeline|<Certifications/);
});
