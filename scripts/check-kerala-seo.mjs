import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/keralaDistricts.ts", "utf8");
const districtSeeds = dataSource.split("\n")
  .filter((line) => /^\s+\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "thiruvananthapuram", "kollam", "pathanamthitta", "alappuzha", "kottayam", "idukki",
  "ernakulam", "thrissur", "palakkad", "malappuram", "kozhikode", "wayanad", "kannur", "kasaragod",
];

assert.equal(districtSeeds.length, 14, "Expected all 14 Kerala districts");
assert.deepEqual(districtSeeds.map(([slug]) => slug).sort(), expectedSlugs.sort());
assert.equal(new Set(districtSeeds.map(([slug]) => slug)).size, 14, "Duplicate Kerala district slugs");
assert.equal(new Set(districtSeeds.map(([, name]) => name)).size, 14, "Duplicate Kerala district names");
assert.equal(new Set(districtSeeds.map(([, , , routeProfile]) => routeProfile)).size, 14, "Duplicate Kerala route profiles");

for (const [slug, name, cities, routeProfile, sourceUrl] of districtSeeds) {
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid district slug: ${slug}`);
  assert.ok(name.length >= 3, `Invalid district name: ${slug}`);
  assert.equal(cities.length, 4, `Expected four district locations: ${slug}`);
  assert.equal(new Set(cities).size, cities.length, `Duplicate district locations: ${slug}`);
  assert.ok(routeProfile.length > 70, `District route profile is too short: ${slug}`);
  assert.match(new URL(sourceUrl).hostname, /\.nic\.in$/, `Expected official Kerala district source: ${slug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/KeralaDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("keralaDistricts.map"), "Automatic Kerala district static params are missing");
assert.ok(routeSource.includes("generateKeralaDistrictMetadata"), "Automatic Kerala district metadata is missing");
assert.ok(routeSource.includes("KeralaDistrictGpsPage"), "Kerala district page routing is missing");
assert.ok(hubSource.includes('state.slug === "kerala" ? keralaDistricts'), "Kerala hub-to-district links are missing");
assert.ok(sitemapSource.includes("keralaDistrictRoutes"), "Automatic Kerala district sitemap routes are missing");
assert.ok(dataSource.includes("district.cities.flatMap"), "Automatic Kerala location keyword generation is missing");
assert.ok(dataSource.includes("വാഹന GPS ട്രാക്കർ"), "Malayalam-intent district keyword generation is missing");
assert.ok(pageSource.includes('"@type": "Service"'), "Kerala district Service schema is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Kerala district FAQ schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 14 Kerala districts with official sources, local keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/kerala.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");
assert.ok(hubHtml.includes("<title>GPS Tracker in Kerala | Vehicle Tracking System | NAVII GPS INDIA</title>"), "Invalid Kerala hub title");
assert.ok(!hubHtml.includes("NAVII GPS | NAVII GPS INDIA"), "Duplicate brand in Kerala hub title");

for (const [slug, name, cities] of districtSeeds) {
  const route = `/gps-tracker/kerala/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Kerala district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Kerala district canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Kerala | NAVII GPS INDIA</title>`), `Invalid Kerala district title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Kerala district H1: ${route}`);
  assert.ok(html.includes(`${name} District, Kerala`), `Kerala district name missing: ${route}`);
  assert.ok(html.includes(`GPS tracker ${cities[0]}`), `Kerala location keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Kerala district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Kerala district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Kerala district orphaned from hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/kerala"'), `Kerala district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Kerala Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Kerala FAQ schema: ${route}`);
}

console.log("PASS: 14 rendered Kerala district pages; keywords, canonical, schema, sitemap and hub links verified.");
