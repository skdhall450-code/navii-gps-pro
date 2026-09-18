// International SEO remains preserved in source while India coverage is the active priority.
// Keep these routes available in source for future expansion, but do not publish
// international country/city guides to the sitemap or search index unless the
// international program is deliberately re-enabled in code.
export const internationalSeoEnabled = false;

export const internationalRobots = internationalSeoEnabled
  ? { index: true, follow: true }
  : { index: false, follow: true };
