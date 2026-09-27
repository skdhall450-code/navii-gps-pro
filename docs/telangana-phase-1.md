# Telangana Phase 1: district SEO coverage

Telangana Phase 1 adds one reviewed GPS tracking guide for each of the state's 33 current districts. The district inventory follows the Government of Telangana district directory and official district administration sites.

## Scope

- 33 district routes under `/gps-tracker/telangana/[district]`
- English commercial-intent and Telugu-intent metadata keywords
- Four reviewed city/town labels and unique operating context per district
- Self-canonical metadata, social metadata, Service, FAQ and breadcrumb schema
- Links from the Telangana state hub and automatic sitemap entries
- No claim of a local NAVII GPS office or guaranteed installation availability

The five regional groups in the data file are editorial navigation and content-planning labels. They do not represent an additional government administrative tier.

## Automatic validation

`scripts/check-telangana-seo.mjs` locks the 33-district inventory and verifies official Telangana government sources, unique district content, route generation, local keyword generation, state-hub links and sitemap wiring. After a production build it also checks every rendered district page for its title, canonical, H1, indexability, visible location keyword, parent link, sitemap entry, Service schema and FAQ schema.

Run the standard sequence:

```bash
npm run seo:check:source
npm run lint
npm run build
npm run seo:check
```
