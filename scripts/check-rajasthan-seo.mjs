import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/rajasthanDistricts.ts", "utf8");
const seeds = dataSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "ajmer", "alwar", "balotra", "banswara", "baran", "barmer", "beawar", "bharatpur", "bhilwara", "bikaner", "bundi", "chittorgarh", "churu", "dausa", "deeg", "dholpur", "didwana-kuchaman", "dungarpur", "hanumangarh", "jaipur", "jaisalmer", "jalore", "jhalawar", "jhunjhunu", "jodhpur", "karauli", "khairthal-tijara", "kota", "kotputli-behror", "nagaur", "pali", "phalodi", "pratapgarh", "rajsamand", "salumbar", "sawai-madhopur", "sikar", "sirohi", "sri-ganganagar", "tonk", "udaipur"
].sort();
assert.equal(seeds.length, 41, "Expected all 41 current Rajasthan districts");
assert.deepEqual(seeds.map(([slug]) => slug).sort(), expectedSlugs, "Current Rajasthan district inventory changed");
assert.equal(new Set(seeds.map(([slug]) => slug)).size, 41, "Duplicate Rajasthan district slug");
assert.equal(new Set(seeds.map(([, name]) => name)).size, 41, "Duplicate Rajasthan district name");
assert.equal(new Set(seeds.map(([, , , profile]) => profile)).size, 41, "Repeated Rajasthan route profile");

for (const [slug, name, cities, profile] of seeds) {
  assert.equal(cities.length, 4, `Expected four local discovery locations: ${slug}`);
  assert.equal(new Set(cities).size, 4, `Duplicate local discovery location: ${slug}`);
  assert.ok(profile.length > 40, `Route profile is too short: ${slug}`);
  assert.ok(name.length > 2, `Invalid district name: ${slug}`);
}
assert.ok(dataSource.includes("dmrelief.rajasthan.gov.in/content/raj/dmr/en/plans/district-dm-plans.html"), "Official current Rajasthan district source is missing");
assert.ok(dataSource.includes("वाहन GPS ट्रैकर") && dataSource.includes("जीपीएस ट्रैकर"), "Hindi-intent keyword generation is missing");

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/RajasthanDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("rajasthanDistricts.map"), "Rajasthan district static params are missing");
assert.ok(routeSource.includes("generateRajasthanDistrictMetadata"), "Rajasthan district metadata wiring is missing");
assert.ok(routeSource.includes("RajasthanDistrictGpsPage"), "Rajasthan district page routing is missing");
assert.ok(hubSource.includes('slug === "rajasthan"') && hubSource.includes("41 current Rajasthan districts"), "Rajasthan state metadata is missing");
assert.ok(hubSource.includes('state.slug === "rajasthan" ? rajasthanDistricts'), "Rajasthan state-to-district links are missing");
assert.ok(sitemapSource.includes("rajasthanDistrictRoutes"), "Rajasthan district sitemap routes are missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Rajasthan FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "AdministrativeArea"'), "Rajasthan Service area schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 41 current Rajasthan districts with official source, Hindi keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/rajasthan.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [slug, name] of seeds) {
  const route = `/gps-tracker/rajasthan/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Rajasthan district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Rajasthan canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Rajasthan | NAVII GPS INDIA</title>`), `Invalid Rajasthan title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Rajasthan district H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name} District, Rajasthan`), `Rajasthan keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Rajasthan district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Rajasthan district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Rajasthan district orphaned from state hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/rajasthan"'), `Rajasthan district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Rajasthan Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Rajasthan FAQ schema: ${route}`);
}

console.log("PASS: 41 rendered Rajasthan district pages; keywords, canonical, schema, sitemap and hub links verified.");
