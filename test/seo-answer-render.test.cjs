/* eslint-disable @typescript-eslint/no-require-imports -- Isolated CJS test renders the real page through a TypeScript require loader. */
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const previousResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  return previousResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, parent, ...args);
};
require.extensions['.tsx'] = require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
};

const { default: FAQ } = require('../components/contact/faq/ContactFAQ.tsx');
const { default: Specifications } = require('../components/products/details/ProductSpecifications.tsx');
const { products } = require('../components/products/data/productsData.ts');
const { default: ProductPage } = require('../app/products/[slug]/page.tsx');
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => {
  const data = JSON.parse(match[1]); return data['@graph'] || (Array.isArray(data) ? data : [data]);
});
test('all contact answers are in initial HTML, accessible without JavaScript', () => {
  const html = render(FAQ);
  assert.equal((html.match(/<details/g) || []).length, 4);
  assert.equal((html.match(/<summary/g) || []).length, 4);
  for (const text of ['installation availability', 'approval documents', 'mobile and web platform', 'hardware, subscription and account permissions']) assert.ok(html.includes(text));
  assert.doesNotMatch(html, /AIS 140 compliant GPS|iOS and Web Platform|across India through our support network/);
});
test('all product pages omit unverified offers and commercial prices', async () => {
  for (const product of products) {
    const html = renderToStaticMarkup(await ProductPage({ params: Promise.resolve({ slug: product.slug }) }));
    const graph = schemas(html);
    assert.ok(graph.some(item => item['@type'] === 'Product'));
    assert.ok(!graph.some(item => item['@type'] === 'Offer' || item['@type'] === 'AggregateOffer'));
    assert.equal(graph.find(item => item['@type'] === 'Product').offers, undefined);
    assert.doesNotMatch(html, /G17 price and included charges|Payable after round-off|2525\.00|2,525\.00/);
  }
});
test('specifications remain readable without animation or client execution', () => {
  const html = render(Specifications, { product: products[0] });
  assert.equal((html.match(/<dt /g) || []).length, products[0].specifications.length);
  assert.match(html, /GT06 compatible/);
  assert.doesNotMatch(html, /opacity:0/);
});
test('actual G17 page emits descriptive Product data without claiming an offer', async () => {
  const html = renderToStaticMarkup(await ProductPage({ params: Promise.resolve({ slug: 'g17-gps-tracker' }) }));
  const graph = schemas(html);
  const product = graph.find(item => item['@type'] === 'Product');
  assert.equal(product.offers, undefined);
  assert.ok(!graph.some(item => item['@type'] === 'Offer'));
  assert.equal(product.additionalProperty.length, products[0].specifications.length);
  assert.equal(product.aggregateRating, undefined);
  assert.equal(product.gtin, undefined);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
});
test('school bus software and deployment routes retain separate canonicals and distinct headings', () => {
  const software = require('../app/gps-tracking-system-school-bus/page.tsx');
  const deployment = require('../app/school-bus-gps/page.tsx');
  assert.notEqual(software.metadata.alternates.canonical, deployment.metadata.alternates.canonical);
  const html = render(software.default);
  assert.match(html, /School Bus Software Evaluation Checklist/);
  assert.match(html, /href="\/school-bus-gps"/);
  assert.match(html, /Parent access requires separate configuration/);
});
