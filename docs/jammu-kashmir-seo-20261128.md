# Jammu and Kashmir two-division GPS tracking guide

Prepared 28 November 2026. Candidate branch: `seo/jammu-kashmir-ut-guide-20261128`, based on main `ed31adf853b029712180a7f31d458bcc0ce82f54`.

## Purpose and route

- One canonical route candidate: `https://naviigps.com/gps-tracker/jammu-and-kashmir`.
- Add Jammu and Kashmir to the existing North India Union Territory registry.
- Do not create separate Jammu or Kashmir spelling aliases, district pages or thin locality routes.
- The dedicated route is discovered by the existing dynamic state-route guard and excluded from the generic state page; the sitemap and national directory consume the shared `indiaStates` registry.

## Administrative geography checked 28 November 2026

Current official directory sources:

- J&K General Administration Department, Useful Links / Districts: https://jkgad.nic.in/En/Useful_Links.aspx (lists the 20 district portals).
- Government of Jammu and Kashmir District Portal: https://jammukashmir.s3waas.gov.in/ (20 official district links and both Divisional Commissioner links).
- Divisional Commissioner Jammu: https://divcomjammu.gov.in/ (describes the ten districts of Jammu Division).
- Divisional Commissioner Kashmir: https://divcomkashmir.jk.gov.in/ (lists Anantnag, Bandipore, Baramulla, Budgam, Ganderbal, Kulgam, Kupwara, Pulwama, Shopian and Srinagar).
- J&K CAMPA geographical profile, printed pages 6–7: https://www.campa.jk.gov.in/home/viewfile/report_pdfJK_Campa3431710156930.pdf (explicitly describes two administrative divisions with ten districts each and the division-wise district grouping).

The division-wise grouping is cross-checked against the current GAD/district portal spellings. The older CAMPA report is used only to corroborate the administrative split, not as evidence of current roads, climate, access, installation or mobile-network performance.

### Jammu Division

Kathua, Jammu, Samba, Udhampur, Reasi, Rajouri, Poonch, Doda, Ramban and Kishtwar.

### Kashmir Division

Anantnag, Kulgam, Pulwama, Shopian, Budgam, Srinagar, Ganderbal, Bandipore, Baramulla and Kupwara.

## Content and technical scope

- Two division cards with all 20 districts, with no additional route pages.
- Practical fleet planning for actual vehicle base, route legs, dispatcher ownership, device/SIM verification and stale-update follow-up.
- Four visible FAQs with matching FAQPage JSON-LD.
- WebPage, AdministrativeArea Service and BreadcrumbList schema.
- Unique title/description, canonical, Open Graph and Twitter metadata.
- National directory discovery through the shared registry; sitemap inclusion through the existing `app/sitemap.ts` pipeline.
- Internal links to contact, India coverage, and existing Punjab, Himachal Pradesh and Chandigarh guides.
- No local NAVII office, fitting availability, continuous network coverage, device specification, price, customer example or guarantee claim.

## Validation gates

- [ ] Exact PR-head source SEO and lint checks.
- [ ] Full regression suite, including the Vercel preview-disabled branch guard.
- [ ] Customer-app QR verification and production build.
- [ ] Full rendered SEO audit of every sitemap URL; confirm one canonical and one sitemap entry for the new route, unique metadata, one H1, visible/schema FAQ parity and internal homepage reachability.
- [ ] Hosted browser coverage at 320px and 390px with JavaScript enabled and disabled: both divisions, all 20 districts, four FAQ pairs, metadata/canonical, national-directory discovery, contact links and no horizontal overflow.
- [ ] Main CI and exact production deployment commit verification.
- [ ] Live page, robots, sitemap and representative northern route checks; distinguish web/cache/network failures from site outages.
- [ ] IndexNow acknowledgement for the exact production commit, if the existing workflow accepts it. This is not Google indexing or ranking evidence.

No tracking panel/backend, database, service, device, DNS or domain changes are in scope. International expansion remains on hold.
