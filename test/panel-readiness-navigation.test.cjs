/* eslint-disable @typescript-eslint/no-require-imports -- Inspect the real compiled navigation without mounting or contacting an API. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

const source = fs.readFileSync(require.resolve('../app/dashboard/layout.tsx'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const result = {};
vm.runInNewContext(code + '\nexports.navigation = navigation;', {
  exports: result, require: () => ({}), process: { env: {} },
});
const navigation = JSON.parse(JSON.stringify(result.navigation));

test('Health Centre navigation is limited to manager roles', () => {
  const item = navigation.find(row => row.href === '/dashboard/device-health');
  assert.equal(item.name, 'Device Health Centre');
  assert.deepEqual(item.roles, ['SUPER_ADMIN', 'ADMIN', 'DEALER']);
});
test('Renewal navigation includes customers but does not expose an unsupported USER role', () => {
  const item = navigation.find(row => row.href === '/dashboard/renewals');
  assert.equal(item.name, 'Renewal worklist');
  assert.deepEqual(item.roles, ['SUPER_ADMIN', 'ADMIN', 'DEALER', 'CUSTOMER']);
});
test('Readiness integration preserves existing workspaces and has no sharing menu or duplicate path', () => {
  for (const href of ['/dashboard/maintenance', '/dashboard/reports', '/dashboard/alerts', '/dashboard/device-setup']) assert.ok(navigation.some(row => row.href === href));
  assert.equal(navigation.some(row => row.href === '/dashboard/live-links'), false);
  assert.equal(new Set(navigation.map(row => row.href)).size, navigation.length);
});
