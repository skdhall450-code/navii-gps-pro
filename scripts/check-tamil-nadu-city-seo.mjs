import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const citySource = readFileSync("lib/seo/tamilNaduCities.ts", "utf8");
const citySeeds = citySource.split("\n")
  .filter((line) => /^\s{2}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtSource = readFileSync("lib/seo/tamilNaduDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtMap = new Map(districtSeeds.map(([slug, name, cities, , sourceUrl]) => [slug, { name, cities, sourceUrl }]));

const reviewedInventory = {
  chennai: ["ambattur", "sholinganallur"], chengalpattu: ["tambaram", "madurantakam"],
  kancheepuram: ["sriperumbudur", "uthiramerur"], tiruvallur: ["avadi", "gummidipoondi"],
  ranipet: ["arcot", "arakkonam"], vellore: ["gudiyatham", "katpadi"],
  tirupathur: ["vaniyambadi", "ambur"], tiruvannamalai: ["arani", "cheyyar"],
  viluppuram: ["tindivanam", "gingee"], kallakurichi: ["ulundurpet", "tirukoilur"],
  cuddalore: ["neyveli", "chidambaram"], coimbatore: ["pollachi", "mettupalayam"],
  tiruppur: ["udumalaipettai", "avinashi"], erode: ["perundurai", "bhavani"],
  salem: ["mettur", "attur"], namakkal: ["tiruchengode", "rasipuram"],
  dharmapuri: ["harur", "palacode"], krishnagiri: ["hosur", "denkanikottai"],
  nilgiris: ["udhagamandalam", "coonoor"], tiruchirappalli: ["srirangam", "manapparai"],
  karur: ["kulithalai", "aravakurichi"], perambalur: ["kunnam", "alathur"],
  ariyalur: ["jayankondam", "udayarpalayam"], dindigul: ["palani", "oddanchatram"],
  pudukkottai: ["aranthangi", "alangudi"], thanjavur: ["kumbakonam", "pattukkottai"],
  tiruvarur: ["mannargudi", "thiruthuraipoondi"], nagapattinam: ["vedaranyam", "kilvelur"],
  mayiladuthurai: ["sirkazhi", "tharangambadi"], madurai: ["melur", "thirumangalam"],
  theni: ["periyakulam", "cumbum"], sivaganga: ["karaikudi", "devakottai"],
  ramanathapuram: ["rameswaram", "paramakudi"], virudhunagar: ["sivakasi", "rajapalayam"],
  thoothukudi: ["kovilpatti", "tiruchendur"], tirunelveli: ["ambasamudram", "nanguneri"],
  tenkasi: ["sankarankovil", "kadayanallur"], kanniyakumari: ["nagercoil", "marthandam"],
};
const expectedRoutes = Object.entries(reviewedInventory).flatMap(([district, towns]) => towns.map((town) => `${district}/${town}`));

assert.equal(citySeeds.length, 76, "Expected 76 reviewed Tamil Nadu city and town records");
assert.equal(Object.keys(reviewedInventory).length, 38, "Expected reviewed towns for all 38 districts");
assert.deepEqual(citySeeds.map(([district, slug]) => `${district}/${slug}`).sort(), expectedRoutes.sort(), "Published Tamil Nadu town inventory changed");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 76, "Duplicate Tamil Nadu town route");
assert.equal(new Set(citySeeds.map(([, , , focus]) => focus)).size, 76, "Repeated Tamil Nadu town focus");

for (const [districtSlug, slug, name, focus] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Tamil Nadu district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Tamil Nadu town: ${districtSlug}/${name}`);
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
const pageSource = readFileSync("components/seo/TamilNaduCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/TamilNaduDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("tamilNaduCities.map"), "Tamil Nadu town static params are missing");
assert.ok(routeSource.includes("generateTamilNaduCityMetadata"), "Tamil Nadu town metadata wiring is missing");
assert.ok(routeSource.includes("TamilNaduCityGpsPage"), "Tamil Nadu town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Tamil Nadu district-to-town links are missing");
assert.ok(hubSource.includes("tamilNaduCities.map"), "Tamil Nadu state-to-town links are missing");
assert.ok(sitemapSource.includes("tamilNaduCityRoutes"), "Tamil Nadu town sitemap routes are missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Tamil Nadu town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Tamil Nadu town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 76 reviewed Tamil Nadu towns across all 38 districts; inventory, mappings, unique workflows and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/tamil-nadu.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  const route = `/gps-tracker/tamil-nadu/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Tamil Nadu town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Tamil Nadu town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${district.name} | NAVII GPS INDIA</title>`), `Invalid Tamil Nadu town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Tamil Nadu town H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name}`), `Tamil Nadu town keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Tamil Nadu town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Tamil Nadu town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Tamil Nadu town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/tamil-nadu/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Tamil Nadu town orphaned from district: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/tamil-nadu/${districtSlug}"`), `Tamil Nadu town missing parent link: ${route}`);
  const sibling = reviewedInventory[districtSlug].find((town) => town !== slug);
  assert.ok(html.includes(`href="/gps-tracker/tamil-nadu/${districtSlug}/${sibling}"`), `Tamil Nadu town missing sibling link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Tamil Nadu town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Tamil Nadu town FAQ schema: ${route}`);
}

console.log("PASS: 76 rendered Tamil Nadu town pages; canonical, schema, sitemap, state, district and sibling links verified.");
