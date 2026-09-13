import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import { runInThisContext } from "node:vm";
import ts from "typescript";

// Execute the actual data helpers, including alias imports, under the same
// TypeScript compiler used by the project. No reimplementation of lookups.
const require = createRequire(import.meta.url);
const cache = new Map();
function loadSeoModule(filename) {
  const path = resolve(filename);
  if (cache.has(path)) return cache.get(path).exports;
  if (path.endsWith(".json")) return JSON.parse(readFileSync(path, "utf8"));
  const loadedModule = { exports: {} };
  cache.set(path, loadedModule);
  const code = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, esModuleInterop: true },
  }).outputText;
  const localRequire = (name) => {
    if (!name.startsWith("@/") && !name.startsWith(".")) return require(name);
    const target = name.startsWith("@/") ? resolve(name.slice(2)) : resolve(dirname(path), name);
    return loadSeoModule(target.endsWith(".json") ? target : `${target}.ts`);
  };
  runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: path })(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const {
  uttarPradeshCities: cities, getUttarPradeshCity, getUttarPradeshCitiesForDistrict,
  getUttarPradeshCityPath, generateUttarPradeshCityMetadata,
} = loadSeoModule("lib/seo/uttarPradeshCities.ts");
const { uttarPradeshDistricts: districts } = loadSeoModule("lib/seo/uttarPradeshDistricts.ts");
const { priorityCities } = loadSeoModule("lib/seo/priorityCities.ts");
const { westIndiaCities } = loadSeoModule("lib/seo/westIndiaCities.ts");

assert.equal(cities.length, 24, "Update the reviewed batch inventory when adding towns");
assert.equal(new Set(cities.map((city) => city.districtSlug)).size, 12);
assert.equal(new Set(cities.map(getUttarPradeshCityPath)).size, cities.length, "Duplicate city URL");
for (const field of ["localContext", "focus"]) {
  assert.equal(new Set(cities.map((city) => city[field])).size, cities.length, `Repeated ${field}`);
}
assert.equal(new Set(cities.flatMap((city) => city.routeChecks)).size, cities.length * 3, "Repeated route-planning checks");

for (const city of cities) {
  const district = districts.find((entry) => entry.slug === city.districtSlug);
  assert.ok(district?.cities.includes(city.name), `Unmapped city: ${city.name}`);
  assert.match(city.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(city.localContext.includes(city.name));
  assert.equal(city.routeChecks.length, 3);
  assert.ok(city.routeChecks.every((entry) => entry.length > 50));
  assert.match(new URL(city.sourceUrl).hostname, /\.nic\.in$/, "Expected district-administration source");
  assert.equal(getUttarPradeshCity(city.districtSlug, city.slug), city);
  assert.equal(getUttarPradeshCity("not-a-district", city.slug), undefined);
  assert.equal(getUttarPradeshCity(city.districtSlug, "not-a-city"), undefined);
  assert.equal(getUttarPradeshCity("haryana", city.slug), undefined);
  assert.equal(getUttarPradeshCitiesForDistrict(city.districtSlug).length, 2);
  assert.ok(![...priorityCities, ...westIndiaCities].some((entry) => entry.stateSlug === "uttar-pradesh" && entry.name.toLowerCase() === city.name.toLowerCase()), `Existing flat city page would compete: ${city.name}`);
  assert.ok(!existsSync(`app/gps-tracker/${city.slug}/page.tsx`), `Existing static city page would compete: ${city.slug}`);
  const metadata = generateUttarPradeshCityMetadata(city);
  const url = `https://naviigps.com${getUttarPradeshCityPath(city)}`;
  assert.equal(metadata.alternates.canonical, url);
  assert.equal(metadata.openGraph.url, url);
  assert.equal(metadata.twitter.description, metadata.description);
  assert.ok(metadata.title.includes(city.districtName));
  assert.ok(metadata.keywords.every((keyword) => keyword.includes(city.name)));
  assert.equal(new Set(metadata.keywords.map((entry) => entry.toLowerCase())).size, metadata.keywords.length);
}
assert.equal(getUttarPradeshCity("prayagraj", "fatehabad"), undefined, "Wrong parent must not resolve a same-name town");
assert.deepEqual(getUttarPradeshCitiesForDistrict("not-a-district"), []);

if (process.argv.includes("--source-only")) {
  console.log("PASS: 24 curated UP towns across 12 districts; mappings, scoped lookups, metadata and route uniqueness verified.");
  process.exit(0);
}

const root = ".next/server/app";
const sitemap = readFileSync(`${root}/sitemap.xml.body`, "utf8");
const hub = readFileSync(`${root}/gps-tracker/uttar-pradesh.html`, "utf8");
const strip = (html) => html.replace(/<[^>]+>/g, "");
const normalize = (text) => strip(text).replaceAll("&#x27;", "'").replaceAll("&#39;", "'").replaceAll("&quot;", '"').replaceAll("&amp;", "&");
for (const city of cities) {
  const path = getUttarPradeshCityPath(city);
  const url = `https://naviigps.com${path}`;
  const html = readFileSync(`${root}${path}.html`, "utf8");
  const districtHtml = readFileSync(`${root}/gps-tracker/uttar-pradesh/${city.districtSlug}.html`, "utf8");
  assert.ok(sitemap.includes(`<loc>${url}</loc>`), `Missing sitemap entry: ${path}`);
  assert.ok(hub.includes(`href="${path}"`), `Missing state-to-town link: ${path}`);
  assert.ok(districtHtml.includes(`href="${path}"`), `Missing district-to-town link: ${path}`);
  assert.ok(html.includes(`href="/gps-tracker/uttar-pradesh/${city.districtSlug}"`), `Missing parent: ${path}`);
  assert.ok(html.includes(`rel="canonical" href="${url}"`), `Wrong canonical: ${path}`);
  assert.ok(!existsSync(`${root}/gps-tracker/${city.slug}.html`), `Duplicate flat URL for ${city.name}`);
  const visible = normalize(html.split("<main>")[1].split("</main>")[0].replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ""));
  assert.ok(visible.includes(city.localContext), `Missing authored context: ${path}`);
  for (const check of city.routeChecks) assert.ok(visible.includes(check), `Missing route check: ${path}`);
  const graph = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => {
    const data = JSON.parse(match[1]);
    return data["@graph"] || [data];
  });
  const service = graph.find((entry) => entry["@type"] === "Service" && entry.url === url);
  assert.equal(service?.areaServed.name, city.name);
  assert.equal(service?.areaServed.containedInPlace.name, `${city.districtName} District`);
  const breadcrumbs = graph.find((entry) => entry["@type"] === "BreadcrumbList");
  assert.equal(breadcrumbs?.itemListElement.at(-1).item, url);
  const faq = graph.find((entry) => entry["@type"] === "FAQPage");
  assert.equal(faq?.mainEntity.length, 3);
  for (const question of faq.mainEntity) {
    assert.ok(visible.includes(question.name), `Hidden FAQ question: ${path}`);
    assert.ok(visible.includes(question.acceptedAnswer.text), `Hidden FAQ answer: ${path}`);
  }
}
console.log("PASS: 24 rendered UP town pages; parent/hub links, visible local content, sitemap, FAQ and district-scoped schema verified.");
