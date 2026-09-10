import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const baseUrl = "https://naviigps.com";
const dataPath = "lib/seo/internationalCountries.ts";
const dataSource = readFileSync(dataPath, "utf8");
const cityDataPath = "lib/seo/internationalCities.ts";
const cityDataSource = readFileSync(cityDataPath, "utf8");

function fieldValue(block, field) {
  return block.match(new RegExp(`${field}: "([^"]+)"`))?.[1];
}

function arrayValues(block, field) {
  const value = block.match(new RegExp(`${field}: \\[([^\\]]+)\\]`))?.[1] ?? "";
  return [...value.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function objectBlocks(source) {
  return [...source.matchAll(/(?:^|\n)  (?:createInternationalCity\()?\{\n([\s\S]*?)\n  \}(?:\))?,/g)]
    .map((match) => match[1]);
}

const countryBlocks = objectBlocks(dataSource);

const countries = countryBlocks.map((block) => ({
  slug: fieldValue(block, "slug"),
  name: fieldValue(block, "name"),
  cities: arrayValues(block, "cities"),
  sectors: arrayValues(block, "sectors"),
  localContext: fieldValue(block, "localContext"),
  planningNote: fieldValue(block, "planningNote"),
}));
const cityBlocks = objectBlocks(cityDataSource);
const initialCities = cityBlocks.map((block) => ({
  slug: fieldValue(block, "slug"),
  name: fieldValue(block, "name"),
  countrySlug: fieldValue(block, "countrySlug"),
  countryName: fieldValue(block, "countryName"),
  areas: arrayValues(block, "areas"),
  localContext: fieldValue(block, "localContext") ?? `${fieldValue(block, "name")} fleet operations connect ${fieldValue(block, "routeProfile")}, where reliable vehicle location, trip history and event visibility can support dispatch and route coordination.`,
  planningNote: fieldValue(block, "planningNote") ?? `Before deployment in ${fieldValue(block, "name")}, confirm ${fieldValue(block, "planningFocus")}, compatible mobile networks, device installation responsibility, privacy and workplace requirements, data retention and ongoing platform support.`,
}));
const expansionSeedsMatch = cityDataSource.match(
  /const expansionCitySeeds: InternationalCitySeed\[\] = ([\s\S]*?\n\]);/,
);
assert.ok(expansionSeedsMatch, "Missing international city expansion seeds");
const expansionSeeds = JSON.parse(expansionSeedsMatch[1].replace(/,\s*]/g, "]"));
const expansionCities = expansionSeeds.map(
  ([slug, name, countrySlug, countryName, areas, routeProfile, planningFocus]) => ({
    slug,
    name,
    countrySlug,
    countryName,
    areas,
    routeProfile,
    planningFocus,
    localContext: `${name} fleet operations connect ${routeProfile}, where reliable vehicle location, trip history and event visibility can support dispatch and route coordination.`,
    planningNote: `Before deployment in ${name}, confirm ${planningFocus}, compatible mobile networks, device installation responsibility, privacy and workplace requirements, data retention and ongoing platform support.`,
  }),
);
const cities = [...initialCities, ...expansionCities];

assert.ok(countries.length > 0, "No international country data found");
assert.equal(
  new Set(countries.map((country) => country.slug)).size,
  countries.length,
  "Duplicate international country slugs",
);
assert.equal(
  new Set(countries.map((country) => country.name)).size,
  countries.length,
  "Duplicate international country names",
);

