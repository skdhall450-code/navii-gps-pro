import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const citySource = readFileSync("lib/seo/rajasthanCities.ts", "utf8");
const citySeeds = citySource.split("\n")
  .filter((line) => /^\s{2}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtSource = readFileSync("lib/seo/rajasthanDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtMap = new Map(districtSeeds.map(([slug, name, cities]) => [slug, { name, cities }]));

assert.equal(citySeeds.length, 82, "Expected 82 reviewed Rajasthan city and town records");
assert.equal(districtMap.size, 41, "Expected all 41 current Rajasthan districts");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 82, "Duplicate Rajasthan town route");
assert.equal(new Set(citySeeds.map(([, , , focus]) => focus)).size, 82, "Repeated Rajasthan town focus");

for (const [districtSlug, slug, name, focus] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Rajasthan district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Rajasthan town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would duplicate its district: ${districtSlug}/${slug}`);
  assert.equal(slug, name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), `Town slug must match name: ${districtSlug}/${slug}`);
  assert.ok(focus.length > 70, `Town focus is too short: ${districtSlug}/${slug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}
for (const districtSlug of districtMap.keys()) assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/RajasthanCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/RajasthanDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("rajasthanCities.map"), "Rajasthan town static params are missing");
assert.ok(routeSource.includes("generateRajasthanCityMetadata"), "Rajasthan town metadata wiring is missing");
assert.ok(routeSource.includes("RajasthanCityGpsPage"), "Rajasthan town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Rajasthan district-to-town links are missing");
assert.ok(hubSource.includes("rajasthanCities.map"), "Rajasthan state-to-town links are missing");
assert.ok(sitemapSource.includes("rajasthanCityRoutes"), "Rajasthan town sitemap routes are missing");
assert.ok(citySource.includes("वाहन GPS ट्रैकर"), "Hindi-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Rajasthan town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Rajasthan town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 82 reviewed Rajasthan cities and towns across all 41 districts; mappings, Hindi keywords, unique workflows and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/rajasthan.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  const route = `/gps-tracker/rajasthan/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Rajasthan town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Rajasthan town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${district.name} | NAVII GPS INDIA</title>`), `Invalid Rajasthan town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Rajasthan town H1: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Rajasthan town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Rajasthan town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Rajasthan town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/rajasthan/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Rajasthan town orphaned from district: ${route}`);
  const sibling = citySeeds.find(([entryDistrict, entrySlug]) => entryDistrict === districtSlug && entrySlug !== slug);
  assert.ok(html.includes(`href="/gps-tracker/rajasthan/${districtSlug}/${sibling[1]}"`), `Rajasthan town missing paired-town link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Rajasthan town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Rajasthan town FAQ schema: ${route}`);
}

console.log("PASS: 82 rendered Rajasthan city and town pages; canonical, schema, sitemap, state, district and paired-town links verified.");
