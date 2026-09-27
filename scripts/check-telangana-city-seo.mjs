import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const citySource = readFileSync("lib/seo/telanganaCities.ts", "utf8");
const citySeeds = citySource.split("\n")
  .filter((line) => /^\s{2}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtSource = readFileSync("lib/seo/telanganaDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtMap = new Map(districtSeeds.map(([slug, name, cities, , sourceUrl]) => [slug, { name, cities, sourceUrl }]));

const reviewedInventory = {
  adilabad: ["utnoor", "boath"], "bhadradri-kothagudem": ["kothagudem", "bhadrachalam"],
  hanumakonda: ["kazipet", "parkal"], hyderabad: ["secunderabad", "charminar"],
  jagtial: ["korutla", "metpally"], jangaon: ["ghanpur-station", "palakurthi"],
  "jayashankar-bhupalpally": ["mahadevpur", "kataram"], "jogulamba-gadwal": ["alampur", "ieeja"],
  kamareddy: ["banswada", "yellareddy"], karimnagar: ["huzurabad", "choppadandi"],
  khammam: ["madhira", "sathupalli"], "komaram-bheem-asifabad": ["kagaznagar", "sirpur"],
  mahabubabad: ["dornakal", "thorrur"], mahabubnagar: ["jadcherla", "devarkadra"],
  mancherial: ["bellampalli", "mandamarri"], medak: ["narsapur", "toopran"],
  "medchal-malkajgiri": ["malkajgiri", "quthbullapur"], mulugu: ["eturnagaram", "govindaraopet"],
  nagarkurnool: ["kollapur", "kalwakurthy"], nalgonda: ["miryalaguda", "devarakonda"],
  narayanpet: ["makthal", "kosgi"], nirmal: ["bhainsa", "khanapur"],
  nizamabad: ["bodhan", "armoor"], peddapalli: ["ramagundam", "manthani"],
  "rajanna-sircilla": ["vemulawada", "mustabad"], "ranga-reddy": ["shamshabad", "shadnagar"],
  sangareddy: ["patancheru", "zaheerabad"], siddipet: ["gajwel", "husnabad"],
  suryapet: ["kodad", "huzurnagar"], vikarabad: ["tandur", "pargi"],
  wanaparthy: ["pebbair", "atmakur"], warangal: ["narsampet", "wardhannapet"],
  "yadadri-bhuvanagiri": ["yadagirigutta", "choutuppal"],
};
const expectedRoutes = Object.entries(reviewedInventory).flatMap(([district, towns]) => towns.map((town) => `${district}/${town}`));

assert.equal(citySeeds.length, 66, "Expected 66 reviewed Telangana city and town records");
assert.equal(Object.keys(reviewedInventory).length, 33, "Expected reviewed towns for all 33 current districts");
assert.deepEqual(citySeeds.map(([district, slug]) => `${district}/${slug}`).sort(), expectedRoutes.sort(), "Published Telangana town inventory changed");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 66, "Duplicate Telangana town route");
assert.equal(new Set(citySeeds.map(([, , , focus]) => focus)).size, 66, "Repeated Telangana town focus");

for (const [districtSlug, slug, name, focus] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Telangana district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Telangana town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would redirect to its district: ${districtSlug}/${slug}`);
  assert.equal(slug, name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), `Town slug must match name: ${districtSlug}/${slug}`);
  assert.ok(focus.length > 55, `Town focus is too short: ${districtSlug}/${slug}`);
  assert.match(new URL(district.sourceUrl).hostname, /\.telangana\.gov\.in$/, `Expected official district source: ${districtSlug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}

for (const districtSlug of districtMap.keys()) {
  assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);
}

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/TelanganaCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/TelanganaDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("telanganaCities.map"), "Telangana town static params are missing");
assert.ok(routeSource.includes("generateTelanganaCityMetadata"), "Telangana town metadata wiring is missing");
assert.ok(routeSource.includes("TelanganaCityGpsPage"), "Telangana town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Telangana district-to-town links are missing");
assert.ok(hubSource.includes("telanganaCities.map"), "Telangana state-to-town links are missing");
assert.ok(sitemapSource.includes("telanganaCityRoutes"), "Telangana town sitemap routes are missing");
assert.ok(citySource.includes("వాహన GPS ట్రాకర్"), "Telugu-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Telangana town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Telangana town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 66 reviewed Telangana towns across all 33 districts; inventory, official district sources, mappings, unique workflows and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/telangana.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  const route = `/gps-tracker/telangana/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Telangana town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Telangana town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${district.name} | NAVII GPS INDIA</title>`), `Invalid Telangana town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Telangana town H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name}`), `Telangana town keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Telangana town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Telangana town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Telangana town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/telangana/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Telangana town orphaned from district: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/telangana/${districtSlug}"`), `Telangana town missing parent link: ${route}`);
  const sibling = reviewedInventory[districtSlug].find((town) => town !== slug);
  assert.ok(html.includes(`href="/gps-tracker/telangana/${districtSlug}/${sibling}"`), `Telangana town missing paired-town link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Telangana town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Telangana town FAQ schema: ${route}`);
}

console.log("PASS: 66 rendered Telangana town pages; canonical, schema, sitemap, state, district and paired-town links verified.");
