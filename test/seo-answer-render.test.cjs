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
const jsonLdDocuments = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
const schemas = html => jsonLdDocuments(html).flatMap(data => data['@graph'] || (Array.isArray(data) ? data : [data]));
const offerPaths = (value, location = '$') => {
  if (!value || typeof value !== 'object') return [];
  const types = [].concat(value['@type'] || []);
  const found = types.some(type => /(?:^|[:/#])(?:Offer|AggregateOffer)$/.test(type)) ? [location] : [];
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${location}.${key}`;
    if (key === 'offers') found.push(childPath);
    found.push(...offerPaths(child, childPath));
  }
  return found;
};

test('offer guard detects nested objects, arrays, multi-types and reference-only offers', () => {
  for (const fixture of [
    { '@graph': [{ '@type': 'Product', offers: { '@id': '#offer' } }] },
    { mainEntity: { '@type': 'Product', subjectOf: { '@type': 'Offer' } } },
    [{ nested: [{ '@type': ['Thing', 'AggregateOffer'] }] }],
    { mainEntity: { '@type': 'https://schema.org/Offer' } },
    { '@graph': [], offers: { '@id': '#offer' } },
  ]) assert.ok(offerPaths(fixture).length > 0, JSON.stringify(fixture));
  assert.deepEqual(offerPaths({ '@type': 'Product', description: 'Ask about offers', additionalProperty: [{ '@type': 'PropertyValue', name: 'Protocol', value: 'GT06 compatible' }] }), []);
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
    assert.deepEqual(offerPaths(jsonLdDocuments(html)), [], product.slug);
    assert.doesNotMatch(html, /G17 price and included charges|Payable after round-off|2525\.00|2,525\.00/);
  }
});
test('every product renders all specification labels and values without hidden animation', () => {
  const escaped = text => renderToStaticMarkup(React.createElement(React.Fragment, null, text));
  for (const product of products) {
    const html = render(Specifications, { product });
    const labels = [...html.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>/g)].map(match => match[1].trim());
    const values = [...html.matchAll(/<dd\b[^>]*>([\s\S]*?)<\/dd>/g)].map(match => match[1].trim());
    assert.ok(product.specifications.length > 0, product.slug);
    assert.deepEqual(labels, product.specifications.map(item => escaped(item.label)), product.slug);
    assert.deepEqual(values, product.specifications.map(item => escaped(item.value)), product.slug);
    assert.doesNotMatch(html, /opacity:\s*0(?:[;"\s]|$)/, product.slug);
  }
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
test('every Product schema matches its rendered catalogue record and canonical metadata', async () => {
  const { generateMetadata } = require('../app/products/[slug]/page.tsx');
  for (const product of products) {
    const props = { params: Promise.resolve({ slug: product.slug }) };
    const html = renderToStaticMarkup(await ProductPage(props));
    const metadata = await generateMetadata(props);
    const records = schemas(html).filter(item => item['@type'] === 'Product');
    assert.equal(records.length, 1, product.slug);
    const record = records[0];
    assert.equal(record.url, metadata.alternates.canonical, product.slug);
    assert.equal(record['@id'], `${record.url}#product`, product.slug);
    assert.equal(record.name, product.name, product.slug);
    assert.equal(record.description, product.description, product.slug);
    assert.equal(record.category, product.category, product.slug);
    assert.deepEqual(record.image, product.gallery.map(image => `https://naviigps.com${image}`), product.slug);
    assert.deepEqual(record.additionalProperty, product.specifications.map(spec => ({ '@type': 'PropertyValue', name: spec.label, value: spec.value })), product.slug);
    for (const unsupported of ['aggregateRating', 'review', 'gtin', 'gtin13', 'mpn']) {
      assert.equal(record[unsupported], undefined, `${product.slug}: ${unsupported}`);
    }
  }
});
test('all schema product image URLs point to existing local catalogue assets', () => {
  for (const product of products) {
    assert.ok(product.gallery.length > 0, product.slug);
    for (const image of product.gallery) {
      assert.match(image, /^\/assets\/products\//, product.slug);
      assert.ok(fs.existsSync(path.join(root, 'public', image)), `${product.slug}: ${image}`);
    }
  }
});
test('contact disclosures retain one initially open answer and native summary semantics', () => {
  const html = render(FAQ);
  const disclosures = [...html.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)];
  assert.equal(disclosures.length, 4);
  assert.equal(disclosures.filter(match => /\bopen(?:=|\s|$)/.test(match[1])).length, 1);
  for (const disclosure of disclosures) {
    assert.match(disclosure[2], /^<summary\b[^>]*>[^<]+<\/summary><p\b/);
    assert.doesNotMatch(disclosure[2], /aria-hidden="true"|hidden=""|display:none|opacity:0/);
  }
});
test('school bus software and deployment routes retain separate canonicals and distinct headings', () => {
  const software = require('../app/gps-tracking-system-school-bus/page.tsx');
  const deployment = require('../app/school-bus-gps/page.tsx');
  assert.notEqual(software.metadata.alternates.canonical, deployment.metadata.alternates.canonical);
  const html = render(software.default);
  const deploymentHtml = render(deployment.default);
  const headings = markup => [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(match => match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
  assert.deepEqual(headings(html), ['School Bus Tracking Software']);
  assert.deepEqual(headings(deploymentHtml), ['School Bus GPS Tracking for Transport Teams in India']);
  assert.notEqual(headings(html)[0], headings(deploymentHtml)[0]);
  assert.match(html, /School Bus Software Evaluation Checklist/);
  assert.match(html, /href="\/school-bus-gps"/);
  assert.match(html, /If you need parent access, ask whether it is available for your proposed deployment/);
  assert.match(html, /request a demonstration before promising it to families/);
  assert.doesNotMatch(html, /Parent access requires separate configuration/);
});
