import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Phase 1 and checkout foundation draft branches cannot trigger a Vercel deployment', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.deepEqual(config.git.deploymentEnabled, { 'codex/panel-phase1-20261011': false, 'feat/secure-shop-checkout-foundation': false });
});
