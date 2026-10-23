import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = path => readFileSync(new URL(`../${path}`, import.meta.url));
const revisions = JSON.parse(source('lib/seo/contentRevisions.json'));

test('reviewed sitemap dates have a real source, timestamp and unchanged content fingerprint', () => {
  assert.ok(Object.keys(revisions).length > 0);
  for (const [route, revision] of Object.entries(revisions)) {
    assert.match(route, /^\/[a-z0-9-]+$/);
    assert.equal(revision.sourcePath, `app${route}/page.tsx`);
    assert.match(revision.sourceCommit, /^[a-f0-9]{40}$/);
    assert.match(revision.lastModified, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/);
    assert.ok(Number.isFinite(Date.parse(revision.lastModified)));
    assert.ok(Date.parse(revision.lastModified) <= Date.now(), `${route}: lastmod cannot be in the future`);
    assert.equal(createHash('sha256').update(source(revision.sourcePath)).digest('hex'), revision.sourceSha256,
      `${route}: review this content edit and update its revision record before changing lastmod`);
  }
});

test('sitemap dates remain tied to reviewed route records, with unknown dates omitted', () => {
  const sitemap = source('app/sitemap.ts').toString();
  assert.match(sitemap, /contentRevisions\.json/);
  assert.match(sitemap, /revisions\[new URL\(route\.url\)\.pathname\]/);
  assert.match(sitemap, /revision \? \{ \.\.\.route, lastModified: revision\.lastModified \} : route/);
  assert.doesNotMatch(sitemap, /new Date\(|Date\.now\(/);
  assert.equal(revisions['/'], undefined);
  assert.equal(revisions['/login'], undefined);
  assert.equal(revisions['/gps-tracker/chhattisgarh/surguja/sitapur'], undefined);
});
