import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const districtSource = readFileSync("lib/seo/punjabDistricts.ts", "utf8");
const seedsMatch = districtSource.match(
  /const punjabDistrictSeeds: PunjabDistrictSeed\[\] = ([\s\S]*?\n\]);/,
);
assert.ok(seedsMatch, "Missing Punjab district seed data");
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

assert.equal(cities.length, 104, "Expected all 104 Punjab city and town records");
assert.equal(
  new Set(cities.map((city) => `${city.districtSlug}/${city.slug}`)).size,
  104,
  "Duplicate Punjab district-city routes",
);
for (const city of cities) {
  assert.match(city.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid city slug: ${city.slug}`);
  assert.ok(city.siblings.length >= 3, `Expected sibling locations for ${city.name}`);
}

const cityDataSource = readFileSync("lib/seo/punjabCities.ts", "utf8");
const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const cityPageSource = readFileSync("components/seo/PunjabCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/PunjabDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(cityDataSource.includes("punjabDistricts.flatMap"), "Automatic Punjab city generation is missing");
assert.ok(cityDataSource.includes("generatePunjabCityKeywords"), "Automatic Punjab city keywords are missing");
assert.ok(cityDataSource.includes("generatePunjabCityMetadata"), "Automatic Punjab city metadata is missing");
assert.ok(routeSource.includes("punjabCities.map"), "Automatic Punjab city static params are missing");
assert.ok(routeSource.includes("generatePunjabCityMetadata"), "Punjab city route metadata is missing");
assert.ok(cityPageSource.includes('"@type": "City"'), "Punjab city Service schema coverage is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Punjab district-to-city links are missing");
assert.ok(sitemapSource.includes("punjabCityRoutes"), "Automatic Punjab city sitemap routes are missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 104 Punjab city and town routes with automatic keywords, metadata, schema and links verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const city of cities) {
  const route = `/gps-tracker/punjab/${city.districtSlug}/${city.slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Punjab city page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Punjab city canonical: ${route}`);
  assert.ok(
    html.includes(`<title>GPS Tracker in ${city.name}, ${city.districtName} | NAVII GPS INDIA</title>`),
    `Invalid Punjab city title: ${route}`,
  );
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Punjab city H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${city.name}`), `Punjab city keyword missing from page: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Punjab city: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Punjab city missing from sitemap: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/punjab/${city.districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Punjab city orphaned from district page: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/punjab/${city.districtSlug}"`), `Punjab city missing parent link: ${route}`);
  if (city.siblings.length > 0) {
    const siblingRoute = `/gps-tracker/punjab/${city.districtSlug}/${slugify(city.siblings[0])}`;
    assert.ok(html.includes(`href="${siblingRoute}"`), `Punjab city missing sibling link: ${route}`);
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some(
      (item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "City",
    )),
    `Missing Punjab city Service schema: ${route}`,
  );
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")),
    `Missing Punjab city FAQ schema: ${route}`,
  );
}

console.log("PASS: 104 rendered Punjab city and town pages; canonical, schema, sitemap and district links verified.");