for (const country of countries) {
  assert.match(country.slug ?? "", /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid country slug");
  assert.ok(country.name, `Missing country name: ${country.slug}`);
  assert.ok(country.cities.length >= 5, `Expected at least five cities: ${country.slug}`);
  assert.equal(
    new Set(country.cities).size,
    country.cities.length,
    `Duplicate cities: ${country.slug}`,
  );
  assert.ok(country.sectors.length >= 4, `Expected at least four sectors: ${country.slug}`);
  assert.ok((country.localContext?.length ?? 0) > 100, `Local context is too short: ${country.slug}`);
  assert.ok((country.planningNote?.length ?? 0) > 100, `Planning note is too short: ${country.slug}`);

  const pagePath = `app/gps-tracker/${country.slug}/page.tsx`;
  assert.ok(existsSync(pagePath), `Missing country page: ${pagePath}`);
  const pageSource = readFileSync(pagePath, "utf8");
  assert.ok(
    pageSource.includes(`getInternationalCountry("${country.slug}")`),
    `Country page is not connected to central data: ${country.slug}`,
  );
  assert.ok(
    pageSource.includes("generateInternationalMetadata(country)"),
    `Country page is not using automatic metadata: ${country.slug}`,
  );
}

const countrySlugs = new Set(countries.map((country) => country.slug));
const citySlugs = new Set(cities.map((city) => city.slug));
const expectedCityCounts = {
  usa: 5,
  "united-kingdom": 5,
  canada: 5,
  australia: 5,
  germany: 5,
  france: 5,
  netherlands: 5,
  uae: 5,
  "saudi-arabia": 5,
  qatar: 5,
  oman: 5,
  kuwait: 5,
  bahrain: 5,
  singapore: 5,
  malaysia: 5,
  "new-zealand": 5,
  italy: 5,
  spain: 5,
  belgium: 5,
  switzerland: 5,
  ireland: 5,
};

assert.equal(cities.length, 105, "Expected 105 priority international city records");
assert.equal(citySlugs.size, cities.length, "Duplicate international city slugs");
assert.equal(
  new Set(cities.map((city) => city.planningNote)).size,
  cities.length,
  "Duplicate international city planning notes",
);

for (const [countrySlug, count] of Object.entries(expectedCityCounts)) {
  assert.equal(
    cities.filter((city) => city.countrySlug === countrySlug).length,
    count,
    `Unexpected priority city count: ${countrySlug}`,
  );
}

for (const city of cities) {
  assert.match(city.slug ?? "", /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid city slug");
  assert.ok(!countrySlugs.has(city.slug), `City slug conflicts with country: ${city.slug}`);
  assert.ok(city.name, `Missing city name: ${city.slug}`);
  assert.ok(city.areas.length >= 4, `Expected at least four local areas: ${city.slug}`);
  assert.equal(new Set(city.areas).size, city.areas.length, `Duplicate local areas: ${city.slug}`);
  assert.ok((city.localContext?.length ?? 0) > 120, `Local context is too short: ${city.slug}`);
  assert.ok((city.planningNote?.length ?? 0) > 120, `Planning note is too short: ${city.slug}`);
  if (city.routeProfile || city.planningFocus) {
    assert.ok(city.routeProfile?.length > 50, `Route profile is too short: ${city.slug}`);
    assert.ok(city.planningFocus?.length > 45, `Planning focus is too short: ${city.slug}`);
  }
  const country = countries.find((item) => item.slug === city.countrySlug);
  assert.ok(country, `Missing parent country: ${city.slug}`);
  assert.equal(country.name, city.countryName, `Parent country name mismatch: ${city.slug}`);
  assert.ok(country.cities.includes(city.name), `City missing from parent country data: ${city.slug}`);
}

const dynamicRouteSource = readFileSync("app/gps-tracker/[state]/page.tsx", "utf8");
assert.ok(dynamicRouteSource.includes("internationalCities.map"), "City static params are not automatic");
assert.ok(dynamicRouteSource.includes("generateInternationalCityMetadata"), "City metadata is not automatic");
assert.ok(dynamicRouteSource.includes("InternationalCityGpsPage"), "International city renderer is missing");

assert.ok(
  dataSource.includes("new Set([...countryIntentKeywords, ...cityKeywords, ...sectorKeywords])"),
  "Automatic keyword deduplication is missing",
);

if (process.argv.includes("--source-only")) {
  console.log(`PASS: ${countries.length} countries and ${cities.length} priority international cities with automatic pages and metadata verified.`);
  process.exit(0);
}

function extractTag(html, pattern, message) {
  const value = html.match(pattern)?.[1];
  assert.ok(value, message);
  return value;
}

const buildRoot = ".next/server/app";
const sitemap = readFileSync(`${buildRoot}/sitemap.xml.body`, "utf8");
const hub = readFileSync(`${buildRoot}/gps-tracker-international.html`, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const titles = new Set();
const descriptions = new Set();
const hubKeywords = extractTag(
  hub,
  /<meta name="keywords" content="([^"]+)"/,
  "Missing international hub keywords",
);

assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "Duplicate sitemap URLs");

