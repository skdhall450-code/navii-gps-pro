import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/maharashtraDistricts.ts", "utf8");
const districtSeeds = dataSource.split("\n")
  .filter((line) => /^\s+\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "mumbai-city", "mumbai-suburban", "thane", "palghar", "raigad", "ratnagiri", "sindhudurg",
  "pune", "satara", "sangli", "solapur", "kolhapur", "nashik", "dhule", "nandurbar", "jalgaon",
  "ahilyanagar", "chhatrapati-sambhajinagar", "jalna", "beed", "dharashiv", "latur", "nanded",
  "parbhani", "hingoli", "amravati", "akola", "buldhana", "washim", "yavatmal", "nagpur",
  "wardha", "bhandara", "gondia", "chandrapur", "gadchiroli",
];

assert.equal(districtSeeds.length, 36, "Expected all 36 Maharashtra districts");
assert.deepEqual(districtSeeds.map(([slug]) => slug).sort(), expectedSlugs.sort());
assert.equal(new Set(districtSeeds.map(([slug]) => slug)).size, 36, "Duplicate Maharashtra district slugs");
assert.equal(new Set(districtSeeds.map(([, name]) => name)).size, 36, "Duplicate Maharashtra district names");
assert.equal(new Set(districtSeeds.map(([, , , routeProfile]) => routeProfile)).size, 36, "Duplicate Maharashtra route profiles");

for (const [slug, name, cities, routeProfile] of districtSeeds) {
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid district slug: ${slug}`);
  assert.ok(name.length >= 3, `Invalid district name: ${slug}`);
  assert.equal(cities.length, 4, `Expected four district locations: ${slug}`);
  assert.equal(new Set(cities).size, cities.length, `Duplicate district locations: ${slug}`);
  assert.ok(routeProfile.length > 70, `District route profile is too short: ${slug}`);
}
assert.ok(dataSource.includes('const officialSource = "https://plan.maharashtra.gov.in/en/36-districts/"'), "Official Maharashtra district source is missing");

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/MaharashtraDistrictGpsPage.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("maharashtraDistricts.map"), "Automatic Maharashtra district static params are missing");
assert.ok(routeSource.includes("generateMaharashtraDistrictMetadata"), "Automatic Maharashtra district metadata is missing");
assert.ok(routeSource.includes("MaharashtraDistrictGpsPage"), "Maharashtra district page routing is missing");
assert.ok(hubSource.includes('state.slug === "maharashtra" ? maharashtraDistricts'), "Maharashtra hub-to-district links are missing");
assert.ok(sitemapSource.includes("maharashtraDistrictRoutes"), "Automatic Maharashtra district sitemap routes are missing");
assert.ok(dataSource.includes("district.cities.flatMap"), "Automatic Maharashtra location keyword generation is missing");
assert.ok(dataSource.includes("वाहन GPS ट्रॅकर"), "Marathi-intent district keyword generation is missing");
assert.ok(pageSource.includes('"@type": "Service"'), "Maharashtra district Service schema is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Maharashtra district FAQ schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 36 Maharashtra districts with official sources, local keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/maharashtra.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");
assert.ok(hubHtml.includes("<title>GPS Tracker in Maharashtra | Vehicle Tracking System | NAVII GPS INDIA</title>"), "Invalid Maharashtra hub title");
assert.ok(!hubHtml.includes("NAVII GPS | NAVII GPS INDIA"), "Duplicate brand in Maharashtra hub title");

for (const [slug, name, cities] of districtSeeds) {
  const route = `/gps-tracker/maharashtra/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Maharashtra district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Maharashtra district canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Maharashtra | NAVII GPS INDIA</title>`), `Invalid Maharashtra district title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Maharashtra district H1: ${route}`);
  assert.ok(html.includes(`${name} District, Maharashtra`), `Maharashtra district name missing: ${route}`);
  assert.ok(html.includes(`GPS tracker ${cities[0]}`), `Maharashtra location keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Maharashtra district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Maharashtra district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Maharashtra district orphaned from hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/maharashtra"'), `Maharashtra district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Maharashtra Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Maharashtra FAQ schema: ${route}`);
}

console.log("PASS: 36 rendered Maharashtra district pages; keywords, canonical, schema, sitemap and hub links verified.");
