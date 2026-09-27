import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/gujaratDistricts.ts", "utf8");
const seeds = dataSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "ahmedabad", "amreli", "anand", "aravalli", "banaskantha", "bharuch", "bhavnagar", "botad",
  "chhota-udaipur", "dahod", "dang", "devbhoomi-dwarka", "gandhinagar", "gir-somnath", "jamnagar",
  "junagadh", "kheda", "kutch", "mahisagar", "mehsana", "morbi", "narmada", "navsari", "panchmahal",
  "patan", "porbandar", "rajkot", "sabarkantha", "surat", "surendranagar", "tapi", "vadodara", "valsad", "vav-tharad",
].sort();

assert.equal(seeds.length, 34, "Expected all 34 current Gujarat districts");
assert.deepEqual(seeds.map(([slug]) => slug).sort(), expectedSlugs, "Current Gujarat district inventory changed");
assert.equal(new Set(seeds.map(([slug]) => slug)).size, 34, "Duplicate Gujarat district slug");
assert.equal(new Set(seeds.map(([, name]) => name)).size, 34, "Duplicate Gujarat district name");
assert.equal(new Set(seeds.map(([, , , profile]) => profile)).size, 34, "Repeated Gujarat route profile");

for (const [slug, name, cities, profile] of seeds) {
  assert.equal(cities.length, 4, `Expected four local discovery locations: ${slug}`);
  assert.equal(new Set(cities).size, 4, `Duplicate local discovery location: ${slug}`);
  assert.ok(profile.length > 55, `Route profile is too short: ${slug}`);
  assert.ok(name.length > 2, `Invalid district name: ${slug}`);
}
assert.ok(seeds.some(([slug, name]) => slug === "vav-tharad" && name === "Vav-Tharad"), "New Vav-Tharad district is missing");
assert.ok(dataSource.includes("34 current Gujarat districts") || dataSource.includes("Vav-Tharad reorganisation"), "Current Gujarat structure note is missing");
assert.ok(dataSource.includes("climatetracker.gujarat.gov.in/en/district-wise-emissions"), "Official current Gujarat district source is missing");
assert.ok(dataSource.includes("વાહન GPS ટ્રેકર") && dataSource.includes("જીપીએસ ટ્રેકર"), "Gujarati-intent keyword generation is missing");

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/GujaratDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("gujaratDistricts.map"), "Gujarat district static params are missing");
assert.ok(routeSource.includes("generateGujaratDistrictMetadata"), "Gujarat district metadata wiring is missing");
assert.ok(routeSource.includes("GujaratDistrictGpsPage"), "Gujarat district page routing is missing");
assert.ok(hubSource.includes('slug === "gujarat"') && hubSource.includes("34 current Gujarat districts"), "Gujarat state metadata is missing");
assert.ok(hubSource.includes('state.slug === "gujarat" ? gujaratDistricts'), "Gujarat state-to-district links are missing");
assert.ok(sitemapSource.includes("gujaratDistrictRoutes"), "Gujarat district sitemap routes are missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Gujarat FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "AdministrativeArea"'), "Gujarat Service area schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 34 current Gujarat districts including Vav-Tharad; official source, Gujarati keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/gujarat.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [slug, name] of seeds) {
  const route = `/gps-tracker/gujarat/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Gujarat district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Gujarat canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Gujarat | NAVII GPS INDIA</title>`), `Invalid Gujarat title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Gujarat district H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name} District, Gujarat`), `Gujarat keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Gujarat district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Gujarat district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Gujarat district orphaned from state hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/gujarat"'), `Gujarat district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Gujarat Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Gujarat FAQ schema: ${route}`);
}

console.log("PASS: 34 rendered Gujarat district pages; keywords, canonical, schema, sitemap and hub links verified.");
