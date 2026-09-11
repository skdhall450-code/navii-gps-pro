import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const origin = "https://naviigps.com";
const root = ".next/server/app";
const errors = [];
const pages = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const decode = (text = "") => text.replace(/&(amp|quot|apos|lt|gt|#39|#x27|#\d+|#x[0-9a-f]+);/gi, (match, entity) => {
  const named = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", "#39": "'", "#x27": "'" };
  if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
  const code = entity.toLowerCase().startsWith("#x") ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
  return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
});
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([, key, a, b]) => [key.toLowerCase(), decode(a ?? b)]));
const plain = (html) => decode(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
const pagePath = (pathname) => join(root, pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}.html`);
const sitemap = readFileSync(join(root, "sitemap.xml.body"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gs)].map(([, value]) => decode(value.trim()));
check(urls.length > 0, "Empty sitemap");
check(new Set(urls).size === urls.length, "Duplicate sitemap URLs");

for (const url of urls) {
  let parsed;
  try { parsed = new URL(url); } catch { errors.push(`Invalid sitemap URL: ${url}`); continue; }
  check(parsed.origin === origin && !parsed.search && !parsed.hash, `Invalid canonical sitemap URL: ${url}`);
  const pathname = parsed.pathname.replace(/\/$/, "") || "/";
  check(!/^\/(dashboard|login|history|live-tracking|api|deployment-version)(\/|$)/.test(pathname), `Operational route in sitemap: ${pathname}`);
  if (!existsSync(pagePath(pathname))) { errors.push(`Missing rendered page: ${pathname}`); continue; }
  const html = readFileSync(pagePath(pathname), "utf8");
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const meta = new Map([...markup.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => { const a = attributes(tag); return [a.name || a.property, a.content]; }));
  const titles = [...markup.matchAll(/<title>(.*?)<\/title>/gs)].map(([, title]) => plain(title));
  const headings = [...markup.matchAll(/<h1(?:\s[^>]*)?>(.*?)<\/h1>/gs)].map(([, title]) => plain(title));
  const canonicals = [...markup.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter((a) => a.rel === "canonical").map((a) => a.href);
  const title = titles[0] || "";
  const description = meta.get("description") || "";
  const keywords = (meta.get("keywords") || "").split(",").map((word) => word.trim()).filter(Boolean);
  check(new Set(keywords.map((word) => word.toLowerCase())).size === keywords.length, `Duplicate keywords: ${pathname}`);
  check(titles.length === 1 && title.length > 10, `Missing or ambiguous title: ${pathname}`);
  check((title.match(/NAVII GPS/gi) || []).length === 1, `Repeated or missing title brand: ${pathname}`);
  check(description.length >= 40, `Missing/empty page description: ${pathname}`);
  check(headings.length === 1 && headings[0].length > 3, `Expected one descriptive H1: ${pathname}`);
  check(canonicals.length === 1 && canonicals[0] === url, `Canonical differs from sitemap: ${pathname}`);
  for (const agent of ["robots", "googlebot"]) check(!/noindex|nofollow|none/i.test(meta.get(agent) || ""), `Non-indexable sitemap page (${agent}): ${pathname}`);
  for (const key of ["og:title", "og:description", "twitter:title", "twitter:description", "og:image", "twitter:image"]) check(Boolean(meta.get(key)), `Missing ${key}: ${pathname}`);
  check(meta.get("og:url") === url, `Open Graph URL differs from canonical: ${pathname}`);
  check(meta.get("twitter:title") !== "NAVII GPS INDIA", `Homepage social title inherited: ${pathname}`);
  const graph = [];
  for (const [, attrs, body] of scripts) {
    if (attributes(attrs).type !== "application/ld+json") continue;
    try { const schema = JSON.parse(body); graph.push(...(schema["@graph"] || (Array.isArray(schema) ? schema : [schema]))); }
    catch { errors.push(`Invalid JSON-LD: ${pathname}`); }
  }
  const pageTypes = ["WebPage", "AboutPage", "ContactPage", "CollectionPage", "ItemPage"];
  check(graph.some((item) => pageTypes.includes(item["@type"]) && item.url?.replace(/\/$/, "") === url.replace(/\/$/, "")), `Missing matching page schema: ${pathname}`);
  if (pathname.startsWith("/gps-tracker/")) check(graph.some((item) => item["@type"] === "Service" && item.url === url && item.areaServed), `Missing local Service schema: ${pathname}`);
  const internalLinks = [];
  for (const [tag] of markup.matchAll(/<a\b[^>]*>/gi)) {
    const href = attributes(tag).href;
    if (!href || /^(?:mailto|tel|javascript):/i.test(href)) continue;
    let target;
    try { target = new URL(href, url); } catch { errors.push(`Invalid link on ${pathname}: ${href}`); continue; }
    if (target.origin !== origin) continue;
    const route = target.pathname.replace(/\/$/, "") || "/";
    internalLinks.push(route);
    check(existsSync(pagePath(route)) || existsSync(join("public", route.slice(1))) || existsSync(join(root, `${route.slice(1)}.body`)), `Broken internal link on ${pathname}: ${route}`);
  }
  pages.push({ url, pathname, title, description, h1: headings[0], canonical: canonicals[0], keywords: (meta.get("keywords") || "").split(",").map((word) => word.trim()).filter(Boolean), socialTitle: meta.get("twitter:title"), schemaTypes: graph.flatMap((item) => item["@type"] || []), internalLinks: [...new Set(internalLinks)] });
}

for (const field of ["title", "description"]) {
  const seen = new Map();
  for (const page of pages) {
    check(!seen.has(page[field]), `Duplicate ${field}: ${page.pathname} / ${seen.get(page[field])}`);
    seen.set(page[field], page.pathname);
  }
}
// Crawl the rendered link graph from the homepage, catching orphaned URLs beyond one-level links.
const byPath = new Map(pages.map((page) => [page.pathname, page]));
const reached = new Set();
const queue = ["/"];
for (let i = 0; i < queue.length; i += 1) {
  const pathname = queue[i];
  if (reached.has(pathname)) continue;
  reached.add(pathname);
  for (const link of byPath.get(pathname)?.internalLinks || []) if (byPath.has(link) && !reached.has(link)) queue.push(link);
}
for (const page of pages) check(reached.has(page.pathname), `Orphaned public page: ${page.pathname}`);

const report = { generatedAt: new Date().toISOString(), commit: process.env.GITHUB_SHA || "local", pageCount: pages.length, errorCount: errors.length, errors, pages };
writeFileSync(".next/seo-audit.json", JSON.stringify(report, null, 2) + "\n");
const summary = `### Whole-site SEO audit\n\n- Public sitemap pages checked: ${pages.length}\n- Errors: ${errors.length}\n- Checks: titles, descriptions, canonical URLs, H1, robots, social previews, JSON-LD, internal links and reachability from the homepage.\n- The downloadable JSON report includes each page's keywords and service links. It does not measure Google ranking or indexing.\n${errors.length ? `\n${errors.map((error) => `- ${error}`).join("\n")}\n` : ""}`;
writeFileSync(".next/seo-audit.md", summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`PASS: All ${pages.length} public URLs; metadata, schema, links and homepage reachability verified.`);
