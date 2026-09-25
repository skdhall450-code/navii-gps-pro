import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const citySource = readFileSync("lib/seo/andhraPradeshCities.ts", "utf8");
const citySeeds = citySource.split("\n")
  .filter((line) => /^\s{2}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtSource = readFileSync("lib/seo/andhraPradeshDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtMap = new Map(districtSeeds.map(([slug, name, cities, , sourceUrl]) => [slug, { name, cities, sourceUrl }]));

const reviewedInventory = {
  "alluri-sitharama-raju": ["paderu", "araku-valley"], anakapalli: ["narsipatnam", "chodavaram"],
  ananthapuramu: ["guntakal", "tadipatri"], annamayya: ["rayachoti", "madanapalle"],
  bapatla: ["chirala", "repalle"], chittoor: ["palamaner", "kuppam"],
  "dr-br-ambedkar-konaseema": ["amalapuram", "mummidivaram"], "east-godavari": ["rajamahendravaram", "kovvur"],
  eluru: ["jangareddygudem", "nuzvid"], guntur: ["tenali", "mangalagiri"],
  kakinada: ["tuni", "pithapuram"], krishna: ["machilipatnam", "gudivada"],
  kurnool: ["adoni", "yemmiganur"], markapuram: ["giddalur", "kanigiri"],
  nandyal: ["dhone", "atmakur"], ntr: ["vijayawada", "nandigama"],
  palnadu: ["narasaraopet", "sattenapalle"], "parvathipuram-manyam": ["parvathipuram", "salur"],
  polavaram: ["rampachodavaram", "chinturu"], prakasam: ["ongole", "kandukur"],
  "spsr-nellore": ["nellore", "kavali"], "sri-sathya-sai": ["puttaparthi", "hindupur"],
  srikakulam: ["palasa", "tekkali"], tirupati: ["srikalahasti", "sullurpeta"],
  visakhapatnam: ["gajuwaka", "bheemunipatnam"], vizianagaram: ["bobbili", "cheepurupalli"],
  "west-godavari": ["bhimavaram", "narasapuram"], "ysr-kadapa": ["kadapa", "proddatur"],
};
const expectedRoutes = Object.entries(reviewedInventory).flatMap(([district, towns]) => towns.map((town) => `${district}/${town}`));

assert.equal(citySeeds.length, 56, "Expected 56 reviewed Andhra Pradesh city and town records");
assert.equal(Object.keys(reviewedInventory).length, 28, "Expected reviewed towns for all 28 current districts");
assert.deepEqual(citySeeds.map(([district, slug]) => `${district}/${slug}`).sort(), expectedRoutes.sort(), "Published Andhra Pradesh town inventory changed");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 56, "Duplicate Andhra Pradesh town route");
assert.equal(new Set(citySeeds.map(([, , , focus]) => focus)).size, 56, "Repeated Andhra Pradesh town focus");

for (const [districtSlug, slug, name, focus] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Andhra Pradesh district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Andhra Pradesh town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would redirect to its district: ${districtSlug}/${slug}`);
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid town slug: ${slug}`);
  assert.ok(focus.length > 55, `Town focus is too short: ${districtSlug}/${slug}`);
  assert.match(new URL(district.sourceUrl).hostname, /\.ap\.gov\.in$/, `Expected official district source: ${districtSlug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}

for (const districtSlug of districtMap.keys()) {
  assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/AndhraPradeshCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/AndhraPradeshDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("andhraPradeshCities.map"), "Andhra Pradesh town static params are missing");
assert.ok(routeSource.includes("generateAndhraPradeshCityMetadata"), "Andhra Pradesh town metadata wiring is missing");
assert.ok(routeSource.includes("AndhraPradeshCityGpsPage"), "Andhra Pradesh town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Andhra Pradesh district-to-town links are missing");
assert.ok(hubSource.includes("andhraPradeshCities.map"), "Andhra Pradesh state-to-town links are missing");
assert.ok(sitemapSource.includes("andhraPradeshCityRoutes"), "Andhra Pradesh town sitemap routes are missing");
assert.ok(citySource.includes("వాహన GPS ట్రాకర్"), "Telugu-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Andhra Pradesh town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Andhra Pradesh town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 56 reviewed Andhra Pradesh towns across all 28 districts; inventory, mappings, unique workflows and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/andhra-pradesh.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  const route = `/gps-tracker/andhra-pradesh/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Andhra Pradesh town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Andhra Pradesh town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${district.name} | NAVII GPS INDIA</title>`), `Invalid Andhra Pradesh town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Andhra Pradesh town H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name}`), `Andhra Pradesh town keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Andhra Pradesh town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Andhra Pradesh town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Andhra Pradesh town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/andhra-pradesh/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Andhra Pradesh town orphaned from district: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/andhra-pradesh/${districtSlug}"`), `Andhra Pradesh town missing parent link: ${route}`);
  const sibling = reviewedInventory[districtSlug].find((town) => town !== slug);
  assert.ok(html.includes(`href="/gps-tracker/andhra-pradesh/${districtSlug}/${sibling}"`), `Andhra Pradesh town missing sibling link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Andhra Pradesh town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Andhra Pradesh town FAQ schema: ${route}`);
}

console.log("PASS: 56 rendered Andhra Pradesh town pages; canonical, schema, sitemap, state, district and sibling links verified.");
