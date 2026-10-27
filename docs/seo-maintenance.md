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

## Uttar Pradesh town expansion

[Phase 2 batches 1–7](uttar-pradesh-phase-2.md) provide 150 reviewed town guides across all 75 districts, with explicit district mapping sources and authored route-planning content. The automatic route, keyword and sitemap generation is limited to these curated records. The UP town checks run in both source and production audit commands, including independent lookups and district identification for the two reviewed Lalganj towns, plus separate Bilaspur (Rampur) and Bisalpur (Pilibhit) mappings.

## Tamil Nadu district expansion

[Tamil Nadu Phase 1](tamil-nadu-phase-1.md) provides district-level GPS tracking guides for all 38 districts listed by the Government of Tamil Nadu portal. Automatic checks enforce the reviewed inventory, official district-source domains, unique content, local keywords, canonical URLs, Service and FAQ schema, sitemap inclusion and links from the Tamil Nadu state hub. The regional content groups are editorial navigation labels, not claims of an additional administrative tier.

[Tamil Nadu Phase 2](tamil-nadu-phase-2.md) adds 76 reviewed priority city and town guides—two within each of the 38 districts. The exact district-scoped route inventory is locked in the source checker, and every rendered page must remain reachable from the state hub and parent district while linking to its reviewed sibling town. This is curated priority coverage rather than an automatic page for every locality.

## Karnataka district expansion

[Karnataka Phase 1](karnataka-phase-1.md) provides district-level GPS tracking guides for all 31 districts in the current NIC/MeitY directory, including the current Bengaluru South name. Automatic checks enforce the locked inventory, official district-source domains, unique operational content, English and Kannada-intent local keywords, canonical URLs, Service and FAQ schema, sitemap inclusion and state-hub links. Regional content groups are editorial labels, not claims of an extra administrative tier.

[Karnataka Phase 2](karnataka-phase-2.md) adds 62 reviewed priority city and town guides—two within each of the 31 districts. The exact district-scoped inventory is locked in the source checker, and every rendered page must remain reachable from the Karnataka hub and parent district while linking to its reviewed sibling. English and Kannada-intent keywords are generated from curated records rather than publishing every locality automatically.

## Andhra Pradesh district expansion

[Andhra Pradesh Phase 1](andhra-pradesh-phase-1.md) provides district-level GPS tracking guides for all 28 current districts, including Markapuram and Polavaram from the reorganisation effective 31 December 2025. Automatic checks lock the reviewed inventory and enforce official district sources, unique operational content, English and Telugu-intent keywords, canonical URLs, Service and FAQ schema, sitemap inclusion and links from the Andhra Pradesh state hub.

[Andhra Pradesh Phase 2](andhra-pradesh-phase-2.md) adds 56 reviewed priority city and town guides—two within each current district. The exact district-scoped inventory is locked in the source checker, and every rendered page must remain reachable from the state hub and parent district while linking to its reviewed sibling. English and Telugu-intent keywords are generated from curated records.

## Telangana district expansion

[Telangana Phase 1](telangana-phase-1.md) provides district-level GPS tracking guides for all 33 districts listed by the Government of Telangana. Automatic checks lock the reviewed inventory and enforce official district sources, unique operational content, English and Telugu-intent keywords, canonical URLs, Service and FAQ schema, sitemap inclusion and links from the Telangana state hub. Regional content groups are editorial labels, not claims of an extra administrative tier.

[Telangana Phase 2](telangana-phase-2.md) adds 66 curated priority city and town guides—two in every district. The exact district-scoped inventory is locked in the source checker, and each rendered page must link to the Telangana hub, its parent district and its paired town. English and Telugu-intent keywords are generated from these reviewed records.

[Kerala Phase 1](kerala-phase-1.md) provides district-level GPS tracking guides for all 14 Kerala districts. Automatic checks lock the district inventory and validate official sources, unique operational context, English and Malayalam-intent keywords, canonical URLs, structured data, sitemap inclusion and Kerala hub links.

