import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/delhiDistricts.ts", "utf8");
const seedsMatch = dataSource.match(
  /const delhiDistrictSeeds: DelhiDistrictSeed\[\] = ([\s\S]*?\n\]);/,
);
assert.ok(seedsMatch, "Missing Delhi district seed data");
const seeds = JSON.parse(seedsMatch[1].replace(/,\s*]/g, "]"));
const districts = seeds.map(
  ([slug, name, areas, sectors, routeProfile, planningFocus]) => ({
    slug,
    name,
    areas,
    sectors,
    routeProfile,
    planningFocus,
    localContext: `${name} district fleet operations connect ${routeProfile}, where vehicle location, trip history and supported alerts can help authorized teams coordinate daily routes.`,
    planningNote: `Before deployment in ${name} district, confirm ${planningFocus}, device and SIM compatibility, installation responsibility, data retention and ongoing NAVII GPS platform support.`,
  }),
);

const expectedSlugs = [
  "north",
  "central",
  "south",
  "new-delhi",
  "south-west",
  "west",
  "north-east",
  "east",
  "north-west",
  "south-east",
  "central-north",
  "outer-north",
  "old-delhi",
];

assert.equal(districts.length, 13, "Expected all 13 current Delhi revenue districts");
assert.deepEqual(districts.map((district) => district.slug).sort(), expectedSlugs.sort());
assert.equal(new Set(districts.map((district) => district.slug)).size, 13, "Duplicate Delhi district slugs");
assert.equal(new Set(districts.map((district) => district.localContext)).size, 13, "Duplicate Delhi district content");
assert.equal(new Set(districts.map((district) => district.planningNote)).size, 13, "Duplicate Delhi district guidance");

for (const district of districts) {
  assert.match(district.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid district slug: ${district.slug}`);
  assert.ok(district.areas.length >= 4, `Expected four district areas: ${district.slug}`);
  assert.equal(new Set(district.areas).size, district.areas.length, `Duplicate district areas: ${district.slug}`);
  assert.ok(district.sectors.length >= 3, `Expected district sectors: ${district.slug}`);
  assert.ok(district.routeProfile.length > 80, `District route profile is too short: ${district.slug}`);
  assert.ok(district.planningFocus.length > 70, `District planning focus is too short: ${district.slug}`);
  assert.ok(district.localContext.length > 180, `District local context is too short: ${district.slug}`);
  assert.ok(district.planningNote.length > 175, `District planning note is too short: ${district.slug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const hubSource = readFileSync("components/seo/DelhiGpsPage.tsx", "utf8");
const delhiPageSource = readFileSync("app/gps-tracker/delhi/page.tsx", "utf8");
const dynamicHubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("delhiDistricts.map"), "Automatic Delhi district static params are missing");
assert.ok(routeSource.includes("generateDelhiDistrictMetadata"), "Automatic Delhi district metadata is missing");
assert.ok(routeSource.includes("DelhiDistrictGpsPage"), "Delhi district page routing is missing");
assert.ok(hubSource.includes("delhiDistricts.map"), "Delhi hub-to-district links are missing");
assert.ok(delhiPageSource.includes("DelhiGpsPage"), "Delhi SEO hub is missing");
assert.ok(dynamicHubSource.includes('slug === "delhi"') && dynamicHubSource.includes("<DelhiGpsPage />"), "Dynamic Delhi hub override is missing");
assert.ok(sitemapSource.includes("delhiDistrictRoutes"), "Automatic Delhi district sitemap routes are missing");
assert.ok(dataSource.includes("district.areas.flatMap"), "Automatic Delhi area keyword generation is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 13 current Delhi revenue districts with area keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/delhi.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const district of districts) {
  const route = `/gps-tracker/delhi/${district.slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Delhi district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Delhi district canonical: ${route}`);
  assert.ok(
    html.includes(`<title>GPS Tracker in ${district.name} District, Delhi | NAVII GPS INDIA</title>`),
    `Invalid Delhi district title: ${route}`,
  );
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Delhi district H1: ${route}`);
  assert.ok(html.includes(`${district.name} District, Delhi`), `Delhi district name missing from page: ${route}`);
  assert.ok(html.includes(`GPS tracker ${district.areas[0]}`), `Delhi area keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Delhi district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Delhi district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Delhi district orphaned from hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/delhi"'), `Delhi district missing parent hub link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some(
      (item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea",
    )),
    `Missing Delhi district Service schema: ${route}`,
  );
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")),
    `Missing Delhi district FAQ schema: ${route}`,
  );
}

console.log("PASS: 13 rendered Delhi district pages; area keywords, canonical, schema, sitemap and hub links verified.");
