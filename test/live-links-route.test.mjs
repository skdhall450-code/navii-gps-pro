import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url), ts=require('../node_modules/typescript');
function route(api='https://api.example.invalid') { const exports={};const code=ts.transpileModule(fs.readFileSync(new URL('../app/share/route.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{exports,Response,URL,process:{env:{NEXT_PUBLIC_NAVII_API_URL:api,NODE_ENV:'production'}}});return exports.GET(); }
test('public document is standalone, no-store, no-referrer, nonindexable with no third-party scripts',async()=>{const r=route();const html=await r.text();assert.equal(r.status,200);assert.match(r.headers.get('Cache-Control'),/no-store/);assert.equal(r.headers.get('Referrer-Policy'),'no-referrer');assert.match(r.headers.get('X-Robots-Tag'),/noindex/);assert.match(r.headers.get('Content-Security-Policy'),/default-src 'none'/);assert.match(r.headers.get('Content-Security-Policy'),/connect-src https:\/\/api.example.invalid/);assert.match(html,/<script src="\/tracking-share\/viewer.js"><\/script>/);assert.equal((html.match(/<script/g)||[]).length,1);assert.doesNotMatch(html,/googletagmanager|GoogleAnalytics|gtag|dataLayer|__next_f/);});
test('invalid or insecure API configuration fails closed',()=>{for(const api of ['http://remote.example.invalid','ftp://example.invalid','https://user:pass@example.invalid','not-a-url'])assert.equal(route(api).status,503);});
test('Next configuration preserves stricter share privacy headers after its global rule', async () => {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, require, __dirname: new URL('../', import.meta.url).pathname });
  const rules = await exports.default.headers();
  const globalIndex = rules.findIndex(rule => rule.source === '/:path*');
  const shareIndex = rules.findIndex(rule => rule.source === '/share');
  assert.ok(globalIndex >= 0 && shareIndex > globalIndex);
  const headers = new Map();
  for (const rule of rules.filter(rule => ['/:path*', '/share'].includes(rule.source))) for (const header of rule.headers) headers.set(header.key.toLowerCase(), header.value);
  assert.equal(headers.get('referrer-policy'), 'no-referrer');
  assert.equal(headers.get('x-frame-options'), 'DENY');
  assert.equal(headers.get('x-content-type-options'), 'nosniff');
});
