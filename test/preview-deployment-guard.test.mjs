import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Panel, SEO and combined draft branches cannot trigger Vercel deployments; other branches retain their settings', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.deepEqual(config.git.deploymentEnabled, {
    'codex/panel-phase1-20261011': false,
    'codex/panel-provenance-print-20261106': false,
    'local/reconcile-pr110-main-20261111': false,
    'seo/crawlable-answers-main-20261105': false,
    'local/seo-panel-review-20261112': false,
  });
});
