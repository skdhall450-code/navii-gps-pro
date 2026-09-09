import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const baseUrl = "https://naviigps.com";
const dataPath = "lib/seo/internationalCountries.ts";
const dataSource = readFileSync(dataPath, "utf8");

function fieldValue(block, field) {
  return block.match(new RegExp(`${field}: "([^"]+)"`))?.[1];
}

function arrayValues(block, field) {
  const value = block.match(new RegExp(`${field}: \\[([^\\]]+)\\]`))?.[1] ?? "";
  return [...value.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

const countryBlocks = dataSource
  .split("\n  {\n")
  .slice(1)
  .map((block) => block.split("\n  },")[0]);

const countries = countryBlocks.map((block) => ({
  slug: fieldValue(block, "slug"),
  name: fieldValue(block, "name"),
  cities: arrayValues(block, "cities"),
  sectors: arrayValues(block, "sectors"),
  localContext: fieldValue(block, "localContext"),
  planningNote: fieldValue(block, "planningNote"),
}));

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

assert.ok(
  dataSource.includes("new Set([...countryIntentKeywords, ...cityKeywords, ...sectorKeywords])"),
  "Automatic keyword deduplication is missing",
);

if (process.argv.includes("--source-only")) {
  console.log(`PASS: ${countries.length} international country data records and auto-metadata pages verified.`);
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

assert.ok(sitemapUrls.includes(`${baseUrl}/gps-tracker-international`));
console.log(
  `PASS: ${countries.length} rendered international pages; unique metadata, auto country/hub keywords, canonical, schema, sitemap and hub links verified.`,
);
