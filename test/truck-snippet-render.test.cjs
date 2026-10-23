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
const { default: Page, metadata } = require('../app/truck-gps/page.tsx');
const html = renderToStaticMarkup(React.createElement(Page));
const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const fullTitle = `${metadata.title} | NAVII GPS INDIA`;

test('truck comparison snippet is concise and consistent across metadata and page schema', () => {
  assert.equal(metadata.title, 'GPS for Trucks in India: Compare Trackers');
  assert.ok(fullTitle.length <= 60);
  assert.ok(metadata.description.length <= 160);
  assert.equal(metadata.openGraph.title, fullTitle);
  assert.equal(metadata.twitter.title, fullTitle);
  assert.equal(metadata.openGraph.description, metadata.description);
  assert.equal(metadata.twitter.description, metadata.description);
  const webpage = graph.find(item => item['@type'] === 'WebPage');
  assert.equal(webpage.name, fullTitle);
  assert.equal(webpage.description, metadata.description);
});

test('the snippet comparison, functions and quote are supported by the existing guide', () => {
  assert.match(metadata.description, /Compare G17 and GS900 4G options for truck tracking/);
  assert.match(metadata.description, /itemised installation quote/);
  for (const evidence of ['G17 GPS Tracker', 'GS900 4G GPS Tracker', 'Live truck location', 'Trip history and playback', 'Geofences and vehicle alerts', 'itemised quote covering hardware, installation']) {
    assert.ok(html.includes(evidence), `Missing supporting page content: ${evidence}`);
  }
  assert.doesNotMatch(metadata.description, /guaranteed|cheapest|free installation|certified|fuel savings/i);
});

test('the indexed truck URL, H1 and established service/FAQ schema stay intact', () => {
  assert.equal(metadata.alternates.canonical, 'https://naviigps.com/truck-gps');
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.match(html, /GPS for Trucks/);
  assert.ok(graph.some(item => item['@type'] === 'Service' && item.url === metadata.alternates.canonical));
  assert.equal(graph.find(item => item['@type'] === 'FAQPage').mainEntity.length, 6);
});
