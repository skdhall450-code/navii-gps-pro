import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const districtSource = readFileSync("lib/seo/haryanaDistricts.ts", "utf8");
const seedsMatch = districtSource.match(
  /const haryanaDistrictSeeds: HaryanaDistrictSeed\[\] = ([\s\S]*?\n\]);/,
);
assert.ok(seedsMatch, "Missing Haryana district seed data");
const seeds = JSON.parse(seedsMatch[1].replace(/,\s*]/g, "]"));
const slugify = (name) => name
  .toLowerCase()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const cities = seeds.flatMap(([districtSlug, districtName, districtCities]) =>
  districtCities.map((name) => ({
    name,
    slug: slugify(name),
    districtSlug,
    districtName,
    siblings: districtCities.filter((city) => city !== name),
  })),
);

assert.equal(cities.length, 96, "Expected all 96 Haryana city and town records");
assert.equal(
  new Set(cities.map((city) => `${city.districtSlug}/${city.slug}`)).size,
  96,
  "Duplicate Haryana district-city routes",
);
for (const city of cities) {
  assert.match(city.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid city slug: ${city.slug}`);
  assert.ok(city.siblings.length >= 3, `Expected sibling locations for ${city.name}`);
}

const cityDataSource = readFileSync("lib/seo/haryanaCities.ts", "utf8");
const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const cityPageSource = readFileSync("components/seo/HaryanaCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/HaryanaDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(cityDataSource.includes("haryanaDistricts.flatMap"), "Automatic Haryana city generation is missing");
assert.ok(cityDataSource.includes("generateHaryanaCityKeywords"), "Automatic Haryana city keywords are missing");
assert.ok(cityDataSource.includes("generateHaryanaCityMetadata"), "Automatic Haryana city metadata is missing");
assert.ok(routeSource.includes("haryanaCities.map"), "Automatic Haryana city static params are missing");
assert.ok(routeSource.includes("generateHaryanaCityMetadata"), "City route metadata is missing");
assert.ok(cityPageSource.includes('"@type": "City"'), "City Service schema coverage is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "District-to-city links are missing");
assert.ok(sitemapSource.includes("haryanaCityRoutes"), "Automatic Haryana city sitemap routes are missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 96 Haryana city and town routes with automatic keywords, metadata, schema and links verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const city of cities) {
  const route = `/gps-tracker/haryana/${city.districtSlug}/${city.slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Haryana city page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid city canonical: ${route}`);
  assert.ok(
    html.includes(`<title>GPS Tracker in ${city.name}, ${city.districtName} | NAVII GPS INDIA</title>`),
    `Invalid city title: ${route}`,
  );
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one city H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${city.name}`), `City keyword missing from page: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed city: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `City missing from sitemap: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/haryana/${city.districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `City orphaned from district page: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/haryana/${city.districtSlug}"`), `City missing parent link: ${route}`);
  if (city.siblings.length > 0) {
    const siblingRoute = `/gps-tracker/haryana/${city.districtSlug}/${slugify(city.siblings[0])}`;
    assert.ok(html.includes(`href="${siblingRoute}"`), `City missing sibling link: ${route}`);
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some(
      (item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "City",
    )),
    `Missing city Service schema: ${route}`,
  );
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")),
    `Missing city FAQ schema: ${route}`,
  );
}

console.log("PASS: 96 rendered Haryana city and town pages; canonical, schema, sitemap and district links verified.");
