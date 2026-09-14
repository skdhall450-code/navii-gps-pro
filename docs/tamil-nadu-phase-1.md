# Tamil Nadu Phase 1 — district-wise SEO coverage

Reviewed: 14 September 2026.

Phase 1 adds district-level GPS tracking guides for all 38 districts listed by the Government of Tamil Nadu district portal. The pages use automatic metadata, district and location keywords, canonical URLs, Service and FAQ schema, sitemap entries and parent-state navigation. This phase does not claim a NAVII GPS branch, customer, fixed installation availability or guaranteed network coverage in any district.

## District inventory source

The district names and current total were checked against the [Government of Tamil Nadu District Portal](https://tndistricts.nic.in/) and the [Integrated Government Online Directory](https://igod.gov.in/sg/TN/E042/organizations). Each record also retains its linked official `.nic.in` district portal for provenance.

| Group | Districts |
| --- | --- |
| Chennai and North Coast | Chennai, Chengalpattu, Kancheepuram, Tiruvallur, Ranipet, Vellore, Tirupathur, Tiruvannamalai, Viluppuram, Kallakurichi, Cuddalore |
| Western Tamil Nadu | Coimbatore, Tiruppur, Erode, Salem, Namakkal, Dharmapuri, Krishnagiri, Nilgiris |
| Central Tamil Nadu | Tiruchirappalli, Karur, Perambalur, Ariyalur, Dindigul, Pudukkottai |
| Cauvery Delta and East Coast | Thanjavur, Tiruvarur, Nagapattinam, Mayiladuthurai |
| Southern Tamil Nadu | Madurai, Theni, Sivaganga, Ramanathapuram, Virudhunagar, Thoothukudi, Tirunelveli, Tenkasi, Kanniyakumari |

The groups above organize page content and are not presented as an additional tier of government administration. Official district spellings such as Kancheepuram, Kanniyakumari, Tirupathur, Tiruvarur and Viluppuram are retained. Location labels on each guide support route-planning discovery and do not create separate city URLs in Phase 1.

## Content and keyword rules

- Every district has a distinct operational route profile and four relevant location labels.
- Titles and primary keywords contain both the district name and Tamil Nadu.
- Broader device keywords are generated from the page's fleet sectors and deduplicated case-insensitively.
- Content avoids invented offices, prices, customer claims, network guarantees and unsupported certifications.
- District URLs use `/gps-tracker/tamil-nadu/{district}` and link back to the Tamil Nadu state hub.

## Automation and validation

`npm run seo:check:source` verifies the 38-district inventory, official source domains, unique names, slugs, content and route wiring. `npm run seo:check` additionally checks every rendered page for its canonical, single H1, indexability, metadata, Service and FAQ schema, sitemap entry and state-hub link before the sitewide audit.

The existing GitHub workflow runs these checks on pushes and pull requests. After a successful main-branch production deployment, the IndexNow workflow submits the production sitemap. Submission is not proof of Google indexing or ranking; impressions, clicks and queries must be measured separately in Google Search Console.

Phase 2 should add only reviewed town/city pages selected from actual enquiries and Search Console demand, with a district-scoped route to avoid same-name conflicts.