for (const country of countries) {
  const route = `/gps-tracker/${country.slug}`;
  const canonical = `${baseUrl}${route}`;
  const htmlPath = `${buildRoot}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered country page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");

  const title = extractTag(html, /<title>(.*?)<\/title>/, `Missing title: ${route}`);
  const description = extractTag(
    html,
    /<meta name="description" content="([^"]+)"/,
    `Missing description: ${route}`,
  );
  const keywords = extractTag(
    html,
    /<meta name="keywords" content="([^"]+)"/,
    `Missing keywords: ${route}`,
  );

  assert.ok(!titles.has(title), `Duplicate international title: ${title}`);
  assert.ok(!descriptions.has(description), `Duplicate international description: ${description}`);
  titles.add(title);
  descriptions.add(description);

  assert.ok(title.includes(country.name), `Country missing from title: ${route}`);
  assert.ok(description.includes(country.name), `Country missing from description: ${route}`);
  assert.ok(keywords.includes(`GPS tracker ${country.name}`), `Country keyword missing: ${route}`);
  for (const city of country.cities) {
    assert.ok(keywords.includes(`GPS tracker ${city}`), `City keyword missing for ${city}: ${route}`);
  }

  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid canonical: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one H1: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed page: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `Missing sitemap entry: ${route}`);
  assert.ok(hub.includes(`href="${route}"`), `Country page is orphaned from hub: ${route}`);
  assert.ok(
    hubKeywords.includes(`GPS tracker ${country.name}`),
    `Country keyword missing from international hub: ${country.name}`,
  );

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some(
      (item) => item["@type"] === "Service" && item.url === canonical,
    )),
    `Missing matching Service schema: ${route}`,
  );
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")),
    `Missing FAQ schema: ${route}`,
  );
}

for (const city of cities) {
  const route = `/gps-tracker/${city.slug}`;
  const canonical = `${baseUrl}${route}`;
  const htmlPath = `${buildRoot}${route}.html`;
  assert.ok(existsSync(htmlPath), `Missing rendered international city page: ${route}`);
  const html = readFileSync(htmlPath, "utf8");
  const title = extractTag(html, /<title>(.*?)<\/title>/, `Missing city title: ${route}`);
  const description = extractTag(
    html,
    /<meta name="description" content="([^"]+)"/,
    `Missing city description: ${route}`,
  );
  const keywords = extractTag(
    html,
    /<meta name="keywords" content="([^"]+)"/,
    `Missing city keywords: ${route}`,
  );

  assert.ok(!titles.has(title), `Duplicate international title: ${title}`);
  assert.ok(!descriptions.has(description), `Duplicate international description: ${description}`);
  titles.add(title);
  descriptions.add(description);
  assert.ok(title.includes(city.name), `City missing from title: ${route}`);
  assert.ok(description.includes(city.countryName), `Country missing from city description: ${route}`);
  assert.ok(keywords.includes(`GPS tracker ${city.name}`), `Primary city keyword missing: ${route}`);
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `Invalid city canonical: ${route}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one city H1: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `Noindexed city: ${route}`);
  assert.ok(sitemapUrls.includes(canonical), `City missing from sitemap: ${route}`);
  assert.ok(
    html.includes(`href="/gps-tracker/${city.countrySlug}"`),
    `City page is not linked to parent country: ${route}`,
  );

  const countryHtml = readFileSync(`${buildRoot}/gps-tracker/${city.countrySlug}.html`, "utf8");
  assert.ok(countryHtml.includes(`href="${route}"`), `City is orphaned from parent country: ${route}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some(
      (item) => item["@type"] === "Service" && item.url === canonical && item.areaServed?.["@type"] === "City",
    )),
    `Missing matching city Service schema: ${route}`,
  );
  assert.ok(
    schemas.some((schema) => schema["@graph"]?.some((item) => item["@type"] === "FAQPage")),
    `Missing city FAQ schema: ${route}`,
  );
}

assert.ok(sitemapUrls.includes(`${baseUrl}/gps-tracker-international`));
console.log(
  `PASS: ${countries.length} country and ${cities.length} priority city pages; unique metadata, auto keywords, canonical, schema, sitemap and internal links verified.`,
);
