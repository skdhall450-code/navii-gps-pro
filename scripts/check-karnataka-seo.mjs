import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/karnatakaDistricts.ts", "utf8");
const districtSeeds = dataSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "bagalkote", "ballari", "belagavi", "bengaluru-rural", "bengaluru-south", "bengaluru-urban", "bidar",
  "chamarajanagar", "chikkaballapura", "chikkamagaluru", "chitradurga", "dakshina-kannada", "davanagere",
  "dharwad", "gadag", "hassan", "haveri", "kalaburagi", "kodagu", "kolar", "koppal", "mandya", "mysuru",
  "raichur", "shivamogga", "tumakuru", "udupi", "uttara-kannada", "vijayapura", "vijayanagara", "yadgir",
];

assert.equal(districtSeeds.length, 31, "Expected all 31 Karnataka districts");
assert.deepEqual(districtSeeds.map(([slug]) => slug).sort(), expectedSlugs.sort());
assert.equal(new Set(districtSeeds.map(([slug]) => slug)).size, 31, "Duplicate Karnataka district slugs");
assert.equal(new Set(districtSeeds.map(([, name]) => name)).size, 31, "Duplicate Karnataka district names");
assert.equal(new Set(districtSeeds.map(([, , , routeProfile]) => routeProfile)).size, 31, "Duplicate Karnataka route profiles");

for (const [slug, name, cities, routeProfile, sourceUrl] of districtSeeds) {
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid district slug: ${slug}`);
  assert.ok(name.length >= 3, `Invalid district name: ${slug}`);
  assert.equal(cities.length, 4, `Expected four district locations: ${slug}`);
  assert.equal(new Set(cities).size, cities.length, `Duplicate district locations: ${slug}`);
  assert.ok(routeProfile.length > 70, `District route profile is too short: ${slug}`);
  assert.match(new URL(sourceUrl).hostname, /\.nic\.in$/, `Expected official district source: ${slug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/KarnatakaDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("karnatakaDistricts.map"), "Automatic Karnataka district static params are missing");
assert.ok(routeSource.includes("generateKarnatakaDistrictMetadata"), "Automatic Karnataka district metadata is missing");
assert.ok(routeSource.includes("KarnatakaDistrictGpsPage"), "Karnataka district page routing is missing");
assert.ok(hubSource.includes('state.slug === "karnataka" ? karnatakaDistricts'), "Karnataka hub-to-district links are missing");
assert.ok(sitemapSource.includes("karnatakaDistrictRoutes"), "Automatic Karnataka district sitemap routes are missing");
assert.ok(dataSource.includes("district.cities.flatMap"), "Automatic Karnataka location keyword generation is missing");
assert.ok(dataSource.includes("ವಾಹನ GPS ಟ್ರ್ಯಾಕರ್"), "Kannada-intent district keyword generation is missing");
assert.ok(pageSource.includes('"@type": "Service"'), "Karnataka district Service schema is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Karnataka district FAQ schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 31 Karnataka districts with official sources, local keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/karnataka.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");
assert.ok(hubHtml.includes("<title>GPS Tracker in Karnataka | Vehicle Tracking System | NAVII GPS INDIA</title>"), "Invalid Karnataka hub title");
assert.ok(!hubHtml.includes("NAVII GPS | NAVII GPS INDIA"), "Duplicate brand in Karnataka hub title");

for (const [slug, name, cities] of districtSeeds) {
  const route = `/gps-tracker/karnataka/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Karnataka district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Karnataka district canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Karnataka | NAVII GPS INDIA</title>`), `Invalid Karnataka district title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Karnataka district H1: ${route}`);
  assert.ok(html.includes(`${name} District, Karnataka`), `Karnataka district name missing: ${route}`);
  assert.ok(html.includes(`GPS tracker ${cities[0]}`), `Karnataka location keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Karnataka district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Karnataka district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Karnataka district orphaned from hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/karnataka"'), `Karnataka district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Karnataka Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Karnataka FAQ schema: ${route}`);
}

console.log("PASS: 31 rendered Karnataka district pages; keywords, canonical, schema, sitemap and hub links verified.");
