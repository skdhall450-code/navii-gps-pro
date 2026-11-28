# Puducherry four-region SEO guide

Prepared 27 November 2026 and published 28 November 2026 through PR #146 (merge/production commit `a9043d2656d1bf83caa4bf64bcf44a16971d6c3a`).

## Purpose and route

- Canonical candidate: `https://naviigps.com/gps-tracker/puducherry`
- Add one substantive Union Territory guide, not four thin region URLs.
- The existing route inventory and sitemap had no Puducherry hub. The state/UT directory now includes Puducherry as a South India Union Territory and links it from the existing national directory.
- Existing city, district and other state/UT URLs remain unchanged.

## Primary geography sources checked 28 November 2026

- Government of Puducherry, About Puducherry: https://www.py.gov.in/about-puducherry
- Government of Puducherry, Districts: https://www.py.gov.in/districts
- Department of Rural Development, District Profile: https://drda.py.gov.in/district-profile (four separate regions; Puducherry's 12 scattered areas; the neighbouring Tamil Nadu, Kerala and Andhra Pradesh district context)
- Local Administration Department, Oulgaret Municipality: https://lad.py.gov.in/node/1501 (supports the Oulgaret municipality entry in the national directory)
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
- The exact review branch remains preview-disabled in `vercel.json`. The user's standing instruction now authorizes routine public SEO merge/publication after all required checks pass; retain the preview guard and merge only after full CI, rendered audit and browser verification. No panel/backend/database/service changes.

## Validation gates

Validation completed:

- [x] Exact PR-head CI [46100185366](https://github.com/skdhall450-code/navii-gps-pro/actions/runs/46100185366) passed source SEO, lint, 147/147 regression tests, customer-app QR verification, production build and full rendered audit of all 2,038 public URLs.
- [x] The dedicated route was prerendered. The audit confirmed metadata, canonical/indexability, schema, internal links and homepage reachability.
- [x] Added hosted browser checks passed at 320px and 390px with JavaScript enabled and disabled: four region sections, four visible/schema FAQ pairs, metadata/canonical, one national-directory link, contact/coverage navigation and no horizontal overflow.
- [x] Main CI [46100692156](https://github.com/skdhall450-code/navii-gps-pro/actions/runs/46100692156) passed on production merge commit. Vercel commit status reported deployment success.
- [x] IndexNow [46101244412](https://github.com/skdhall450-code/navii-gps-pro/actions/runs/46101244412) verified production commit `a9043d2656d1bf83caa4bf64bcf44a16971d6c3a` and accepted 2,038 URLs with HTTP 200.
- [ ] Direct page, robots.txt and sitemap.xml retrieval was unavailable from the web/container tools in this run (the container DNS resolver could not resolve naviigps.com). Therefore no direct page HTTP 200 or Google indexing/ranking claim is made. Deployment status and IndexNow exact-commit/sitemap acknowledgement are separately verified.

## Next backlog

After Puducherry's publication, prepare one missing UT guide at a time: Jammu and Kashmir, Ladakh and Andaman and Nicobar Islands. Assess Lakshadweep only if research supports a substantive vehicle/fleet guide. Continue the existing Bihar, Odisha, West Bengal and Jharkhand quality backlog. Keep northern priority locations active, preserve all established canonical URLs and keep international expansion on hold.
