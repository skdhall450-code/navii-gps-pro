# Tamil Nadu Phase 2 — priority city and town SEO coverage

Reviewed: 19 September 2026.

Phase 2 adds 76 reviewed city and town guides: two district-scoped pages for each of Tamil Nadu's 38 districts. The district baseline was rechecked against the National Informatics Centre's [Integrated Government Online Directory](https://igod.gov.in/sg/TN/E042/organizations), which lists 38 current Tamil Nadu districts, and the Phase 1 official district portals.

These are editorial priority pages, not a claim that every Tamil Nadu locality is covered. Search Console query volume was not available for this release. Selection uses locations already mapped in the reviewed Phase 1 district dataset, avoids a nested duplicate of the district name and rejects an existing standalone page with the same slug.

| District | Priority locations |
| --- | --- |
| Chennai | Ambattur, Sholinganallur |
| Chengalpattu | Tambaram, Madurantakam |
| Kancheepuram | Sriperumbudur, Uthiramerur |
| Tiruvallur | Avadi, Gummidipoondi |
| Ranipet | Arcot, Arakkonam |
| Vellore | Gudiyatham, Katpadi |
| Tirupathur | Vaniyambadi, Ambur |
| Tiruvannamalai | Arani, Cheyyar |
| Viluppuram | Tindivanam, Gingee |
| Kallakurichi | Ulundurpet, Tirukoilur |
| Cuddalore | Neyveli, Chidambaram |
| Coimbatore | Pollachi, Mettupalayam |
| Tiruppur | Udumalaipettai, Avinashi |
| Erode | Perundurai, Bhavani |
| Salem | Mettur, Attur |
| Namakkal | Tiruchengode, Rasipuram |
| Dharmapuri | Harur, Palacode |
| Krishnagiri | Hosur, Denkanikottai |
| Nilgiris | Udhagamandalam, Coonoor |
| Tiruchirappalli | Srirangam, Manapparai |
| Karur | Kulithalai, Aravakurichi |
| Perambalur | Kunnam, Alathur |
| Ariyalur | Jayankondam, Udayarpalayam |
| Dindigul | Palani, Oddanchatram |
| Pudukkottai | Aranthangi, Alangudi |
| Thanjavur | Kumbakonam, Pattukkottai |
| Tiruvarur | Mannargudi, Thiruthuraipoondi |
| Nagapattinam | Vedaranyam, Kilvelur |
| Mayiladuthurai | Sirkazhi, Tharangambadi |
| Madurai | Melur, Thirumangalam |
| Theni | Periyakulam, Cumbum |
| Sivaganga | Karaikudi, Devakottai |
| Ramanathapuram | Rameswaram, Paramakudi |
| Virudhunagar | Sivakasi, Rajapalayam |
| Thoothukudi | Kovilpatti, Tiruchendur |
| Tirunelveli | Ambasamudram, Nanguneri |
| Tenkasi | Sankarankovil, Kadayanallur |
| Kanniyakumari | Nagercoil, Marthandam |

## Content and URL rules

- Routes use `/gps-tracker/tamil-nadu/{district}/{town}` so the parent district remains explicit.
- Every town has a unique operational focus, visible planning context and three pre-trip checks.
- Metadata includes the town and district; generated keywords are trimmed and deduplicated.
- Each page links to its parent district, reviewed sibling town, Tamil Nadu hub and relevant solution guides.
- Visible FAQs match the FAQ schema. Service schema identifies the town as a Place within its district and Tamil Nadu.
- Official district links establish geographic provenance. They do not imply endorsement, a NAVII GPS office or guaranteed installation availability.

## Automation and validation

`npm run seo:check:source` locks the exact 76-route inventory, verifies two towns in every district, confirms Phase 1 membership, rejects duplicate routes and workflows, checks official source domains and prevents collisions with standalone static city pages.

`npm run seo:check` additionally verifies every rendered page's canonical URL, title, single H1, indexability, sitemap entry, state/district/sibling links and Service/FAQ schema, followed by the whole-site metadata and link-graph audit.

Successful production validation triggers the existing IndexNow sitemap submission. IndexNow acceptance is not proof of Google indexing or ranking; measure those outcomes separately through Google Search Console.
