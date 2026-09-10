import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/haryanaDistricts.ts", "utf8");
const seedsMatch = dataSource.match(
  /const haryanaDistrictSeeds: HaryanaDistrictSeed\[\] = ([\s\S]*?\n\]);/,
);
assert.ok(seedsMatch, "Missing Haryana district seed data");
const seeds = JSON.parse(seedsMatch[1].replace(/,\s*]/g, "]"));
const districts = seeds.map(
  ([slug, name, cities, sectors, routeProfile, planningFocus]) => ({
    slug,
    name,
    cities,
    sectors,
    routeProfile,
    planningFocus,
    localContext: `${name} district fleet operations connect ${routeProfile}, where vehicle location, trip history and supported alerts can help authorized teams coordinate daily routes.`,
    planningNote: `Before deployment in ${name} district, confirm ${planningFocus}, device and SIM compatibility, installation responsibility, data retention and ongoing NAVII GPS platform support.`,
  }),
);

const expectedSlugs = [
  "ambala",
  "bhiwani",
  "charkhi-dadri",
  "faridabad",
  "fatehabad",
  "gurugram",
  "hansi",
  "hisar",
  "jhajjar",
  "jind",
  "kaithal",
  "karnal",
  "kurukshetra",
  "mahendragarh",
  "nuh",
  "palwal",
  "panchkula",
  "panipat",
  "rewari",
  "rohtak",
  "sirsa",
  "sonipat",
  "yamunanagar",
];

assert.equal(districts.length, 23, "Expected all 23 Haryana district records");
assert.deepEqual(districts.map((district) => district.slug).sort(), expectedSlugs.sort());
assert.equal(new Set(districts.map((district) => district.slug)).size, 23, "Duplicate district slugs");
assert.equal(new Set(districts.map((district) => district.planningNote)).size, 23, "Duplicate district guidance");

for (const district of districts) {
  assert.match(district.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid district slug: ${district.slug}`);
  assert.ok(district.cities.length >= 4, `Expected four district locations: ${district.slug}`);
  assert.equal(new Set(district.cities).size, district.cities.length, `Duplicate district locations: ${district.slug}`);
  assert.ok(district.sectors.length >= 3, `Expected district sectors: ${district.slug}`);
  assert.ok(district.routeProfile.length > 80, `District route profile is too short: ${district.slug}`);
  assert.ok(district.planningFocus.length > 75, `District planning focus is too short: ${district.slug}`);
  assert.ok(district.localContext.length > 180, `District local context is too short: ${district.slug}`);
  assert.ok(district.planningNote.length > 180, `District planning note is too short: ${district.slug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const stateSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("haryanaDistricts.map"), "Automatic Haryana district static params are missing");
assert.ok(routeSource.includes("generateHaryanaDistrictMetadata"), "Automatic district metadata is missing");
assert.ok(stateSource.includes("districtGuides.map"), "Haryana state-to-district links are missing");
assert.ok(sitemapSource.includes("haryanaDistrictRoutes"), "Automatic Haryana district sitemap routes are missing");
assert.ok(dataSource.includes("district.cities.flatMap"), "Automatic district city keyword generation is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 23 Haryana districts with city keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const stateHtml = readFileSync(`${root}/gps-tracker/haryana.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const district of districts) {
  const route = `/gps-tracker/haryana/${district.slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Haryana district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid district canonical: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one district H1: ${route}`);
  assert.ok(html.includes(`${district.name} District`), `District name missing from page: ${route}`);
  assert.ok(html.includes(`GPS tracker ${district.cities[0]}`), `District city keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `District missing from sitemap: ${route}`);
  assert.ok(stateHtml.includes(`href="${route}"`), `District orphaned from Haryana state page: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/haryana"'), `District missing parent state link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some(
      (item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea",
    )),
    `Missing district Service schema: ${route}`,
  );
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")),
    `Missing district FAQ schema: ${route}`,
  );
}

console.log("PASS: 23 rendered Haryana district pages; city keywords, canonical, schema, sitemap and state links verified.");
