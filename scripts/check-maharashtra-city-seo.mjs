import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const citySource = readFileSync("lib/seo/maharashtraCities.ts", "utf8");
const citySeeds = citySource.split("\n")
  .filter((line) => /^\s{2}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtSource = readFileSync("lib/seo/maharashtraDistricts.ts", "utf8");
const districtSeeds = districtSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));
const districtMap = new Map(districtSeeds.map(([slug, name, cities]) => [slug, { name, cities }]));

const reviewedInventory = {
  "mumbai-city": ["fort", "colaba"], "mumbai-suburban": ["andheri", "borivali"],
  thane: ["kalyan", "bhiwandi"], palghar: ["vasai", "boisar"], raigad: ["panvel", "uran"],
  ratnagiri: ["chiplun", "dapoli"], sindhudurg: ["kudal", "sawantwadi"],
  pune: ["pimpri-chinchwad", "baramati"], satara: ["karad", "phaltan"], sangli: ["miraj", "tasgaon"],
  solapur: ["pandharpur", "barshi"], kolhapur: ["ichalkaranji", "jaysingpur"],
  nashik: ["malegaon", "sinnar"], dhule: ["shirpur", "dondaicha"], nandurbar: ["shahada", "navapur"],
  jalgaon: ["bhusawal", "chalisgaon"], ahilyanagar: ["shirdi", "sangamner"],
  "chhatrapati-sambhajinagar": ["paithan", "sillod"], jalna: ["ambad", "partur"],
  beed: ["ambajogai", "parli"], dharashiv: ["tuljapur", "umarga"], latur: ["udgir", "nilanga"],
  nanded: ["deglur", "kinwat"], parbhani: ["jintur", "gangakhed"], hingoli: ["basmath", "aundha-nagnath"],
  amravati: ["achalpur", "morshi"], akola: ["akot", "murtizapur"], buldhana: ["khamgaon", "shegaon"],
  washim: ["karanja", "risod"], yavatmal: ["wani", "pusad"],
  nagpur: ["kamptee", "hingna"], wardha: ["hinganghat", "pulgaon"], bhandara: ["tumsar", "sakoli"],
  gondia: ["tirora", "amgaon"], chandrapur: ["ballarpur", "warora"], gadchiroli: ["armori", "aheri"],
};
const expectedRoutes = Object.entries(reviewedInventory).flatMap(([district, towns]) => towns.map((town) => `${district}/${town}`));

assert.equal(citySeeds.length, 72, "Expected 72 reviewed Maharashtra city and town records");
assert.equal(Object.keys(reviewedInventory).length, 36, "Expected reviewed locations for all 36 current districts");
assert.deepEqual(citySeeds.map(([district, slug]) => `${district}/${slug}`).sort(), expectedRoutes.sort(), "Published Maharashtra town inventory changed");
assert.equal(new Set(citySeeds.map(([district, slug]) => `${district}/${slug}`)).size, 72, "Duplicate Maharashtra town route");
assert.equal(new Set(citySeeds.map(([, , , focus]) => focus)).size, 72, "Repeated Maharashtra town focus");

for (const [districtSlug, slug, name, focus] of citySeeds) {
  const district = districtMap.get(districtSlug);
  assert.ok(district, `Unknown Maharashtra district: ${districtSlug}`);
  assert.ok(district.cities.includes(name), `Unmapped Maharashtra town: ${districtSlug}/${name}`);
  assert.notEqual(slug, districtSlug, `Town route would duplicate its district: ${districtSlug}/${slug}`);
  assert.equal(slug, name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), `Town slug must match name: ${districtSlug}/${slug}`);
  assert.ok(focus.length > 70, `Town focus is too short: ${districtSlug}/${slug}`);
  assert.ok(!existsSync(`app/gps-tracker/${slug}/page.tsx`), `Existing flat route would compete: ${slug}`);
}
for (const districtSlug of districtMap.keys()) assert.equal(citySeeds.filter(([slug]) => slug === districtSlug).length, 2, `Expected two reviewed towns: ${districtSlug}`);

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/[city]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/MaharashtraCityGpsPage.tsx", "utf8");
const districtPageSource = readFileSync("components/seo/MaharashtraDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("maharashtraCities.map"), "Maharashtra town static params are missing");
assert.ok(routeSource.includes("generateMaharashtraCityMetadata"), "Maharashtra town metadata wiring is missing");
assert.ok(routeSource.includes("MaharashtraCityGpsPage"), "Maharashtra town page routing is missing");
assert.ok(districtPageSource.includes("cityGuides.map"), "Maharashtra district-to-town links are missing");
assert.ok(!districtPageSource.includes("KERALA DISTRICT COVERAGE"), "Maharashtra district badge still references Kerala");
assert.ok(hubSource.includes("maharashtraCities.map"), "Maharashtra state-to-town links are missing");
assert.ok(sitemapSource.includes("maharashtraCityRoutes"), "Maharashtra town sitemap routes are missing");
assert.ok(citySource.includes("वाहन GPS ट्रॅकर"), "Marathi-intent town keyword generation is missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Maharashtra town FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "Place"'), "Maharashtra town Service place schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 72 reviewed Maharashtra cities and towns across all 36 districts; mappings, Marathi keywords, unique workflows and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/maharashtra.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [districtSlug, slug, name] of citySeeds) {
  const district = districtMap.get(districtSlug);
  const route = `/gps-tracker/maharashtra/${districtSlug}/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Maharashtra town page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Maharashtra town canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name}, ${district.name} | NAVII GPS INDIA</title>`), `Invalid Maharashtra town title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Maharashtra town H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name}`), `Maharashtra town keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Maharashtra town: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Maharashtra town missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Maharashtra town orphaned from state hub: ${route}`);
  const districtHtml = readFileSync(`${root}/gps-tracker/maharashtra/${districtSlug}.html`, "utf8");
  assert.ok(districtHtml.includes(`href="${route}"`), `Maharashtra town orphaned from district: ${route}`);
  assert.ok(html.includes(`href="/gps-tracker/maharashtra/${districtSlug}"`), `Maharashtra town missing parent link: ${route}`);
  const sibling = reviewedInventory[districtSlug].find((town) => town !== slug);
  assert.ok(html.includes(`href="/gps-tracker/maharashtra/${districtSlug}/${sibling}"`), `Maharashtra town missing paired-town link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "Place")), `Missing Maharashtra town Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Maharashtra town FAQ schema: ${route}`);
}

console.log("PASS: 72 rendered Maharashtra city and town pages; canonical, schema, sitemap, state, district and paired-town links verified.");
