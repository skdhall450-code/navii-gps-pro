import test from 'node:test';
import assert from 'node:assert/strict';
import { isPanelRoute } from '../lib/panel-route.ts';
test('operational panel route boundary includes root and nested pages',()=>{
 for(const path of ['/dashboard','/dashboard/reports','/dashboard/vehicles/qa'])assert.equal(isPanelRoute(path),true);
 for(const path of [null,'/','/login','/dashboard-preview','/products'])assert.equal(isPanelRoute(path),false);
});
