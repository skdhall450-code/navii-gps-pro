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

// Reviewed route inventory prevents an old town from being silently replaced
// by another record while a simple total-count check still passes.
const reviewedBatches = [
  {
    "gautam-buddha-nagar": ["dadri", "jewar"],
    firozabad: ["shikohabad", "tundla"],
    lucknow: ["mohanlalganj", "malihabad"],
    "kanpur-nagar": ["bilhaur", "ghatampur"],
    agra: ["etmadpur", "fatehabad"],
    mathura: ["vrindavan", "kosi-kalan"],
    meerut: ["sardhana", "mawana"],
    bulandshahr: ["khurja", "sikandrabad"],
    saharanpur: ["deoband", "nakur"],
    gorakhpur: ["sahjanwa", "chauri-chaura"],
    varanasi: ["pindra", "rajatalab"],
    prayagraj: ["phulpur", "soraon"],
  },
  {
    ayodhya: ["rudauli", "bikapur"],
    barabanki: ["haidergarh", "ramnagar"],
    sultanpur: ["lambhua", "kadipur"],
    bareilly: ["aonla", "nawabganj"],
    moradabad: ["bilari", "thakurdwara"],
    bijnor: ["najibabad", "dhampur"],
    muzaffarnagar: ["khatauli", "budhana"],
    shamli: ["kairana", "kandhla"],
    hapur: ["pilkhuwa", "garhmukteshwar"],
    aligarh: ["khair", "atrauli"],
    jhansi: ["mauranipur", "moth"],
    unnao: ["bangarmau", "purwa"],
  },
  {
    shahjahanpur: ["tilhar", "powayan"],
    sitapur: ["mahmudabad", "laharpur"],
    "lakhimpur-kheri": ["palia-kalan", "nighasan"],
    hardoi: ["sandila", "shahabad"],
    raebareli: ["lalganj", "salon"],
    fatehpur: ["bindki", "khaga"],
    pratapgarh: ["kunda", "patti"],
    jaunpur: ["shahganj", "kerakat"],
    azamgarh: ["nizamabad", "lalganj"],
    ghazipur: ["zamania", "saidpur"],
    deoria: ["salempur", "rudrapur"],
    kushinagar: ["hata", "tamkuhi-raj"],
  },
  {
    baghpat: ["baraut", "khekra"],
    ghaziabad: ["loni", "modinagar"],
    amroha: ["hasanpur", "dhanaura"],
    rampur: ["bilaspur", "milak"],
    sambhal: ["chandausi", "gunnaur"],
    badaun: ["bisauli", "sahaswan"],
    pilibhit: ["puranpur", "bisalpur"],
    mainpuri: ["karhal", "kishni"],
    etawah: ["bharthana", "jaswantnagar"],
    kannauj: ["chhibramau", "tirwa"],
    farrukhabad: ["kaimganj", "fatehgarh"],
    auraiya: ["bidhuna", "ajitmal"],
  },
  {
    etah: ["jalesar", "aliganj"],
    hathras: ["sikandra-rao", "sadabad"],
    kasganj: ["patiyali", "sahawar"],
    "ambedkar-nagar": ["tanda", "jalalpur"],
    amethi: ["gauriganj", "tiloi"],
    ballia: ["rasra", "bansdih"],
    mau: ["ghosi", "madhuban"],
    basti: ["harraiya", "bhanpur"],
    "sant-kabir-nagar": ["mehdawal", "dhanghata"],
    siddharthnagar: ["bansi", "domariyaganj"],
    banda: ["atarra", "baberu"],
    chitrakoot: ["rajapur", "manikpur"],
  },
  {
    hamirpur: ["rath", "maudaha"],
    mahoba: ["charkhari", "kulpahar"],
    bahraich: ["nanpara", "kaiserganj"],
    balrampur: ["tulsipur", "utraula"],
    gonda: ["colonelganj", "mankapur"],
    shravasti: ["bhinga", "ikauna"],
    maharajganj: ["nautanwa", "nichlaul"],
    jalaun: ["orai", "kalpi"],
    lalitpur: ["talbehat", "mahroni"],
    "kanpur-dehat": ["rura", "pukhrayan"],
    mirzapur: ["chunar", "marihan"],
    bhadohi: ["gyanpur", "gopiganj"],
  },
];
const expectedRoutes = reviewedBatches.flatMap((batch) => Object.entries(batch).flatMap(
  ([district, towns]) => towns.map((town) => `${district}/${town}`),
));
assert.equal(cities.length, 144, "Update the reviewed batch inventory when adding towns");
assert.equal(new Set(cities.map((city) => city.districtSlug)).size, 72);
assert.deepEqual(cities.map((city) => `${city.districtSlug}/${city.slug}`).sort(), expectedRoutes.sort(), "Published town inventory changed");
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
  for (const otherDistrict of districts.filter((entry) => entry.slug !== city.districtSlug)) {
    const expected = cities.find((entry) => entry.districtSlug === otherDistrict.slug && entry.slug === city.slug);
    assert.equal(getUttarPradeshCity(otherDistrict.slug, city.slug), expected, `Town resolved under the wrong district: ${otherDistrict.slug}/${city.slug}`);
  }
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
assert.equal(getUttarPradeshCity("varanasi", "ramnagar"), undefined, "A district location label must not create an unreviewed town page");
assert.equal(getUttarPradeshCity("barabanki", "nawabganj"), undefined, "Bareilly Nawabganj must not resolve under Barabanki");
// Both reviewed Lalganj towns must remain reachable under their own district.
// Other district labels called Lalganj must not implicitly create new pages.
const lalganjTowns = ["raebareli", "azamgarh"].map((district) => getUttarPradeshCity(district, "lalganj"));
assert.ok(lalganjTowns.every(Boolean), "A reviewed Lalganj page is missing");
assert.equal(new Set(lalganjTowns.map(getUttarPradeshCityPath)).size, 2);
assert.equal(new Set(lalganjTowns.map((city) => generateUttarPradeshCityMetadata(city).title)).size, 2);
assert.ok(lalganjTowns.every((city) => city.localContext.includes(city.districtName)), "Same-name guides need visible district identification");
assert.equal(getUttarPradeshCity("pratapgarh", "lalganj"), undefined);
assert.equal(getUttarPradeshCity("mirzapur", "lalganj"), undefined);
// Similar spellings refer to different reviewed towns, not interchangeable aliases.
for (const [district, town] of [["rampur", "bilaspur"], ["pilibhit", "bisalpur"]]) {
  const city = getUttarPradeshCity(district, town);
  assert.ok(city?.localContext.includes(city.districtName), "Bilaspur and Bisalpur need visible district identification");
}
assert.equal(getUttarPradeshCity("rampur", "bisalpur"), undefined);
assert.equal(getUttarPradeshCity("pilibhit", "bilaspur"), undefined);
assert.deepEqual(getUttarPradeshCitiesForDistrict("not-a-district"), []);

if (process.argv.includes("--source-only")) {
  console.log(`PASS: ${cities.length} curated UP towns across 72 districts; all six batch inventories, same-name town lookups, metadata and route uniqueness verified.`);
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
  for (const sibling of getUttarPradeshCitiesForDistrict(city.districtSlug).filter((entry) => entry.slug !== city.slug)) {
    assert.ok(html.includes(`href="${getUttarPradeshCityPath(sibling)}"`), `Missing sibling link: ${path}`);
  }
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
console.log(`PASS: ${cities.length} rendered UP town pages; parent/hub/sibling links, visible local content, sitemap, FAQ and district-scoped schema verified.`);
