# International restart — 10 October 2026

This restart follows the user's request to complete the international backlog.
It adds Africa Batch 8: South Africa, Egypt, Kenya, Nigeria, Morocco and Ghana,
with five city guides per country. The catalog now contains 51 countries and
255 cities. Four industry guides cover freight/port logistics, delivery/service
fleets, staff/passenger transport and rental/tourism vehicles.

Country and city guides link to existing product/use-case pages and the industry
hub. The India hub provides an entry to the international country hub. All guides
remain deployment-planning content: they do not claim local branches, guaranteed
network coverage, device certifications or confirmed installation availability.

## Indexing control

`lib/seo/internationalStatus.ts` is the shared code switch for robots and sitemap
membership. It is enabled for this approved restart. The README's obsolete
`INTERNATIONAL_SEO_ENABLED` environment-variable instruction was removed.
Changing the code switch requires a rebuild. Country, city, international hub
and industry routes must follow the same setting.

## Geographic references

The new local route profiles are editorial planning examples. Port and regional
context was checked against these primary sources; specific installation and
mobile-network arrangements must still be confirmed per deployment.

- South Africa: https://www.transnetnationalportsauthority.net/ContactUs/Pages/Ports-Contact-Details.aspx
- Egypt: https://www.suezcanal.gov.eg/
- Kenya: https://www.kpa.co.ke/About and https://magicalkenya.com/city/
- Nigeria: https://nigerianports.gov.ng/ and https://nigerianports.gov.ng/wp-content/uploads/2024/07/NPA-HANDBOOK.pdf
- Morocco: https://www.tangermed.ma/en/ and https://www.visitmorocco.com/en/travel-info/brochures
- Ghana: https://ghanaports.gov.gh/ and https://visitghana.com/

## Release checks and follow-up

Run source checks, lint, production build and the full rendered SEO audit before
merging. Verify unique sitemap URLs, metadata, canonical URLs, route ownership,
structured data, links and homepage reachability. Verify the country/city FAQ
text agrees with the schema and each new country links to its five city guides.

After merge and the production deployment:

1. Verify `/deployment-version` matches the merge commit.
2. Check international robots, canonical URLs and the live sitemap.
3. Submit the live sitemap URLs with the existing IndexNow script; record the
   actual response rather than treating submission as proof of indexing.
4. In Search Console for `https://naviigps.com/`, confirm sitemap processing and
   inspect representative international URLs. Record any request quota or access
   limitation. Review indexing and search performance only from fresh reports.

Google indexing and ranking confirmation are post-release observations. No
ranking results, Search Console submission or IndexNow acceptance are claimed by
this code change, and no recurring automation is enabled.
