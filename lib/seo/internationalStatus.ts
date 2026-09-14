// International SEO remains preserved in source while India coverage is the
// active priority. Set INTERNATIONAL_SEO_ENABLED=true at build time to publish
// the hub, country and city guides back into the sitemap and search index.
export const internationalSeoEnabled =
  process.env.INTERNATIONAL_SEO_ENABLED === "true";

export const internationalRobots = internationalSeoEnabled
  ? { index: true, follow: true }
  : { index: false, follow: true };
