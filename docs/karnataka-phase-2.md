# Karnataka Phase 2 — priority city and town SEO coverage

Reviewed: 24 September 2026.

Phase 2 adds two reviewed priority city or town guides inside each of Karnataka's 31 current districts, for 62 district-scoped pages. Selection is limited to localities already mapped to the district in Phase 1 and favours industrial, logistics, agricultural, tourism and institutional operating routes. It is curated coverage, not an automatic page for every locality.

## Reviewed inventory

| District | Priority guides |
| --- | --- |
| Bengaluru Urban | Yelahanka, Anekal |
| Bengaluru Rural | Devanahalli, Doddaballapura |
| Bengaluru South | Channapatna, Kanakapura |
| Kolar | Malur, Bangarapet |
| Chikkaballapura | Gauribidanur, Chintamani |
| Tumakuru | Tiptur, Kunigal |
| Mysuru | Nanjangud, Hunsur |
| Mandya | Maddur, Srirangapatna |
| Chamarajanagar | Kollegal, Gundlupet |
| Hassan | Sakleshpur, Arsikere |
| Kodagu | Kushalnagar, Virajpet |
| Dakshina Kannada | Mangaluru, Puttur |
| Udupi | Kundapura, Karkala |
| Uttara Kannada | Karwar, Sirsi |
| Chikkamagaluru | Kadur, Mudigere |
| Shivamogga | Bhadravati, Sagara |
| Chitradurga | Hiriyur, Challakere |
| Davanagere | Harihar, Channagiri |
| Belagavi | Gokak, Chikkodi |
| Bagalkote | Jamkhandi, Mudhol |
| Vijayapura | Indi, Sindagi |
| Dharwad | Hubballi, Kalghatgi |
| Gadag | Gajendragad, Lakshmeshwar |
| Haveri | Ranebennur, Byadgi |
| Ballari | Siruguppa, Sandur |
| Vijayanagara | Hosapete, Harapanahalli |
| Koppal | Gangavati, Kushtagi |
| Raichur | Sindhanur, Manvi |
| Kalaburagi | Aland, Sedam |
| Bidar | Basavakalyan, Bhalki |
| Yadgir | Shahapur, Shorapur |

District membership and official provenance inherit the Phase 1 district records sourced from the NIC/MeitY [Integrated Government Online Directory](https://igod.gov.in/sg/KA/E042/organizations) and each linked `.nic.in` district portal.

## URL, content and keyword rules

- URLs use `/gps-tracker/karnataka/{district}/{town}` to prevent same-name and flat-route conflicts.
- Every district has exactly two published town guides, one parent-district link and one sibling-town link.
- Every town has a distinct operational workflow, three visible route checks and locally generated metadata.
- Keyword generation includes natural English commercial queries and a Kannada-intent vehicle GPS phrase.
- Pages do not claim a local NAVII GPS office, customer, fixed price, guaranteed coverage or guaranteed ranking.
- Each page includes WebPage, Service, Breadcrumb and FAQ structured data matching visible content.

## Automation and validation

`npm run seo:check:source` locks the 62-route inventory, district mapping, source domains, unique workflows, automatic route wiring and keyword generation. `npm run seo:check` additionally validates every rendered page for canonical, title, one H1, indexability, sitemap inclusion, state/district/sibling links and structured data before the full sitewide audit.

GitHub runs these checks on pull requests and pushes. After successful main-branch validation and production deployment, IndexNow submits the production sitemap. Submission does not guarantee Google indexing or ranking; search performance should be monitored in Google Search Console.
