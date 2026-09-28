import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const districtSource = readFileSync("lib/seo/madhyaPradeshDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const citySeeds = districtSeeds.flatMap(([districtSlug, districtName, cities]) =>
  cities.slice(1, 3).map((name) => [districtSlug, slugify(name), name, districtName]),
);
const districtMap = new Map(districtSeeds.map(([slug, name, cities]) => [slug, { name, cities }]));

assert.equal(citySeeds.length, 110, "Expected 110 reviewed Madhya Pradesh city and town records");
assert.equal(districtMap.size, 55, "Expected all 55 current Madhya Pradesh districts");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 110, "Duplicate Madhya Pradesh town route");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Madhya Pradesh district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Madhya Pradesh town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would duplicate its district: ${districtSlug}/${slug}`);
  assert.equal(slug, slugify(name), `Town slug must match name: ${districtSlug}/${slug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}
for (const districtSlug of districtMap.keys()) assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);

const citySource = readFileSync("lib/seo/madhyaPradeshCities.ts", "utf8");
const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/MadhyaPradeshCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/MadhyaPradeshDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(citySource.includes("district.cities.slice(1, 3)"), "Reviewed Madhya Pradesh city selection is missing");
assert.ok(routeSource.includes("madhyaPradeshCities.map"), "Madhya Pradesh town static params are missing");
assert.ok(routeSource.includes("generateMadhyaPradeshCityMetadata"), "Madhya Pradesh town metadata wiring is missing");
assert.ok(routeSource.includes("MadhyaPradeshCityGpsPage"), "Madhya Pradesh town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Madhya Pradesh district-to-town links are missing");
assert.ok(hubSource.includes("madhyaPradeshCities.map"), "Madhya Pradesh state-to-town links are missing");
assert.ok(sitemapSource.includes("madhyaPradeshCityRoutes"), "Madhya Pradesh town sitemap routes are missing");
assert.ok(citySource.includes("वाहन GPS ट्रैकर"), "Hindi-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Madhya Pradesh town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Madhya Pradesh town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 110 reviewed Madhya Pradesh cities and towns across all 55 districts; mappings, Hindi keywords and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/madhya-pradesh.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name, districtName] of citySeeds) {
  const route = `/gps-tracker/madhya-pradesh/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Madhya Pradesh town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Madhya Pradesh town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${districtName} | NAVII GPS INDIA</title>`), `Invalid Madhya Pradesh town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Madhya Pradesh town H1: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Madhya Pradesh town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Madhya Pradesh town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Madhya Pradesh town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/madhya-pradesh/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Madhya Pradesh town orphaned from district: ${route}`);
  const sibling = citySeeds.find(([entryDistrict, entrySlug]) => entryDistrict === districtSlug && entrySlug !== slug);
  assert.ok(html.includes(`href="/gps-tracker/madhya-pradesh/${districtSlug}/${sibling[1]}"`), `Madhya Pradesh town missing paired-town link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Madhya Pradesh town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Madhya Pradesh town FAQ schema: ${route}`);
}

console.log("PASS: 110 rendered Madhya Pradesh city and town pages; canonical, schema, sitemap, state, district and paired-town links verified.");