[Kerala Phase 2](kerala-phase-2.md) adds 28 curated priority city and town guides—two in every district. The reviewed inventory is locked in the source checker, and each rendered page must link to the Kerala hub, its parent district and its paired location. English and Malayalam-intent keywords are generated from the reviewed records.

[Maharashtra Phase 1](maharashtra-phase-1.md) provides district-level GPS tracking guides for all 36 current districts. Automated checks validate the current renamed-district inventory, Marathi and English intent keywords, unique route context, canonical URLs, structured data, sitemap inclusion and Maharashtra hub links.

[Maharashtra Phase 2](maharashtra-phase-2.md) adds 72 curated priority city and town guides—two in every district. The exact district-scoped inventory is locked in the source checker, and each rendered page must link to the Maharashtra hub, its parent district and paired location. English and Marathi-intent keywords are generated from reviewed records.

[Gujarat Phase 1](gujarat-phase-1.md) provides district-level GPS tracking guides for all 34 current districts, including the newly formed Vav-Tharad district. Automated checks lock the current inventory and validate the official district source, Gujarati and English intent keywords, unique route context, canonical URLs, structured data, sitemap inclusion and Gujarat hub links.

[Gujarat Phase 2](gujarat-phase-2.md) adds 68 curated priority city and town guides—two in every district. The exact district mapping is checked automatically, and every rendered page must link to the Gujarat hub, its parent district and paired location. English and Gujarati-intent keywords are generated from the reviewed records.

[Rajasthan Phase 1](rajasthan-phase-1.md) provides district-level GPS tracking guides for all 41 current districts. Automated checks lock the reconstituted district inventory and validate the current government source, Hindi and English intent keywords, unique route context, canonical URLs, structured data, sitemap inclusion and Rajasthan hub links.

[Rajasthan Phase 2](rajasthan-phase-2.md) adds 82 curated priority city and town guides—two in every district. The exact district mapping is checked automatically, and every rendered page must link to the Rajasthan hub, its parent district and paired location. English and Hindi-intent keywords are generated from the reviewed records.

[Madhya Pradesh Phase 1](madhya-pradesh-phase-1.md) provides district-level GPS tracking guides for all 55 current districts, including Maihar, Mauganj and Pandhurna. Automated checks lock the current government inventory and validate Hindi and English intent keywords, unique route context, canonical URLs, structured data, sitemap inclusion and Madhya Pradesh hub links.

[Madhya Pradesh Phase 2](madhya-pradesh-phase-2.md) adds 110 curated priority city and town guides—two in every district. The reviewed selection is derived from the locked Phase 1 district inventory, and every rendered page must link to the Madhya Pradesh hub, its parent district and paired location. English and Hindi-intent keywords are generated automatically.

[Chhattisgarh Phase 1](chhattisgarh-phase-1.md) provides district-level GPS tracking guides for all 33 current districts. Automated checks lock the current government inventory and validate Hindi and English intent keywords, unique route context, canonical URLs, structured data, sitemap inclusion and Chhattisgarh hub links.

[Chhattisgarh Phase 2](chhattisgarh-phase-2.md) adds 66 curated priority city and town guides—two in every district. The reviewed selection is derived from the locked Phase 1 district inventory, and every rendered page must link to the Chhattisgarh hub, its parent district and paired location. English and Hindi-intent keywords are generated automatically.

## Daily northern city coverage ledger

Resume this ledger and inspect open PRs before choosing a batch. Publishing a guide does not establish Google indexing. Retain existing canonical URLs and do not create pages that merely swap locality names.

