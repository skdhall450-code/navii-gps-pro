import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/andhraPradeshDistricts.ts", "utf8");
const districtSeeds = dataSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "alluri-sitharama-raju", "anakapalli", "ananthapuramu", "annamayya", "bapatla", "chittoor",
  "dr-br-ambedkar-konaseema", "east-godavari", "eluru", "guntur", "kakinada", "krishna",
  "kurnool", "markapuram", "nandyal", "ntr", "palnadu", "parvathipuram-manyam", "polavaram",
  "prakasam", "spsr-nellore", "sri-sathya-sai", "srikakulam", "tirupati", "visakhapatnam",
  "vizianagaram", "west-godavari", "ysr-kadapa",
];

assert.equal(districtSeeds.length, 28, "Expected all 28 current Andhra Pradesh districts");
assert.deepEqual(districtSeeds.map(([slug]) => slug).sort(), expectedSlugs.sort());
assert.equal(new Set(districtSeeds.map(([slug]) => slug)).size, 28, "Duplicate Andhra Pradesh district slugs");
assert.equal(new Set(districtSeeds.map(([, name]) => name)).size, 28, "Duplicate Andhra Pradesh district names");
assert.equal(new Set(districtSeeds.map(([, , , routeProfile]) => routeProfile)).size, 28, "Duplicate Andhra Pradesh route profiles");
assert.ok(districtSeeds.some(([slug]) => slug === "markapuram"), "Current Markapuram district is missing");
assert.ok(districtSeeds.some(([slug]) => slug === "polavaram"), "Current Polavaram district is missing");

for (const [slug, name, cities, routeProfile, sourceUrl] of districtSeeds) {
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid district slug: ${slug}`);
  assert.ok(name.length >= 3, `Invalid district name: ${slug}`);
  assert.equal(cities.length, 4, `Expected four district locations: ${slug}`);
  assert.equal(new Set(cities).size, cities.length, `Duplicate district locations: ${slug}`);
  assert.ok(routeProfile.length > 70, `District route profile is too short: ${slug}`);
  assert.match(new URL(sourceUrl).hostname, /\.ap\.gov\.in$/, `Expected official Andhra Pradesh district source: ${slug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/AndhraPradeshDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("andhraPradeshDistricts.map"), "Automatic Andhra Pradesh district static params are missing");
assert.ok(routeSource.includes("generateAndhraPradeshDistrictMetadata"), "Automatic Andhra Pradesh district metadata is missing");
assert.ok(routeSource.includes("AndhraPradeshDistrictGpsPage"), "Andhra Pradesh district page routing is missing");
assert.ok(hubSource.includes('state.slug === "andhra-pradesh" ? andhraPradeshDistricts'), "Andhra Pradesh hub-to-district links are missing");
assert.ok(sitemapSource.includes("andhraPradeshDistrictRoutes"), "Automatic Andhra Pradesh district sitemap routes are missing");
assert.ok(dataSource.includes("district.cities.flatMap"), "Automatic Andhra Pradesh location keyword generation is missing");
assert.ok(dataSource.includes("వాహన GPS ట్రాకర్"), "Telugu-intent district keyword generation is missing");
assert.ok(pageSource.includes('"@type": "Service"'), "Andhra Pradesh district Service schema is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Andhra Pradesh district FAQ schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 28 current Andhra Pradesh districts with official sources, local keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/andhra-pradesh.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");
assert.ok(hubHtml.includes("<title>GPS Tracker in Andhra Pradesh | Vehicle Tracking System | NAVII GPS INDIA</title>"), "Invalid Andhra Pradesh hub title");
assert.ok(!hubHtml.includes("NAVII GPS | NAVII GPS INDIA"), "Duplicate brand in Andhra Pradesh hub title");
assert.match(hubHtml, /GPS Tracker Guides for All\s*<!-- -->28<!-- -->/, "Current district count is missing from Andhra Pradesh hub");

for (const [slug, name, cities] of districtSeeds) {
  const route = `/gps-tracker/andhra-pradesh/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Andhra Pradesh district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Andhra Pradesh district canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Andhra Pradesh | NAVII GPS INDIA</title>`), `Invalid Andhra Pradesh district title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Andhra Pradesh district H1: ${route}`);
  assert.ok(html.includes(`${name} District, Andhra Pradesh`), `Andhra Pradesh district name missing: ${route}`);
  assert.ok(html.includes(`GPS tracker ${cities[0]}`), `Andhra Pradesh location keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Andhra Pradesh district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Andhra Pradesh district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Andhra Pradesh district orphaned from hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/andhra-pradesh"'), `Andhra Pradesh district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Andhra Pradesh Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Andhra Pradesh FAQ schema: ${route}`);
}

console.log("PASS: 28 rendered Andhra Pradesh district pages; keywords, canonical, schema, sitemap and hub links verified.");
