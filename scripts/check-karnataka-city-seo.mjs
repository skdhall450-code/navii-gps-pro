import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const citySource = readFileSync("lib/seo/karnatakaCities.ts", "utf8");
const citySeeds = citySource.split("\n")
  .filter((line) => /^\s{2}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtSource = readFileSync("lib/seo/karnatakaDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtMap = new Map(districtSeeds.map(([slug, name, cities, , sourceUrl]) => [slug, { name, cities, sourceUrl }]));

const reviewedInventory = {
  "bengaluru-urban": ["yelahanka", "anekal"], "bengaluru-rural": ["devanahalli", "doddaballapura"],
  "bengaluru-south": ["channapatna", "kanakapura"], kolar: ["malur", "bangarapet"],
  chikkaballapura: ["gauribidanur", "chintamani"], tumakuru: ["tiptur", "kunigal"],
  mysuru: ["nanjangud", "hunsur"], mandya: ["maddur", "srirangapatna"],
  chamarajanagar: ["kollegal", "gundlupet"], hassan: ["sakleshpur", "arsikere"],
  kodagu: ["kushalnagar", "virajpet"], "dakshina-kannada": ["mangaluru", "puttur"],
  udupi: ["kundapura", "karkala"], "uttara-kannada": ["karwar", "sirsi"],
  chikkamagaluru: ["kadur", "mudigere"], shivamogga: ["bhadravati", "sagara"],
  chitradurga: ["hiriyur", "challakere"], davanagere: ["harihar", "channagiri"],
  belagavi: ["gokak", "chikkodi"], bagalkote: ["jamkhandi", "mudhol"],
  vijayapura: ["indi", "sindagi"], dharwad: ["hubballi", "kalghatgi"],
  gadag: ["gajendragad", "lakshmeshwar"], haveri: ["ranebennur", "byadgi"],
  ballari: ["siruguppa", "sandur"], vijayanagara: ["hosapete", "harapanahalli"],
  koppal: ["gangavati", "kushtagi"], raichur: ["sindhanur", "manvi"],
  kalaburagi: ["aland", "sedam"], bidar: ["basavakalyan", "bhalki"],
  yadgir: ["shahapur", "shorapur"],
};
const expectedRoutes = Object.entries(reviewedInventory).flatMap(([district, towns]) => towns.map((town) => `${district}/${town}`));

assert.equal(citySeeds.length, 62, "Expected 62 reviewed Karnataka city and town records");
assert.equal(Object.keys(reviewedInventory).length, 31, "Expected reviewed towns for all 31 districts");
assert.deepEqual(citySeeds.map(([district, slug]) => `${district}/${slug}`).sort(), expectedRoutes.sort(), "Published Karnataka town inventory changed");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 62, "Duplicate Karnataka town route");
assert.equal(new Set(citySeeds.map(([, , , focus]) => focus)).size, 62, "Repeated Karnataka town focus");

for (const [districtSlug, slug, name, focus] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Karnataka district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Karnataka town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would redirect to its district: ${districtSlug}/${slug}`);
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid town slug: ${slug}`);
  assert.ok(focus.length > 55, `Town focus is too short: ${districtSlug}/${slug}`);
  assert.match(new URL(district.sourceUrl).hostname, /\.nic\.in$/, `Expected official district source: ${districtSlug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}

for (const districtSlug of districtMap.keys()) {
  assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/KarnatakaCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/KarnatakaDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("karnatakaCities.map"), "Karnataka town static params are missing");
assert.ok(routeSource.includes("generateKarnatakaCityMetadata"), "Karnataka town metadata wiring is missing");
assert.ok(routeSource.includes("KarnatakaCityGpsPage"), "Karnataka town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Karnataka district-to-town links are missing");
assert.ok(hubSource.includes("karnatakaCities.map"), "Karnataka state-to-town links are missing");
assert.ok(sitemapSource.includes("karnatakaCityRoutes"), "Karnataka town sitemap routes are missing");
assert.ok(citySource.includes("ವಾಹನ GPS ಟ್ರ್ಯಾಕರ್"), "Kannada-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Karnataka town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Karnataka town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 62 reviewed Karnataka towns across all 31 districts; inventory, mappings, unique workflows and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/karnataka.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  const route = `/gps-tracker/karnataka/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Karnataka town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Karnataka town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${district.name} | NAVII GPS INDIA</title>`), `Invalid Karnataka town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Karnataka town H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name}`), `Karnataka town keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Karnataka town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Karnataka town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Karnataka town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/karnataka/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Karnataka town orphaned from district: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/karnataka/${districtSlug}"`), `Karnataka town missing parent link: ${route}`);
  const sibling = reviewedInventory[districtSlug].find((town) => town !== slug);
  assert.ok(html.includes(`href="/gps-tracker/karnataka/${districtSlug}/${sibling}"`), `Karnataka town missing sibling link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Karnataka town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Karnataka town FAQ schema: ${route}`);
}

console.log("PASS: 62 rendered Karnataka town pages; canonical, schema, sitemap, state, district and sibling links verified.");
