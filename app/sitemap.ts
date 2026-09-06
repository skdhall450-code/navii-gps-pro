import type { MetadataRoute } from "next";

import { products } from "@/components/products/data/productsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://naviigps.com";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/software`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/industries`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/ais-140-gps`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/school-bus-gps`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/truck-gps`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/logistics-fleet-gps`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/commercial-vehicle-tracking`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gps-tracker-for-car`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, changeFrequency: "monthly", priority: 0.8 }));
  return [...staticRoutes, ...productRoutes];
}
