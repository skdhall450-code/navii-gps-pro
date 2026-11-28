import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Panel review and SEO draft branches disable Vercel deployment; other branches retain their settings', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.deepEqual(config.git.deploymentEnabled, {
    'codex/panel-phase1-20261011': false,
    'codex/panel-motion-parity-20261122': false,
    'seo/crawlable-answers-main-20261105': false,
    'seo/puducherry-four-region-guide-20261127': false,
    'seo/jammu-kashmir-ut-guide-20261128': false,
  });
});
