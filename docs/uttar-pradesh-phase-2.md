# Uttar Pradesh Phase 2 — priority towns, batch 1

Reviewed: 13 September 2026.

This release adds 24 curated town guides across 12 of the existing 75 districts. It does not claim complete city coverage of Uttar Pradesh. Selection balances NCR-adjacent, western, central and eastern UP operating areas. Search Console query volume was not available; this is an editorial priority batch, not a measured ranking of demand.

## District mapping references

District membership was checked against the following administration pages. These references establish location names and membership, not NAVII GPS office locations, installation availability or endorsements. The fleet scenarios are authored planning examples, not claims about a specific customer's operation.

| District | Towns | Mapping source |
| --- | --- | --- |
| Gautam Buddha Nagar | Dadri, Jewar | [District administration](https://gbnagar.nic.in/tehsil/) |
| Firozabad | Shikohabad, Tundla | [District administration](https://firozabad.nic.in/tehsil/) |
| Lucknow | Mohanlalganj, Malihabad | [District administration](https://lucknow.nic.in/tehsil%E2%80%8C-name/) |
| Kanpur Nagar | Bilhaur, Ghatampur | [District administration](https://kanpurnagar.nic.in/tehsil/) |
| Agra | Etmadpur, Fatehabad | [District administration](https://agra.nic.in/tehsil/) |
| Mathura | Vrindavan, Kosi Kalan | [District administration](https://mathura.nic.in/municipal-corporation/) |
| Meerut | Sardhana, Mawana | [District administration](https://meerut.nic.in/tehsil-level/) |
| Bulandshahr | Khurja, Sikandrabad | [District administration](https://bulandshahar.nic.in/tehsil/) |
| Saharanpur | Deoband, Nakur | [District administration](https://saharanpur.nic.in/tehsil/) |
| Gorakhpur | Sahjanwa, Chauri Chaura | [District administration](https://gorakhpur.nic.in/tehsil/) |
| Varanasi | Pindra, Rajatalab | [District administration](https://varanasi.nic.in/tehsil/) |
| Prayagraj | Phulpur, Soraon | [District administration](https://prayagraj.nic.in/tehsil/) |

## Content and keyword rules

- Each town has an authored operating scenario, three specific route checks, a relevant set of vehicle guides and visible FAQs matching the JSON-LD.
- Titles and keywords include the district to distinguish names such as Fatehabad (Agra) and Phulpur (Prayagraj).
- Only reviewed records in `lib/seo/uttarPradeshCitySeeds.json` produce pages. Do not automatically turn every district location label into a new URL.
- New URLs use `/gps-tracker/uttar-pradesh/{district}/{town}`. Existing standalone city URLs are preserved; checks prevent introducing another page for the same UP city.
- No local branch, fixed price, guaranteed connectivity or certification is implied. Device, installation and subscription arrangements are confirmed for each enquiry.

## Automation and validation

The curated data supplies static routes, canonical URLs, social metadata, relevant keywords, sitemap entries, state links and district links. New routes are included by the existing production-sitemap IndexNow workflow. Google ranking and indexing are measured separately.

`npm run seo:check:source` checks membership, unique URLs/content, actual district-scoped lookup functions and metadata. `npm run seo:check` also checks all rendered town pages, state/district navigation, source-visible content and matching FAQ and Service schemas, then runs the sitewide audit. GitHub CI includes both checks through the existing package scripts.

Before the next batch, review actual enquiries and Search Console queries where available, verify each new district mapping, author a useful local workflow and update the reviewed inventory in the checker. The remaining 63 districts currently retain their district-level guides without a dedicated Phase 2 town batch.
