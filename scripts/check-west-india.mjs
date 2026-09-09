import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("lib/seo/westIndiaCities.ts", "utf8");
const cities = JSON.parse(source.match(/westIndiaCities: PriorityCitySeo\[\] = ([\s\S]*?\n\]);/)[1]);
const expectedCounts = { maharashtra: 35, gujarat: 25, rajasthan: 22, goa: 14, "dadra-nagar-haveli-daman-diu": 4 };
assert.equal(cities.length, 100);
assert.equal(new Set(cities.map((city) => city.slug)).size, 100, "Duplicate city URLs");
assert.equal(new Set(cities.map((city) => city.planningNote)).size, 100, "Duplicate local guidance");
for (const [state, count] of Object.entries(expectedCounts)) {
  assert.equal(cities.filter((city) => city.stateSlug === state).length, count);
}
for (const city of cities) {
  assert.match(city.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(city.areas.length >= 3);
  assert.ok(city.planningNote.length > 100);
}
if (process.argv.includes("--source-only")) {
  console.log("PASS: 100 unique city URLs and planning notes; all five region counts verified.");
  process.exit(0);
}
const root = ".next/server/app";
const sitemap = readFileSync(root + "/sitemap.xml.body", "utf8");
const hub = readFileSync(root + "/gps-tracker-west-india.html", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(urls.length, new Set(urls).size, "Duplicate sitemap URLs");
for (const city of cities) {
  const path = "/gps-tracker/" + city.slug;
  const html = readFileSync(root + path + ".html", "utf8");
  assert.ok(html.includes('rel="canonical" href="https://naviigps.com' + path + '"'), "Missing canonical: " + path);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, "Expected one H1: " + path);
  assert.ok(html.includes(city.name), "Missing city content: " + path);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), "Noindexed city: " + path);
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.ok(graphs.some((graph) => graph["@graph"]?.some((item) => item["@type"] === "Service" && item.url === "https://naviigps.com" + path)), "Missing matching Service schema: " + path);
  assert.ok(urls.includes("https://naviigps.com" + path), "Missing sitemap entry: " + path);
  assert.ok(hub.includes('href="' + path + '"'), "Orphaned from regional hub: " + path);
  const stateHtml = readFileSync(root + "/gps-tracker/" + city.stateSlug + ".html", "utf8");
  assert.ok(stateHtml.includes('href="' + path + '"'), "Orphaned from state: " + path);
}
assert.ok(urls.includes("https://naviigps.com/gps-tracker-west-india"));
console.log("PASS: 100 built city pages; unique sitemap URLs; canonical, H1, schema, indexability and hub/state links verified.");
