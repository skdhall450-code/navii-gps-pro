# SEO maintenance and keyword targeting

The public website uses existing product/service pages and location guides. Content should help a visitor choose hardware, understand installation requirements, or plan fleet operations. New location coverage needs accurate geography and useful local detail.

## Keyword ownership

| Search intent | Main guide |
| --- | --- |
| Car GPS tracker | `/gps-tracker-for-car` |
| Truck GPS tracking | `/truck-gps` |
| School bus GPS tracking | `/school-bus-gps` |
| Fuel monitoring system | `/fuel-monitoring-system` |
| Commercial vehicle tracking | `/commercial-vehicle-tracking` |
| 4G GPS tracker | `/4g-gps-tracker` |
| Fleet management software | `/software` |

`lib/seo/trackingSolutions.ts` selects relevant service guides from the operating sectors already recorded for a location. The same definitions supply local metadata keywords and visible links with device-selection guidance. Keyword arrays are trimmed and deduplicated case-insensitively. Existing useful aliases are retained.

Google does not use the meta-keywords tag for ranking. Use descriptive titles, useful headings and natural visible text; do not repeat phrases to meet a keyword-density target. Source: [Google supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags).

## Metadata rules

- Let the root title template append `NAVII GPS INDIA` once. Use an absolute title only when a page deliberately owns its full title.
- Each public page needs its own canonical and Open Graph URL, matching its sitemap URL.
- Shared layout social metadata defines image/card defaults. Page titles and descriptions flow to social previews rather than inheriting homepage text.
- Page-specific structured data must describe the visible page. Do not invent prices, review ratings, certifications, local offices or deployment guarantees.

## Automatic checks

Run `npm run seo:check:source`, `npm run lint`, `npm run build`, then `npm run seo:check`.

The final command includes `npm run seo:audit`, which reads the built sitemap and checks every listed public page for:

- Unique titles/descriptions, a single title brand and one H1.
- Self-canonical URLs, indexing directives and correct social previews.
- Valid JSON-LD and matching page/service schemas.
- Duplicate keyword entries, broken internal links and reachability from the homepage.

Every push and pull request runs the existing SEO and Build Quality workflow. It uploads `seo-audit.json` and `seo-audit.md` as a commit-specific GitHub Actions artifact retained for 30 days. The JSON inventory lists titles, descriptions, keywords, schemas and internal links for each public URL. Inspect findings before publishing further coverage.

The existing IndexNow workflow runs after successful main-branch validation, checks the production commit, and submits the production sitemap. Acceptance by IndexNow is a submission acknowledgement, not evidence of Google indexing or ranking. Measure Google impressions, clicks, queries and indexing separately in a verified Search Console property; no such performance data was supplied for this change.

## September 2026 correction baseline

The audit covered 851 public sitemap URLs. It found 452 repeated-brand titles, 11 missing canonicals and 705 inherited homepage social titles. Full link-graph validation also found 356 pages unreachable from the homepage. Corrections add entry links for the Delhi and international hubs, city links on standalone Northeast state pages, and a link between the two school-bus guides. No new location routes are introduced by this maintenance change.
