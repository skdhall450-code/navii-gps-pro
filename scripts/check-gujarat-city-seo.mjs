import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const citySource = readFileSync("lib/seo/gujaratCities.ts", "utf8");
const citySeeds = citySource.split("\n")
  .filter((line) => /^\s{2}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtSource = readFileSync("lib/seo/gujaratDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtMap = new Map(districtSeeds.map(([slug, name, cities]) => [slug, { name, cities }]));

assert.equal(citySeeds.length, 68, "Expected 68 reviewed Gujarat city and town records");
assert.equal(districtMap.size, 34, "Expected all 34 current Gujarat districts");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 68, "Duplicate Gujarat town route");
assert.equal(new Set(citySeeds.map(([, , , focus]) => focus)).size, 68, "Repeated Gujarat town focus");

for (const [districtSlug, slug, name, focus] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Gujarat district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Gujarat town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would duplicate its district: ${districtSlug}/${slug}`);
  assert.equal(slug, name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), `Town slug must match name: ${districtSlug}/${slug}`);
  assert.ok(focus.length > 70, `Town focus is too short: ${districtSlug}/${slug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}
for (const districtSlug of districtMap.keys()) assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/GujaratCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/GujaratDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("gujaratCities.map"), "Gujarat town static params are missing");
assert.ok(routeSource.includes("generateGujaratCityMetadata"), "Gujarat town metadata wiring is missing");
assert.ok(routeSource.includes("GujaratCityGpsPage"), "Gujarat town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Gujarat district-to-town links are missing");
assert.ok(hubSource.includes("gujaratCities.map"), "Gujarat state-to-town links are missing");
assert.ok(sitemapSource.includes("gujaratCityRoutes"), "Gujarat town sitemap routes are missing");
assert.ok(citySource.includes("વાહન GPS ટ્રેકર"), "Gujarati-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Gujarat town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Gujarat town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 68 reviewed Gujarat cities and towns across all 34 districts; mappings, Gujarati keywords, unique workflows and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/gujarat.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  const route = `/gps-tracker/gujarat/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Gujarat town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Gujarat town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${district.name} | NAVII GPS INDIA</title>`), `Invalid Gujarat town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Gujarat town H1: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Gujarat town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Gujarat town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Gujarat town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/gujarat/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Gujarat town orphaned from district: ${route}`);
  const siblings = citySeeds.filter(([entryDistrict, entrySlug]) => entryDistrict === districtSlug && entrySlug !== slug);
  assert.ok(html.includes(`href="/gps-tracker/gujarat/${districtSlug}/${siblings[0][1]}"`), `Gujarat town missing paired-town link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Gujarat town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Gujarat town FAQ schema: ${route}`);
}

console.log("PASS: 68 rendered Gujarat city and town pages; canonical, schema, sitemap, state, district and paired-town links verified.");

