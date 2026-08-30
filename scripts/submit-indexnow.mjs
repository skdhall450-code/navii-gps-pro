const host = "naviigps.com";
const siteOrigin = `https://${host}`;
const key = "b33f20e6f8db4ada8e60721e2ddfbc4f";
const keyLocation = `${siteOrigin}/${key}.txt`;
const endpoint = "https://api.indexnow.org/indexnow";

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

async function readSitemapUrls() {
  const response = await fetch(`${siteOrigin}/sitemap.xml`);

  if (!response.ok) {
    throw new Error(`Could not fetch sitemap: HTTP ${response.status}`);
  }

  const sitemap = await response.text();
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gs)].map((match) =>
    decodeXml(match[1].trim()),
  );
}

function validateUrls(urls) {
  const uniqueUrls = [...new Set(urls)];

  if (uniqueUrls.length === 0) {
    throw new Error("No URLs were provided or found in the sitemap.");
  }

  if (uniqueUrls.length > 10_000) {
    throw new Error("IndexNow accepts a maximum of 10,000 URLs per request.");
  }

  for (const value of uniqueUrls) {
    const url = new URL(value);
    if (url.origin !== siteOrigin) {
      throw new Error(`URL does not belong to ${siteOrigin}: ${value}`);
    }
  }

  return uniqueUrls;
}

const providedUrls = process.argv.slice(2);
const urls = validateUrls(
  providedUrls.length > 0 ? providedUrls : await readSitemapUrls(),
);

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: urls,
  }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(
    `IndexNow submission failed: HTTP ${response.status}${body ? ` - ${body}` : ""}`,
  );
}

console.log(`IndexNow accepted ${urls.length} URL(s): HTTP ${response.status}`);
