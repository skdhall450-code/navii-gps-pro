/* eslint-disable @typescript-eslint/no-require-imports -- CJS test installs a TypeScript require loader for isolated server-rendered markup checks. */
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { AppRouterContext } = require('next/dist/shared/lib/app-router-context.shared-runtime');
// Transpile the actual client page for server-rendered markup checks, without a browser or auth call.
require.extensions['.tsx'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
};
const LoginPage = require('../app/login/page.tsx').default;
const router = { back() {}, forward() {}, refresh() {}, hmrRefresh() {}, push() {}, replace() {}, prefetch() {} };
const html = renderToStaticMarkup(React.createElement(AppRouterContext.Provider, { value: router }, React.createElement(LoginPage)));
test('login renders labelled email/password form and accessible password toggle', () => {
  assert.match(html, /<label[^>]*for="email"/);
  assert.match(html, /<input[^>]*id="email"[^>]*type="email"[^>]*autoComplete="username"[^>]*required/);
  assert.match(html, /<label[^>]*for="password"/);
  assert.match(html, /<input[^>]*id="password"[^>]*type="password"[^>]*autoComplete="current-password"[^>]*required/);
  assert.match(html, /aria-pressed="false" aria-controls="password"/);
  assert.match(html, /aria-label="Show password"/);
  assert.match(html, /<form[^>]*aria-labelledby="login-heading"[^>]*aria-busy="false"/);
  assert.match(html, /<button[^>]*type="submit"/);
});
test('contact and legal navigation points at real local routes without fake recovery', () => {
  for (const route of ['contact', 'privacy-policy', 'terms']) {
    assert.match(html, new RegExp(`href="/${route}"`));
    assert.equal(fs.existsSync(path.join(__dirname, '..', 'app', route, 'page.tsx')), true);
  }
  assert.doesNotMatch(html, /forgot password|reset password|href="#"/i);
});
test('responsive branding and visible focus classes are present without changing auth endpoints', () => {
  assert.match(html, /lg:grid-cols-2/);
  assert.match(html, /lg:hidden/);
  assert.match(html, /focus-visible:ring-2/);
  const source = fs.readFileSync(path.join(__dirname, '../app/login/page.tsx'), 'utf8');
  assert.match(source, /\/api\/auth\/login/);
  assert.match(source, /\/api\/auth\/me/);
  assert.match(source, /if \(submitting.current\) return/);
  assert.match(source, /role="alert"\s+tabIndex=\{-1\}/);
  assert.match(source, /errorRef.current\?\.focus\(\)/);
});
test('mobile legal links retain scroll clearance above floating controls and safe areas', () => {
  assert.match(html, /pb-\[calc\(6rem\+env\(safe-area-inset-bottom\)\)\]/);
  assert.match(html, /lg:py-10/);
});
