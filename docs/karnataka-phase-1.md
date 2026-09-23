# Karnataka Phase 1 — district-wise SEO coverage

Reviewed: 20 September 2026.

Phase 1 adds district-level GPS tracking guides for all 31 districts listed for Karnataka by the Integrated Government Online Directory. Pages use automatic metadata, English and Kannada-intent district keywords, local location keywords, canonical URLs, Service and FAQ schema, sitemap entries and parent-state navigation. This phase does not claim a NAVII GPS office, customer, fixed installation availability or guaranteed network coverage in any district.

## District inventory source

The district names and current total were checked against the [Integrated Government Online Directory](https://igod.gov.in/sg/KA/E042/organizations), maintained by the National Informatics Centre under the Ministry of Electronics and Information Technology. Each record retains its linked official `.nic.in` district portal for provenance.

| Editorial group | Districts |
| --- | --- |
| Bengaluru and South Interior | Bengaluru Urban, Bengaluru Rural, Bengaluru South, Kolar, Chikkaballapura, Tumakuru, Mysuru, Mandya, Chamarajanagar, Hassan, Kodagu |
| Coastal and Malnad Karnataka | Dakshina Kannada, Udupi, Uttara Kannada, Chikkamagaluru, Shivamogga |
| Central Karnataka | Chitradurga, Davanagere |
| Northwest Karnataka | Belagavi, Bagalkote, Vijayapura, Dharwad, Gadag, Haveri |
| Northeast Karnataka | Ballari, Vijayanagara, Koppal, Raichur, Kalaburagi, Bidar, Yadgir |

These groups organize editorial content and are not presented as another level of government administration. Current official spellings—including Bagalkote, Bengaluru South, Kalaburagi, Mysuru, Shivamogga, Tumakuru and Vijayanagara—are retained. Location labels support route-planning discovery and do not create separate city URLs in Phase 1.

## Content and keyword rules

- Every district has a distinct operational route profile and four relevant location labels.
- Titles and primary keywords include the district name and Karnataka.
- One Kannada-intent vehicle GPS phrase is generated for each district alongside natural English commercial keywords.
- Broader device keywords are generated from the district's fleet sectors and deduplicated case-insensitively.
- Content avoids invented offices, prices, customer claims, network guarantees and unsupported certifications.
- District URLs use `/gps-tracker/karnataka/{district}` and link back to the Karnataka state hub.

## Automation and validation

`npm run seo:check:source` verifies the locked 31-district inventory, official source domains, unique names, slugs, content, keyword generation and route wiring. `npm run seo:check` additionally checks every rendered page for its canonical, single H1, indexability, metadata, Service and FAQ schema, sitemap entry and state-hub link before the sitewide audit.

The GitHub workflow runs these checks on pushes and pull requests. After successful main-branch validation and production deployment, the IndexNow workflow submits the production sitemap. Submission does not guarantee Google indexing or ranking; impressions, clicks and queries should be measured in Google Search Console.

Phase 2 should add only reviewed priority city/town pages with district-scoped URLs, unique operational content and explicit parent-district mappings.
