const host = "naviigps.com";
const siteOrigin = `https://${host}`;
const key = "b33f20e6f8db4ada8e60721e2ddfbc4f";
const keyLocation = `${siteOrigin}/${key}.txt`;
const endpoint = "https://api.indexnow.org/indexnow";
const waitForDeployment = process.argv.includes("--wait-for-deployment");
const providedUrls = process.argv.slice(2).filter((value) => value !== "--wait-for-deployment");

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForFreshDeployment() {
  if (!waitForDeployment) return;

  const expectedCommit = process.env.EXPECTED_COMMIT_SHA;
  const attempts = 20;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    if (!expectedCommit) throw new Error("EXPECTED_COMMIT_SHA is required when waiting for deployment.");
    try {
      const response = await fetch(`${siteOrigin}/deployment-version?expected=${expectedCommit}&attempt=${attempt}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
        headers: { "User-Agent": "NAVII-GPS-SEO-Deployment-Check/1.0" },
      });
      if (response.ok) {
        const deployed = await response.json();
        if (deployed.commit === expectedCommit) {
          console.log(`Production commit verified: ${expectedCommit}`);
          return;
        }
      }
    } catch (error) {
      console.log(`Deployment check will retry: ${error.message}`);
    }

    console.log(`Production is not ready yet (attempt ${attempt}/${attempts}).`);
    await sleep(15_000);
  }

  throw new Error("Timed out waiting for the production sitemap after GitHub push.");
}

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

await waitForFreshDeployment();
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
