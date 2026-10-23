# Reviewed content dates and town-page copy

## Sitemap lastmod

`lib/seo/contentRevisions.json` stores reviewed substantive revisions for existing
public guides. Each record has the actual Git commit timestamp, commit SHA,
source path and SHA-256 of that page's source. The initial ten records were
checked against the content additions in their cited commits. These are content
modification dates, not deployment dates or an indexing guarantee.

`app/sitemap.ts` adds `lastModified` only when a route has a reviewed record.
Other URLs remain in the sitemap without a date. Do not substitute the build
clock, latest repository commit or a guessed date for an unknown content date.

When one of the recorded pages changes:
1. Review the diff. Update `lastModified` and `sourceCommit` only for a substantive
   change to the page's main content, structured data or important links.
2. Use the actual content commit timestamp and SHA. If this is formatting-only,
   preserve the last substantive date and commit.
3. Update `sourceSha256` to the current page file's SHA-256 after review. The test
   deliberately fails on unreviewed changes to a recorded source file.
4. Run the regression suite, production build and `npm run seo:check`.

For a new route record, verify its content history first. Template or shared-data
changes require checking the affected pages; do not assign one guessed date to
all location pages. Google recommends accurate, verifiable dates for significant
updates: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## Chhattisgarh towns

The 66 existing town routes keep their names, titles, canonical URLs, district
and sibling links, service schema and FAQ rendering. A long generated operating
phrase was previously repeated in the hero, heading, body and FAQ. Each section
now has a distinct purpose: short introduction, job-record workflow, pilot checks
and buying guidance. Metadata uses a concise summary. No new local office,
installation availability, certification or service promise is introduced.

The source and rendered Chhattisgarh checks guard against reintroducing the long
phrase, repeated focus field and overlong descriptions. The full site audit also
checks emitted lastmod values against the reviewed manifest and verifies that
unknown dates stay omitted.

## Hosting follow-up

On 2026-10-23, the public www host returned a temporary 307 redirect to the
non-www canonical host. There is no domain redirect in this repository's
`next.config.ts` or `vercel.json`. Verify the owning Vercel domain setting and
change that redirect to a permanent 301/308 only after reviewing its scope.
Adding an application-level redirect does not establish that the earlier
hosting-level redirect has changed. No domain setting is changed in this patch.
