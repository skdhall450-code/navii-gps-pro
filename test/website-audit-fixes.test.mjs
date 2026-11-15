import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('legacy footer uses the same isolated shop destination as headers',()=>{
 assert.match(src('components/layout/Footer.tsx'),/shopNavigationProps\(item.href\)/);
});
test('legacy shop URL retains its canonical but retires conflicting prices and placeholders',()=>{
 const s=src('app/shop-now/page.tsx');
 assert.match(s,/https:\/\/naviigps.com\/shop-now/);
 assert.match(s,/href=\{NAVII_SHOP_URL\} target="_blank" rel="noopener noreferrer"/);
 assert.doesNotMatch(s,/ShopOffers|#device-offers/);
 assert.match(src('app/products/[slug]/page.tsx'),/href="\/shop-now"/);
});
test('public app copy does not promise unverified iOS or instant alert availability',()=>{
 for(const p of ['components/home/FAQ/faqData.ts','components/home/Software/softwareData.ts','components/software/features/SoftwareFeatures.tsx','components/software/hero/SoftwareHero.tsx','components/contact/faq/ContactFAQ.tsx'])assert.doesNotMatch(src(p),/Android.*iOS|iPhone|Instant Alerts|notifications instantly/);
 assert.match(src('components/home/FAQ/faqData.ts'),/selected solution, permissions and device connectivity/);
});
test('G17 buyers see voltage verification requirement and explicit unconfirmed commercial terms',()=>{
 const s=src('components/products/data/productsData.ts').split('id: 2,')[0];
 for(const value of ['Confirm the rated input on the exact supplied unit','Mobile Network','Warranty','Package & Renewal','Confirm'])assert.ok(s.includes(value));
});
test('duplicate metric blocks removed without removing content sections or links',()=>{
 const s=src('app/page.tsx');
 assert.doesNotMatch(s,/<Stats/);
 for(const c of ['ProductsSection','WhyChoose','Software','SolutionsShowcase','Clients','CTA','FAQ','Testimonials'])assert.ok(s.includes('<'+c));
 assert.doesNotMatch(src('components/home/CTA/CTA.tsx'),/CTAStats/);
 assert.doesNotMatch(src('components/home/WhyChoose/featuresData.ts'),/100%|98%|10\+/);
});
