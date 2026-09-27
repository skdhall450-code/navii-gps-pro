import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const citySource = readFileSync("lib/seo/keralaCities.ts", "utf8");
const citySeeds = citySource.split("\n")
  .filter((line) => /^\s{2}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtSource = readFileSync("lib/seo/keralaDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s+\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtMap = new Map(districtSeeds.map(([slug, name, cities, , sourceUrl]) => [slug, { name, cities, sourceUrl }]));

const reviewedInventory = {
  thiruvananthapuram: ["neyyattinkara", "attingal"],
  kollam: ["punalur", "karunagappally"],
  pathanamthitta: ["adoor", "thiruvalla"],
  alappuzha: ["cherthala", "kayamkulam"],
  kottayam: ["changanassery", "pala"],
  idukki: ["thodupuzha", "munnar"],
  ernakulam: ["perumbavoor", "aluva"],
  thrissur: ["chalakudy", "irinjalakuda"],
  palakkad: ["ottapalam", "shoranur"],
  malappuram: ["manjeri", "perinthalmanna"],
  kozhikode: ["vadakara", "koyilandy"],
  wayanad: ["kalpetta", "mananthavady"],
  kannur: ["thalassery", "payyanur"],
  kasaragod: ["kanhangad", "nileshwaram"],
};
const expectedRoutes = Object.entries(reviewedInventory).flatMap(([district, towns]) => towns.map((town) => `${district}/${town}`));

assert.equal(citySeeds.length, 28, "Expected 28 reviewed Kerala city and town records");
assert.equal(Object.keys(reviewedInventory).length, 14, "Expected reviewed towns for all 14 current districts");
assert.deepEqual(citySeeds.map(([district, slug]) => `${district}/${slug}`).sort(), expectedRoutes.sort(), "Published Kerala town inventory changed");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 28, "Duplicate Kerala town route");
assert.equal(new Set(citySeeds.map(([, , , focus]) => focus)).size, 28, "Repeated Kerala town focus");

for (const [districtSlug, slug, name, focus] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Kerala district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Kerala town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would redirect to its district: ${districtSlug}/${slug}`);
  assert.equal(slug, name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), `Town slug must match name: ${districtSlug}/${slug}`);
  assert.ok(focus.length > 55, `Town focus is too short: ${districtSlug}/${slug}`);
  assert.match(new URL(district.sourceUrl).hostname, /\.nic\.in$/, `Expected official district source: ${districtSlug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}

for (const districtSlug of districtMap.keys()) {
  assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/KeralaCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/KeralaDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("keralaCities.map"), "Kerala town static params are missing");
assert.ok(routeSource.includes("generateKeralaCityMetadata"), "Kerala town metadata wiring is missing");
assert.ok(routeSource.includes("KeralaCityGpsPage"), "Kerala town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Kerala district-to-town links are missing");
assert.ok(hubSource.includes("keralaCities.map"), "Kerala state-to-town links are missing");
assert.ok(sitemapSource.includes("keralaCityRoutes"), "Kerala town sitemap routes are missing");
assert.ok(citySource.includes("വാഹന GPS ട്രാക്കർ"), "Malayalam-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Kerala town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Kerala town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 28 reviewed Kerala towns across all 14 districts; inventory, official district sources, mappings, unique workflows and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/kerala.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  const route = `/gps-tracker/kerala/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Kerala town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Kerala town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${district.name} | NAVII GPS INDIA</title>`), `Invalid Kerala town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Kerala town H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name}`), `Kerala town keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Kerala town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Kerala town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Kerala town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/kerala/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Kerala town orphaned from district: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/kerala/${districtSlug}"`), `Kerala town missing parent link: ${route}`);
  const sibling = reviewedInventory[districtSlug].find((town) => town !== slug);
  assert.ok(html.includes(`href="/gps-tracker/kerala/${districtSlug}/${sibling}"`), `Kerala town missing paired-town link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Kerala town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Kerala town FAQ schema: ${route}`);
}

console.log("PASS: 28 rendered Kerala town pages; canonical, schema, sitemap, state, district and paired-town links verified.");
