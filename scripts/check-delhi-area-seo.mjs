import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const districtSource = readFileSync("lib/seo/delhiDistricts.ts", "utf8");
const seedsMatch = districtSource.match(
  /const delhiDistrictSeeds: DelhiDistrictSeed\[\] = ([\s\S]*?\n\]);/,
);
assert.ok(seedsMatch, "Missing Delhi district seed data");
const seeds = JSON.parse(seedsMatch[1].replace(/,\s*]/g, "]"));
const slugify = (name) => name
  .toLowerCase()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const areas = seeds.flatMap(([districtSlug, districtName, districtAreas]) =>
  districtAreas.map((name) => ({
    name,
    slug: slugify(name),
    districtSlug,
    districtName,
    siblings: districtAreas.filter((area) => area !== name),
  })),
);

assert.equal(areas.length, 60, "Expected all 60 Delhi area and city records");
assert.equal(new Set(areas.map((area) => area.name)).size, 60, "Duplicate Delhi area names");
assert.equal(
  new Set(areas.map((area) => `${area.districtSlug}/${area.slug}`)).size,
  60,
  "Duplicate Delhi district-area routes",
);
for (const area of areas) {
  assert.match(area.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid Delhi area slug: ${area.slug}`);
  assert.ok(area.siblings.length >= 3, `Expected sibling areas for ${area.name}`);
}

const areaDataSource = readFileSync("lib/seo/delhiAreas.ts", "utf8");
const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const areaPageSource = readFileSync("components/seo/DelhiAreaGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/DelhiDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(areaDataSource.includes("delhiDistricts.flatMap"), "Automatic Delhi area generation is missing");
assert.ok(areaDataSource.includes("generateDelhiAreaKeywords"), "Automatic Delhi area keywords are missing");
assert.ok(areaDataSource.includes("generateDelhiAreaMetadata"), "Automatic Delhi area metadata is missing");
assert.ok(routeSource.includes("delhiAreas.map"), "Automatic Delhi area static params are missing");
assert.ok(routeSource.includes("generateDelhiAreaMetadata"), "Delhi area route metadata is missing");
assert.ok(areaPageSource.includes('"@type": "Place"'), "Delhi area Service schema coverage is missing");
assert.ok(districtPageSource.includes("areaGuides.map"), "Delhi district-to-area links are missing");
assert.ok(sitemapSource.includes("delhiAreaRoutes"), "Automatic Delhi area sitemap routes are missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 60 Delhi area and city routes with automatic keywords, metadata, schema and links verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const area of areas) {
  const route = `/gps-tracker/delhi/${area.districtSlug}/${area.slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Delhi area page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Delhi area canonical: ${route}`);
  assert.ok(
    html.includes(`<title>GPS Tracker in ${area.name}, Delhi | NAVII GPS INDIA</title>`),
    `Invalid Delhi area title: ${route}`,
  );
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Delhi area H1: ${route}`);
  assert.ok(html.includes(`GPS tracker ${area.name} Delhi`), `Delhi area keyword missing from page: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Delhi area: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Delhi area missing from sitemap: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/delhi/${area.districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Delhi area orphaned from district page: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/delhi/${area.districtSlug}"`), `Delhi area missing parent link: ${route}`);
  if (area.siblings.length > 0) {
    const siblingRoute = `/gps-tracker/delhi/${area.districtSlug}/${slugify(area.siblings[0])}`;
    assert.ok(html.includes(`href="${siblingRoute}"`), `Delhi area missing sibling link: ${route}`);
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some(
      (item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place",
    )),
    `Missing Delhi area Service schema: ${route}`,
  );
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")),
    `Missing Delhi area FAQ schema: ${route}`,
  );
}

console.log("PASS: 60 rendered Delhi area and city pages; canonical, schema, sitemap and district links verified.");