| Priority | Coverage | Next action |
| --- | --- | --- |
| Chandigarh | Existing authored guide at /gps-tracker/chandigarh | Preserve sector, Industrial Area and Manimajra sections; improve only where a substantive gap is found |
| Dera Bassi | 2026-10-25 batch: installation enquiry, dispatch review and Tricity pilot guidance; two additional shared visible/schema FAQs | Live verified 2026-10-25 via PR #70; monitor substantive gaps |
| Mohali | 2026-10-25 batch: staff pickup, service visits and route pilot guidance; two additional shared visible/schema FAQs | Live verified 2026-10-25 via PR #70; monitor substantive gaps |
| Punjab | Existing 104 city/town records plus district hubs | Zirakpur/Kharar live verified via PR #71; Kurali live verified via PR #74; continue substantive gaps |
| Himachal Pradesh | State hub plus dedicated Baddi and Solan guides (PR #76 live verified); Nalagarh/Parwanoo covered as substantive hub sections | Shimla city guide prepared in 2026-10-27 batch; Kangra district/Dharamshala guide prepared; next Punjab/Haryana gap review; district/locality coverage remains partial |
| Haryana | Existing district/city routes | Inventory gaps after priority Punjab/Himachal batches |
| Delhi | Existing district and area routes | Inventory remaining useful locality gaps; retain current canonicals |

### 2026-10-25 batch record

- Existing Dera Bassi URL: /gps-tracker/punjab/sahibzada-ajit-singh-nagar/dera-bassi.
- Existing Mohali URL: /gps-tracker/punjab/sahibzada-ajit-singh-nagar/mohali.
- Added separate authored operational sections, specific descriptions and Chandigarh navigation. No new routes or sitemap entries needed; existing city registry continues to generate both sitemap URLs.
- Geography checked against https://sasnagar.nic.in/administrative-setup/ and https://sasnagar.nic.in/subdivisions-blocks/. Office address supplied by owner; no new local branches or installation guarantees.
- Branch: seo/dera-bassi-mohali-20261025. Required validation: source SEO, lint, build, rendered SEO and existing CI regressions. Consult branch/PR checks for actual results; this record does not pre-claim success.
- No existing open PR covered this city-content batch. Do not merge unrelated panel or sales-journey PRs.

### 2026-10-25 Zirakpur and Kharar batch

- Existing URLs: /gps-tracker/punjab/sahibzada-ajit-singh-nagar/zirakpur and /gps-tracker/punjab/sahibzada-ajit-singh-nagar/kharar. No alternate routes or extra sitemap entries.
- Zirakpur: delivery legs versus through trips, correct stop entrances, shared-driver handovers and two additional FAQs.
- Kharar: repeat service rounds, pickup route changes, return-leg reporting and two additional FAQs.
- Unique descriptions feed page and social metadata; existing component renders the new checklists and shares FAQs with JSON-LD. Existing district, sibling and Chandigarh navigation retained.
- Geographic inventory verified against https://sasnagar.nic.in/public-utility-category/municipality/ (Kharar and Zirakpur listed by the district administration). Operational examples are planning guidance, not local service guarantees.
- Branch: seo/zirakpur-kharar-20261025. Check PR/CI and live deployment before marking this batch published.
- Prior PR #70 verified live with HTTP 200, one H1, self canonical, five matching visible/schema FAQs per page, successful Vercel and main CI 40158459254, IndexNow 40158619794. Google indexing remains unverified.

### 2026-10-25 Kurali batch and Himachal inventory

- Kurali keeps /gps-tracker/punjab/sahibzada-ajit-singh-nagar/kurali. Added collection-round planning, repeated depot visits, full-day pilot checks, tailored description and two additional visible/schema FAQs through the existing shared component.
- Kurali municipality verified at https://sasnagar.nic.in/public-utility-category/municipality/ (district administration). No installation guarantee or new branch claim.
- Branch: seo/kurali-guide-20261025. Required SEO source, lint, regression, build and rendered checks run in CI; verify checks and live deployment before treating this batch as published.
- Prior PR #71 verified live: Zirakpur and Kharar both HTTP 200, self canonical, one H1, five matching visible/schema FAQs and Chandigarh link. Main CI 40166272982 and IndexNow 40166417164 successful.
- Himachal inventory: current repository tree contains app/gps-tracker/himachal-pradesh/page.tsx; live sitemap has /gps-tracker/himachal-pradesh and no URLs containing baddi, solan, shimla or kangra. The existing state guide has useful BBN, Solan/Shimla, Kangra and Mandi/Kullu sections and 12 district notes. These notes are not dedicated district/city pages.
- Next focused batch: research Baddi/Solan geography and existing dynamic-route registries before adding a substantial guide, source checks, sitemap entry and state-hub link. Do not claim full Himachal locality coverage from the state guide.

### 2026-10-25 Baddi and Solan expansion

- New dedicated guides: /gps-tracker/himachal-pradesh/baddi and /gps-tracker/himachal-pradesh/solan. Solan page focuses on town operations rather than claiming district-wide local branches.
- Four distinct workflows and three shared visible/schema FAQs per guide; self-canonical and social metadata, WebPage, Service and Breadcrumb schema.
- Both URLs added to sitemap and linked from Himachal state hub and each other. No alternate Baddi/Solan routes were found in existing city registries.
- Geography sources: https://hpsolan.nic.in/baddi-barotiwala-nalagarh-development-authority/ and https://hpsolan.nic.in/about-district/. No unverified coverage, pricing, cargo-sensor or continuous-reporting guarantees.
- Branch seo/baddi-solan-guides-20261025; consult PR checks/deployment before marking live. Required existing CI covers source SEO, lint, regressions, build, browser checks and the rendered sitemap/link audit.
- Prior Kurali PR #74 verified live with five matching FAQs, HTTP 200, self canonical, one H1, successful main CI 40179504360 and IndexNow 40179695525.
- Next: review Nalagarh/Parwanoo for distinct useful guides and then Shimla; retain district inventory backlog rather than claiming all Himachal localities complete.

### 2026-10-26 Nalagarh / Parwanoo hub improvements

- Kept existing canonical /gps-tracker/himachal-pradesh and its sitemap entry. Added #nalagarh and #parwanoo navigation anchors, not alternate indexable city URLs. Dedicated pages are deferred to avoid overlapping Baddi/Solan intent without sufficient distinct content.
- Nalagarh: multi-premise collections, repeat visits, skipped stops, return-load reconciliation and report acceptance trial. Parwanoo: receiving point, delivery acknowledgement, onward leg and stale-update follow-up.
- Added two FAQs from the same visible/schema source; updated shared description, retained title, self canonical, social metadata, one H1 and State Service schema. Linked each section to its relevant existing Baddi/Solan guide and installation checklist.
- Sources verified 2026-10-26: https://hpsolan.nic.in/public-utility-category/municipality/ ; https://hpsolan.nic.in/baddi-barotiwala-nalagarh-development-authority/ ; https://hpsamb.org/apmc/solan/About . These support geography only; operating checklists are planning advice, not coverage or feature guarantees.
- Prior PR #76: main SEO/build run 40195946158 and IndexNow run 40196306623 succeeded. Baddi/Solan live checks were HTTP 200, self canonical, one H1, three matching FAQs and sitemap/hub links. Submission is not Google indexing evidence.
- Branch seo/nalagarh-parwanoo-hub-20261026. Require source SEO, lint, regression, build, browser and rendered checks plus post-deployment verification. Consult PR status before marking this batch published.
- Next: assess a distinct Shimla guide, then Kangra/Dharamshala; keep Punjab, Haryana and Delhi gap review in backlog. Do not count hub notes as complete district or locality coverage.

### 2026-10-27 Shimla city guide

- New route /gps-tracker/himachal-pradesh/shimla after repository registry and live sitemap inventory found no existing Shimla URL. Scope is city pickups and service visits, not district-wide installation coverage.
- Authored guidance distinguishes vehicle parking/meeting points from final destinations, road-access checks from map routes, passenger boarding from geofence events, and service completion from parked time. Four FAQs share the visible and JSON-LD source.
- Self canonical, title/description and social metadata, WebPage/City Service/Breadcrumb/FAQ schema; Himachal hub inbound link and Solan/Chandigarh/product/software navigation; sitemap entry without invented lastmod.
- Official sources checked 2026-10-27: https://hpshimla.nic.in/history/ and https://hpshimla.nic.in/service/permit/ . No permit eligibility, fees, specific allowed roads, installation guarantees or device performance promised.
- Prior PR #78 main CI 40264701576 and IndexNow 40265101785 succeeded. Himachal live verification on 2026-10-26: HTTP 200, one H1, self canonical, six matching visible/schema FAQs and both local section anchors. IndexNow success is not Google indexing evidence.
- Branch seo/shimla-city-guide-20261027. Require existing source SEO, lint, regression, production build, rendered SEO and browser CI before merge; verify live page, hub and sitemap after deployment. Read PR/deployment state before treating this entry as published.
- Next: assess Kangra/Dharamshala content separation and existing routes, then return to Punjab/Haryana/Delhi locality gaps. Retain Nalagarh/Parwanoo as state-hub sections until separate pages have distinct value.

### 2026-10-27 Kangra district and Dharamshala transfers

- Added /gps-tracker/himachal-pradesh/kangra as a district guide; Dharamshala transfer content is anchored at #dharamshala on this canonical. No separate Dharamshala/airport URL or spelling alias. Registry and live sitemap inventory found neither location already published as a dedicated route.
- Distinct district planning: town versus district destinations, vehicle reassignment by leg, service-round reconciliation and representative pilot. Dharamshala/Gaggal section separates flight status, vehicle waiting, passenger readiness and reassignment. Four shared visible/schema FAQs.
- AdministrativeArea Service schema, WebPage, Breadcrumb, FAQ, self canonical/social metadata, state hub navigation and sitemap entry. No new office, installation guarantee, schedule, distance, price or feature claim.
- Official geography sources checked 2026-10-27: https://hpkangra.nic.in/about-district/ and https://hpkangra.nic.in/how-to-reach/ . Travel page is used only for stable destination geography, not its dated transport timetables.
- Prior Shimla PR #81 is published and live verified; main CI 40443715878 and IndexNow 40444166464 succeeded. Google indexing/ranking remains unverified.
- Branch seo/kangra-dharamshala-20261027. Require full existing source SEO, lint, regression, build, rendered and browser CI, followed by live canonical/H1/FAQ/links/sitemap checks. Consult PR/deployment state before marking this batch published.
- Next: return to priority Punjab/Haryana coverage gaps, starting with existing Panchkula/Kalka/Pinjore guides; preserve URLs and improve distinct local needs. Then review Mandi/Kullu. District guide does not mean every Kangra town/locality is fully covered.

### 2026-10-27 Panchkula, Kalka and Pinjore refresh

- Retained existing /gps-tracker/haryana/panchkula/panchkula, /kalka and /pinjore routes. Registry continues generating the sitemap; no alternate URLs or extra entries.
- Added optional authored guide data only to these three cities and optional rendering in the shared Haryana city component. Three distinct workflow cards and two additional visible/schema FAQs each; targeted titles/descriptions and social previews, existing canonicals/H1/breadcrumbs retained.
- Panchkula: appointments and shared team vehicles. Kalka: onward legs, transfer handovers and return assignments. Pinjore: local delivery versus through traffic, receiving entrances and repeat visits. Added Chandigarh/Himachal navigation while retaining district and sibling links.
- Location inventory source verified 2026-10-27: https://panchkula.nic.in/administrative-setup/ . No new branches, fixed installation coverage, road restrictions, prices or guaranteed device capabilities claimed.
- Prior Kangra PR #82 live verified; main CI 40497835963 and IndexNow 40498459069 successful. Publication/submission does not establish Google indexing.
- Branch seo/panchkula-kalka-pinjore-20261027. Require existing source SEO, lint, regression, production build, rendered SEO and browser checks before merge; live check all three URLs and five FAQ/schema pairs after deployment. Read PR/deployment status before marking published.
- Next: Mandi/Kullu distinct-content assessment, then priority Punjab/Haryana/Delhi gaps. Existing authored Tricity guides remain covered; do not repeat their batches.
