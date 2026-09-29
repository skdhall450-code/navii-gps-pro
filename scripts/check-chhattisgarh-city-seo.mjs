import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const districtSource = readFileSync("lib/seo/chhattisgarhDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const citySeeds = districtSeeds.flatMap(([districtSlug, districtName, cities]) =>
  cities.filter((name) => slugify(name) !== districtSlug).slice(0, 2).map((name) => [districtSlug, slugify(name), name, districtName]),
);
const districtMap = new Map(districtSeeds.map(([slug, name, cities]) => [slug, { name, cities }]));

assert.equal(citySeeds.length, 66, "Expected 66 reviewed Chhattisgarh city and town records");
assert.equal(districtMap.size, 33, "Expected all 33 current Chhattisgarh districts");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 66, "Duplicate Chhattisgarh town route");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Chhattisgarh district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Chhattisgarh town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would duplicate its district: ${districtSlug}/${slug}`);
  assert.equal(slug, slugify(name), `Town slug must match name: ${districtSlug}/${slug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}
for (const districtSlug of districtMap.keys()) assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);

const citySource = readFileSync("lib/seo/chhattisgarhCities.ts", "utf8");
const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/ChhattisgarhCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/ChhattisgarhDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(citySource.includes("district.cities.filter") && citySource.includes("slice(0, 2)"), "Reviewed Chhattisgarh city selection is missing");
assert.ok(routeSource.includes("chhattisgarhCities.map"), "Chhattisgarh town static params are missing");
assert.ok(routeSource.includes("generateChhattisgarhCityMetadata"), "Chhattisgarh town metadata wiring is missing");
assert.ok(routeSource.includes("ChhattisgarhCityGpsPage"), "Chhattisgarh town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Chhattisgarh district-to-town links are missing");
assert.ok(hubSource.includes("chhattisgarhCities.map"), "Chhattisgarh state-to-town links are missing");
assert.ok(sitemapSource.includes("chhattisgarhCityRoutes"), "Chhattisgarh town sitemap routes are missing");
assert.ok(citySource.includes("वाहन GPS ट्रैकर"), "Hindi-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Chhattisgarh town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Chhattisgarh town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 66 reviewed Chhattisgarh cities and towns across all 33 districts; mappings, Hindi keywords and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/chhattisgarh.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name, districtName] of citySeeds) {
  const route = `/gps-tracker/chhattisgarh/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Chhattisgarh town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Chhattisgarh town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${districtName} | NAVII GPS INDIA</title>`), `Invalid Chhattisgarh town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Chhattisgarh town H1: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Chhattisgarh town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Chhattisgarh town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Chhattisgarh town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/chhattisgarh/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Chhattisgarh town orphaned from district: ${route}`);
  const sibling = citySeeds.find(([entryDistrict, entrySlug]) => entryDistrict === districtSlug && entrySlug !== slug);
  assert.ok(html.includes(`href="/gps-tracker/chhattisgarh/${districtSlug}/${sibling[1]}"`), `Chhattisgarh town missing paired-town link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Chhattisgarh town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Chhattisgarh town FAQ schema: ${route}`);
}

console.log("PASS: 66 rendered Chhattisgarh city and town pages; canonical, schema, sitemap, state, district and paired-town links verified.");
