import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/chhattisgarhDistricts.ts", "utf8");
const seeds = dataSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "balod", "baloda-bazar-bhatapara", "balrampur-ramanujganj", "bastar", "bemetara", "bijapur", "bilaspur", "dantewada", "dhamtari", "durg", "gariaband", "gaurela-pendra-marwahi", "janjgir-champa", "jashpur", "kabirdham", "kanker", "khairagarh-chhuikhadan-gandai", "kondagaon", "korba", "koriya", "mahasamund", "manendragarh-chirmiri-bharatpur", "mohla-manpur-ambagarh-chowki", "mungeli", "narayanpur", "raigarh", "raipur", "rajnandgaon", "sakti", "sarangarh-bilaigarh", "sukma", "surajpur", "surguja"
].sort();

assert.equal(seeds.length, 33, "Expected all 33 current Chhattisgarh districts");
assert.deepEqual(seeds.map(([slug]) => slug).sort(), expectedSlugs, "Current Chhattisgarh district inventory changed");
assert.equal(new Set(seeds.map(([slug]) => slug)).size, 33, "Duplicate Chhattisgarh district slug");
assert.equal(new Set(seeds.map(([, name]) => name)).size, 33, "Duplicate Chhattisgarh district name");
assert.equal(new Set(seeds.map(([, , , profile]) => profile)).size, 33, "Repeated Chhattisgarh route profile");
for (const [slug, name, cities, profile] of seeds) {
  assert.equal(cities.length, 4, `Expected four local discovery locations: ${slug}`);
  assert.equal(new Set(cities).size, 4, `Duplicate local discovery location: ${slug}`);
  assert.ok(profile.length > 40, `Route profile is too short: ${slug}`);
  assert.ok(name.length > 2, `Invalid district name: ${slug}`);
}
assert.ok(dataSource.includes("erojgar.cg.gov.in/LandingSite/en/Dist_Recruitments.aspx"), "Official current Chhattisgarh district source is missing");
assert.ok(dataSource.includes("वाहन GPS ट्रैकर") && dataSource.includes("जीपीएस ट्रैकर"), "Hindi-intent keyword generation is missing");

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/ChhattisgarhDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("chhattisgarhDistricts.map"), "Chhattisgarh district static params are missing");
assert.ok(routeSource.includes("generateChhattisgarhDistrictMetadata"), "Chhattisgarh district metadata wiring is missing");
assert.ok(routeSource.includes("ChhattisgarhDistrictGpsPage"), "Chhattisgarh district page routing is missing");
assert.ok(hubSource.includes('slug === "chhattisgarh"') && hubSource.includes("33 current Chhattisgarh districts"), "Chhattisgarh state metadata is missing");
assert.ok(hubSource.includes('state.slug === "chhattisgarh" ? chhattisgarhDistricts'), "Chhattisgarh state-to-district links are missing");
assert.ok(sitemapSource.includes("chhattisgarhDistrictRoutes"), "Chhattisgarh district sitemap routes are missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Chhattisgarh FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "AdministrativeArea"'), "Chhattisgarh Service area schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 33 current Chhattisgarh districts with official source, Hindi keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/chhattisgarh.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [slug, name] of seeds) {
  const route = `/gps-tracker/chhattisgarh/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Chhattisgarh district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Chhattisgarh canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Chhattisgarh | NAVII GPS INDIA</title>`), `Invalid Chhattisgarh title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Chhattisgarh district H1: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Chhattisgarh district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Chhattisgarh district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Chhattisgarh district orphaned from state hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/chhattisgarh"'), `Chhattisgarh district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Chhattisgarh Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Chhattisgarh FAQ schema: ${route}`);
}

console.log("PASS: 33 rendered Chhattisgarh district pages; keywords, canonical, schema, sitemap and hub links verified.");
