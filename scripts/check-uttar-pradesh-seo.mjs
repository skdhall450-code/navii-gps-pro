import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/uttarPradeshDistricts.ts", "utf8");
const districtSeeds = dataSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "agra", "firozabad", "mainpuri", "mathura", "aligarh", "etah", "hathras", "kasganj",
  "ayodhya", "ambedkar-nagar", "amethi", "barabanki", "sultanpur", "azamgarh", "ballia", "mau",
  "bareilly", "badaun", "pilibhit", "shahjahanpur", "basti", "sant-kabir-nagar", "siddharthnagar",
  "banda", "chitrakoot", "hamirpur", "mahoba", "bahraich", "balrampur", "gonda", "shravasti",
  "deoria", "gorakhpur", "kushinagar", "maharajganj", "jalaun", "jhansi", "lalitpur", "auraiya",
  "etawah", "farrukhabad", "kannauj", "kanpur-dehat", "kanpur-nagar", "hardoi", "lakhimpur-kheri",
  "lucknow", "raebareli", "sitapur", "unnao", "baghpat", "bulandshahr", "gautam-buddha-nagar",
  "ghaziabad", "hapur", "meerut", "mirzapur", "bhadohi", "sonbhadra", "amroha", "bijnor",
  "moradabad", "rampur", "sambhal", "fatehpur", "kaushambi", "pratapgarh", "prayagraj",
  "muzaffarnagar", "saharanpur", "shamli", "chandauli", "ghazipur", "jaunpur", "varanasi",
];

assert.equal(districtSeeds.length, 75, "Expected all 75 Uttar Pradesh districts");
assert.deepEqual(districtSeeds.map(([slug]) => slug).sort(), expectedSlugs.sort());
assert.equal(new Set(districtSeeds.map(([slug]) => slug)).size, 75, "Duplicate Uttar Pradesh district slugs");
assert.equal(new Set(districtSeeds.map(([, name]) => name)).size, 75, "Duplicate Uttar Pradesh district names");
assert.equal(new Set(districtSeeds.map(([, , , routeProfile]) => routeProfile)).size, 75, "Duplicate district route profiles");

for (const [slug, name, cities, routeProfile] of districtSeeds) {
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid district slug: ${slug}`);
  assert.ok(name.length >= 3, `Invalid district name: ${slug}`);
  assert.ok(cities.length >= 4, `Expected four district locations: ${slug}`);
  assert.equal(new Set(cities).size, cities.length, `Duplicate district locations: ${slug}`);
  assert.ok(routeProfile.length > 55, `District route profile is too short: ${slug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/UttarPradeshDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("uttarPradeshDistricts.map"), "Automatic UP district static params are missing");
assert.ok(routeSource.includes("generateUttarPradeshDistrictMetadata"), "Automatic UP district metadata is missing");
assert.ok(routeSource.includes("UttarPradeshDistrictGpsPage"), "UP district page routing is missing");
assert.ok(hubSource.includes('state.slug === "uttar-pradesh" ? uttarPradeshDistricts'), "UP hub-to-district links are missing");
assert.ok(sitemapSource.includes("uttarPradeshDistrictRoutes"), "Automatic UP district sitemap routes are missing");
assert.ok(dataSource.includes("district.cities.flatMap"), "Automatic UP location keyword generation is missing");
assert.ok(pageSource.includes('"@type": "Service"'), "UP district Service schema is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "UP district FAQ schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 75 Uttar Pradesh districts with local keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/uttar-pradesh.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [slug, name, cities] of districtSeeds) {
  const route = `/gps-tracker/uttar-pradesh/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered UP district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid UP district canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Uttar Pradesh | NAVII GPS INDIA</title>`), `Invalid UP district title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one UP district H1: ${route}`);
  assert.ok(html.includes(`${name} District, Uttar Pradesh`), `UP district name missing: ${route}`);
  assert.ok(html.includes(`GPS tracker ${cities[0]}`), `UP location keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed UP district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `UP district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `UP district orphaned from hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/uttar-pradesh"'), `UP district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing UP Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing UP FAQ schema: ${route}`);
}

console.log("PASS: 75 rendered Uttar Pradesh district pages; keywords, canonical, schema, sitemap and hub links verified.");
