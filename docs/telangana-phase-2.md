# Telangana Phase 2: priority city and town SEO coverage

Telangana Phase 2 adds two reviewed city or town guides for each of the state's 33 districts, for 66 curated routes in total. The selected place names are checked against the location records in the matching Telangana Phase 1 district guide. District administration and government municipal directories provide the official geographic reference; location selection is limited to the district mapping recorded in the source data.

## Scope

- 66 district-scoped routes under `/gps-tracker/telangana/[district]/[city]`
- Two priority locations for every current Telangana district
- English commercial-intent and Telugu-intent keyword metadata
- Unique route-planning content, FAQs, location Service and breadcrumb schema
- Links between each town pair, its district guide and the Telangana state hub
- Automatic sitemap inclusion and locked inventory/mapping checks
- No claim of a local NAVII GPS office or guaranteed installation availability

These are curated priority locations rather than automatic pages for every locality. Each route profile is an operational planning example and should be adapted to the visitor's actual vehicle, route and installation requirements.

## Automatic validation

`scripts/check-telangana-city-seo.mjs` locks the reviewed 66-route inventory, verifies each location against its district's Phase 1 record and official district administration source, checks unique route content and prevents conflicts with existing flat city pages. After a production build it verifies each page's title, canonical, H1, indexability, sitemap entry, state/district/pair links and Service/FAQ schema.

Run the standard sequence:

```bash
npm run seo:check:source
npm run lint
npm run build
npm run seo:check
```
