# Andhra Pradesh Phase 2: priority city and town SEO coverage

## Scope

Phase 2 publishes 56 reviewed city and town guides: two district-scoped locations within each of the 28 current Andhra Pradesh districts.

Routes follow this pattern:

`/gps-tracker/andhra-pradesh/{district-slug}/{city-slug}`

## Publishing rules

- The exact inventory is curated and locked by the checker; the site does not generate pages for every locality automatically.
- Each record maps to a location already reviewed in its parent Phase 1 district inventory.
- A city slug cannot equal its district slug, preventing collisions between district and city routes.
- Each guide has an authored operational focus plus generated route checks, nearby locations and relevant fleet sectors.
- Content supports vehicle and route planning without claiming a local office, installation availability or guaranteed connectivity.

## Automatic SEO and links

Every city or town page receives:

- A unique title, description, canonical URL and social metadata.
- English and Telugu-intent keywords generated from the reviewed city, district and fleet sectors.
- WebPage, Service, Place, FAQPage and BreadcrumbList structured data.
- State-hub, parent-district and reviewed sibling links.
- A sitemap entry.

## Validation

`scripts/check-andhra-pradesh-city-seo.mjs` validates the locked 56-route inventory, all 28 parent districts, unique workflows, official sources, Telugu-intent keywords, routing and link wiring.

After a production build it verifies every rendered page, canonical, H1, schema, sitemap entry and state/district/sibling link.
