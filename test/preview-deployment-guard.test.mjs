import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Phase 1 draft branch cannot trigger a Vercel deployment; other branches retain their settings', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.deepEqual(config.git.deploymentEnabled, { 'codex/panel-phase1-20261011': false });
});
