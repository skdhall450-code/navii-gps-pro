# Andhra Pradesh Phase 1: district SEO coverage

## Scope

Phase 1 publishes one district-scoped GPS tracking guide for each of the 28 current Andhra Pradesh districts. The inventory reflects the reorganisation effective 31 December 2025, including Markapuram and Polavaram.

Routes follow this pattern:

`/gps-tracker/andhra-pradesh/{district-slug}`

## Coverage rules

- Every district record has a unique operating profile, four relevant district locations and an official Andhra Pradesh district-administration source.
- The content describes route-planning and fleet use cases without claiming a local NAVII GPS office, installation availability, certifications or guaranteed network coverage.
- Regional group names are editorial navigation labels, not additional administrative divisions.
- District pages link to the Andhra Pradesh state hub, products, contact and relevant fleet solution guides.

## Automatic SEO

Each district page receives:

- A unique title, description, canonical URL and social metadata.
- English and Telugu-intent keyword generation plus location and sector terms.
- WebPage, Service, FAQPage and BreadcrumbList structured data.
- A sitemap entry and a visible link from the Andhra Pradesh state hub.

The Andhra Pradesh hub identifies all 28 current districts and adds Telugu-intent state keyword coverage.

## Validation

`scripts/check-andhra-pradesh-seo.mjs` locks the reviewed 28-district inventory and checks official source domains, unique route profiles, automatic route/metadata wiring, Telugu-intent keywords, schema and sitemap wiring.

After a production build it also validates every rendered district page, including titles, H1s, canonicals, indexing status, sitemap presence, hub links and JSON-LD.

Run:

```bash
npm run seo:check:source
npm run lint
npm run build
npm run seo:check
```
