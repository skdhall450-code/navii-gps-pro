# Puducherry four-region SEO guide

Prepared 27 November 2026 for review on branch `seo/puducherry-four-region-guide-20261127`.

## Purpose and route

- Canonical candidate: `https://naviigps.com/gps-tracker/puducherry`
- Add one substantive Union Territory guide, not four thin region URLs.
- The existing route inventory and sitemap had no Puducherry hub. The state/UT directory now includes Puducherry as a South India Union Territory and links it from the existing national directory.
- Existing city, district and other state/UT URLs remain unchanged.

## Primary geography sources checked 27 November 2026

- Government of Puducherry, About Puducherry: https://www.py.gov.in/about-puducherry
- Government of Puducherry, Districts: https://www.py.gov.in/districts
- Government of Puducherry, Rural Development / four-region administrative overview: https://py.gov.in/rural-development
- Directorate of Economics and Statistics, Season and Crop Report 2024–25: https://statistics.py.gov.in/sites/default/files/season-and-crop-report-2024-25.pdf

These sources describe four geographically separate regions: Puducherry, Karaikal, Mahe and Yanam. The page distinguishes the actual vehicle operating base from its route destinations and explains separate dispatch, connectivity and handover checks. It does not invent local installation offices, availability, customer examples, coverage guarantees, prices or current network performance.

## Content and technical scope

- Four region-specific planning sections with geographically grounded context.
- Three-step multi-region rollout checklist.
- Four visible FAQs with matching FAQPage structured data.
- WebPage, AdministrativeArea Service and BreadcrumbList schema.
- Unique title/description, canonical, Open Graph and Twitter metadata.
- Automatic sitemap inclusion through the existing state registry and sitemap pipeline.
- Dedicated route is excluded from the generic dynamic state route by the existing dedicated-route discovery logic.
- Exact review branch is disabled in `vercel.json`; do not deploy or merge this branch merely because CI passes.

## Validation gates

Run the repository's existing `npm run seo:check:source`, `npm run lint`, `npm run build` and `npm run seo:check` workflow. Hosted CI must pass on the exact PR head. Inspect the rendered audit for the new canonical, title, description, one H1, self-canonical, indexability, Open Graph/Twitter metadata, WebPage/Service schema, all internal links and unique page metadata. Verify the built sitemap includes exactly one Puducherry URL and the dedicated route owns its prerendered page.

After any separately authorized publication, verify the exact production deployment SHA and live URL, then check the national directory, robots, sitemap and the new page's visible/schema FAQ parity. IndexNow acceptance is submission acknowledgement only; Google indexing and rankings remain unverified.

## Next backlog

After Puducherry, prepare one missing UT guide at a time: Jammu and Kashmir, Ladakh, Andaman and Nicobar Islands, then Lakshadweep only if research supports a substantive vehicle/fleet guide. Continue the existing Bihar, Odisha, West Bengal and Jharkhand quality backlog. Keep northern priority locations active and preserve all established canonical URLs.
