import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/telanganaDistricts.ts", "utf8");
const districtSeeds = dataSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "adilabad", "bhadradri-kothagudem", "hanumakonda", "hyderabad", "jagtial", "jangaon",
  "jayashankar-bhupalpally", "jogulamba-gadwal", "kamareddy", "karimnagar", "khammam",
  "komaram-bheem-asifabad", "mahabubabad", "mahabubnagar", "mancherial", "medak",
  "medchal-malkajgiri", "mulugu", "nagarkurnool", "nalgonda", "narayanpet", "nirmal",
  "nizamabad", "peddapalli", "rajanna-sircilla", "ranga-reddy", "sangareddy", "siddipet",
  "suryapet", "vikarabad", "wanaparthy", "warangal", "yadadri-bhuvanagiri",
];

assert.equal(districtSeeds.length, 33, "Expected all 33 Telangana districts");
assert.deepEqual(districtSeeds.map(([slug]) => slug).sort(), expectedSlugs.sort());
assert.equal(new Set(districtSeeds.map(([slug]) => slug)).size, 33, "Duplicate Telangana district slugs");
assert.equal(new Set(districtSeeds.map(([, name]) => name)).size, 33, "Duplicate Telangana district names");
assert.equal(new Set(districtSeeds.map(([, , , routeProfile]) => routeProfile)).size, 33, "Duplicate Telangana route profiles");

for (const [slug, name, cities, routeProfile, sourceUrl] of districtSeeds) {
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid district slug: ${slug}`);
  assert.ok(name.length >= 3, `Invalid district name: ${slug}`);
  assert.equal(cities.length, 4, `Expected four district locations: ${slug}`);
  assert.equal(new Set(cities).size, cities.length, `Duplicate district locations: ${slug}`);
  assert.ok(routeProfile.length > 70, `District route profile is too short: ${slug}`);
  assert.match(new URL(sourceUrl).hostname, /\.telangana\.gov\.in$/, `Expected official Telangana district source: ${slug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/TelanganaDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("telanganaDistricts.map"), "Automatic Telangana district static params are missing");
assert.ok(routeSource.includes("generateTelanganaDistrictMetadata"), "Automatic Telangana district metadata is missing");
assert.ok(routeSource.includes("TelanganaDistrictGpsPage"), "Telangana district page routing is missing");
assert.ok(hubSource.includes('state.slug === "telangana" ? telanganaDistricts'), "Telangana hub-to-district links are missing");
assert.ok(sitemapSource.includes("telanganaDistrictRoutes"), "Automatic Telangana district sitemap routes are missing");
assert.ok(dataSource.includes("district.cities.flatMap"), "Automatic Telangana location keyword generation is missing");
assert.ok(dataSource.includes("వాహన GPS ట్రాకర్"), "Telugu-intent district keyword generation is missing");
assert.ok(pageSource.includes('"@type": "Service"'), "Telangana district Service schema is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Telangana district FAQ schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 33 Telangana districts with official sources, local keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/telangana.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");
assert.ok(hubHtml.includes("<title>GPS Tracker in Telangana | Vehicle Tracking System | NAVII GPS INDIA</title>"), "Invalid Telangana hub title");
assert.ok(!hubHtml.includes("NAVII GPS | NAVII GPS INDIA"), "Duplicate brand in Telangana hub title");

for (const [slug, name, cities] of districtSeeds) {
  const route = `/gps-tracker/telangana/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Telangana district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Telangana district canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Telangana | NAVII GPS INDIA</title>`), `Invalid Telangana district title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Telangana district H1: ${route}`);
  assert.ok(html.includes(`${name} District, Telangana`), `Telangana district name missing: ${route}`);
  assert.ok(html.includes(`GPS tracker ${cities[0]}`), `Telangana location keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Telangana district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Telangana district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Telangana district orphaned from hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/telangana"'), `Telangana district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Telangana Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Telangana FAQ schema: ${route}`);
}

console.log("PASS: 33 rendered Telangana district pages; keywords, canonical, schema, sitemap and hub links verified.");
