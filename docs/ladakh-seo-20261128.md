# Ladakh eight-district GPS tracking guide

Prepared 28 November 2026 for review on branch `seo/ladakh-eight-district-guide-20261128`, based on the verified Jammu and Kashmir release commit `be4183d8381e25123611a639804a6eeec6980906`.

## Route and scope

- One canonical candidate: `https://naviigps.com/gps-tracker/ladakh`.
- Add Ladakh to the existing North India Union Territory registry; the shared directory and sitemap pipeline derive the new discovery URL from this registry.
- One dedicated page, not eight thin district URLs and no Leh/Kargil spelling aliases.
- District cards identify the eight districts notified by the UT Administration and provide practical vehicle-base, route handover, equipment and reporting checks.
- Preserve existing state/UT, city and five northern priority routes.

## Current administrative sources checked 28 November 2026

- Ladakh Administration, Revenue Department archive: https://ladakh.gov.in/document-category/revenue/ . It lists S.O. 180 (27 April 2026), creating Sham (HQ Khaltse), Nubra (HQ Diskit), Changthang (HQ Nyoma), Zanskar (HQ Padum) and Drass (HQ Drass-Ranbirpura).
- Official Ladakh Gazette S.O. 180, 27 April 2026: https://cdnbbsr.s3waas.gov.in/s395192c98732387165bf8e396c0f2dad2/uploads/2026/04/202604271425803221.pdf . This notification creates the five districts and defines their territorial limits.
- Ladakh Administration, Sankoo district notification summary, 16 October 2026: https://ladakh.gov.in/ladakh-administration-notifies-creation-of-sankoo-as-new-district-of-ut-ladakh/ . Revenue Department S.O. 284 creates Sankoo district, HQ Sankoo, from the Kargil district area and lists Sankoo, GM Pore, TSG and Taisuru tehsils.
- Lieutenant Governor's Secretariat, 27 April 2026: https://lokniwas.ladakh.gov.in/press-details/242 . Confirms the five April districts and that the total rose from two to seven at that stage.
- Ladakh Administration homepage: https://ladakh.gov.in/page/344/ . Its November 2026 announcements refer to district-level administration in Sankoo and Drass, corroborating that the eight-district framework is active.

The page therefore describes eight notified district names: existing Leh and Kargil; Sham, Nubra, Changthang, Zanskar and Drass (April S.O. 180); and Sankoo (October S.O. 284). It does not rely on the earlier 2024 in-principle proposal or incorrectly describe the current total as seven.

## Content and technical scope

- Eight district cards with official headquarters and source-backed origin context.
- Route/base inventory, representative journey test and alert/dispatch handover checklist.
- Four visible FAQs with matching FAQPage schema.
- WebPage, Service/AdministrativeArea and BreadcrumbList schema.
- Unique title/description, self-canonical, Open Graph/Twitter metadata and official source links.
- Links to the existing Jammu and Kashmir, Himachal Pradesh and Punjab guides.
- Qualified copy: no promise of continuous network coverage, road access, installation availability, local NAVII office, device capability, price or customer deployment.

## Validation gates

Run existing source SEO, lint, production build, complete rendered SEO audit and hosted CI on the exact PR head. The added Home browser test must verify all eight district cards and headquarters, four visible/schema FAQs, metadata/canonical, national North India directory discovery, contact/coverage navigation and no horizontal overflow at 320px and 390px with JavaScript enabled and disabled.

Keep the review branch disabled in Vercel deployment settings and retain the matching regression assertion. Do not merge or publish until exact-head checks pass. After separately authorized routine SEO publication, verify the exact production SHA, deployment status, page and sitemap; IndexNow acceptance is not Google indexing or ranking evidence.

## Next backlog

After Ladakh, research Andaman and Nicobar Islands. Assess Lakshadweep only if official sources support a substantive vehicle/fleet guide. Continue Bihar, Odisha, West Bengal and Jharkhand content improvements after the missing-UT sequence. Keep Chandigarh, Dera Bassi, Mohali, Zirakpur and Kharar active.
