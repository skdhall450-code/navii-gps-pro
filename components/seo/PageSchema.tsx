export function PageSchema({ path, name, description, type = "WebPage" }: {
  path: string;
  name: string;
  description?: string | null;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ItemPage";
}) {
  const url = `https://naviigps.com${path}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": "https://naviigps.com/#website" },
    publisher: { "@id": "https://naviigps.com/#organization" },
    inLanguage: "en-IN",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}
