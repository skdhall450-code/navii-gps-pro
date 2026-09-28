import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const dataSource = readFileSync("lib/seo/madhyaPradeshDistricts.ts", "utf8");
const seeds = dataSource.split("\n")
  .filter((line) => /^\s{4}\["[a-z0-9-]+",\s*"/.test(line))
  .map((line) => JSON.parse(line.trim().replace(/,$/, "")));

const expectedSlugs = [
  "agar-malwa", "alirajpur", "anuppur", "ashoknagar", "balaghat", "barwani", "betul", "bhind", "bhopal", "burhanpur", "chhatarpur", "chhindwara", "damoh", "datia", "dewas", "dhar", "dindori", "guna", "gwalior", "harda", "indore", "jabalpur", "jhabua", "katni", "khandwa", "khargone", "maihar", "mandla", "mandsaur", "mauganj", "morena", "narmadapuram", "narsinghpur", "neemuch", "niwari", "pandhurna", "panna", "raisen", "rajgarh", "ratlam", "rewa", "sagar", "satna", "sehore", "seoni", "shahdol", "shajapur", "sheopur", "shivpuri", "sidhi", "singrauli", "tikamgarh", "ujjain", "umaria", "vidisha"
].sort();

assert.equal(seeds.length, 55, "Expected all 55 current Madhya Pradesh districts");
assert.deepEqual(seeds.map(([slug]) => slug).sort(), expectedSlugs, "Current Madhya Pradesh district inventory changed");
assert.equal(new Set(seeds.map(([slug]) => slug)).size, 55, "Duplicate Madhya Pradesh district slug");
assert.equal(new Set(seeds.map(([, name]) => name)).size, 55, "Duplicate Madhya Pradesh district name");
assert.equal(new Set(seeds.map(([, , , profile]) => profile)).size, 55, "Repeated Madhya Pradesh route profile");

for (const [slug, name, cities, profile] of seeds) {
  assert.equal(cities.length, 4, `Expected four local discovery locations: ${slug}`);
  assert.equal(new Set(cities).size, 4, `Duplicate local discovery location: ${slug}`);
  assert.ok(profile.length > 40, `Route profile is too short: ${slug}`);
  assert.ok(name.length > 2, `Invalid district name: ${slug}`);
}
assert.ok(dataSource.includes("ceoelection.mp.gov.in/DistrictWebsiteLink.aspx"), "Official current Madhya Pradesh district source is missing");
assert.ok(dataSource.includes("वाहन GPS ट्रैकर") && dataSource.includes("जीपीएस ट्रैकर"), "Hindi-intent keyword generation is missing");

const routeSource = readFileSync("app/gps-tracker/[state]/[district]/page.tsx", "utf8");
const pageSource = readFileSync("components/seo/MadhyaPradeshDistrictGpsPage.tsx", "utf8");
const hubSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
assert.ok(routeSource.includes("madhyaPradeshDistricts.map"), "Madhya Pradesh district static params are missing");
assert.ok(routeSource.includes("generateMadhyaPradeshDistrictMetadata"), "Madhya Pradesh district metadata wiring is missing");
assert.ok(routeSource.includes("MadhyaPradeshDistrictGpsPage"), "Madhya Pradesh district page routing is missing");
assert.ok(hubSource.includes('slug === "madhya-pradesh"') && hubSource.includes("55 current Madhya Pradesh districts"), "Madhya Pradesh state metadata is missing");
assert.ok(hubSource.includes('state.slug === "madhya-pradesh" ? madhyaPradeshDistricts'), "Madhya Pradesh state-to-district links are missing");
assert.ok(sitemapSource.includes("madhyaPradeshDistrictRoutes"), "Madhya Pradesh district sitemap routes are missing");
assert.ok(pageSource.includes('"@type": "FAQPage"'), "Madhya Pradesh FAQ schema is missing");
assert.ok(pageSource.includes('"@type": "AdministrativeArea"'), "Madhya Pradesh Service area schema is missing");

if (process.argv.includes("--source-only")) {
  console.log("PASS: 55 current Madhya Pradesh districts with official source, Hindi keywords, unique content and automatic routes verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hubHtml = readFileSync(`${root}/gps-tracker/madhya-pradesh.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const [slug, name] of seeds) {
  const route = `/gps-tracker/madhya-pradesh/${slug}`;
  const canonical = `https://naviigps.com${route}`;
  const htmlPath = `${root}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered Madhya Pradesh district page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid Madhya Pradesh canonical: ${route}`);
  assert.ok(html.includes(`<title>GPS Tracker in ${name} District, Madhya Pradesh | NAVII GPS INDIA</title>`), `Invalid Madhya Pradesh title: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one Madhya Pradesh district H1: ${route}`);
  assert.ok(html.includes(`GPS Tracker in ${name} District, Madhya Pradesh`), `Madhya Pradesh keyword missing: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed Madhya Pradesh district: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Madhya Pradesh district missing from sitemap: ${route}`);
  assert.ok(hubHtml.includes(`href="${route}"`), `Madhya Pradesh district orphaned from state hub: ${route}`);
  assert.ok(html.includes('href="/gps-tracker/madhya-pradesh"'), `Madhya Pradesh district missing parent link: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "AdministrativeArea")), `Missing Madhya Pradesh Service schema: ${route}`);
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")), `Missing Madhya Pradesh FAQ schema: ${route}`);
}

console.log("PASS: 55 rendered Madhya Pradesh district pages; keywords, canonical, schema, sitemap and hub links verified.");
