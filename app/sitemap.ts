import type { MetadataRoute } from "next";

import { products } from "@/components/products/data/productsData";
import { indiaStates } from "@/lib/seo/indiaStates";
import { priorityCities } from "@/lib/seo/priorityCities";
import { westIndiaCities } from "@/lib/seo/westIndiaCities";
import { internationalCountries } from "@/lib/seo/internationalCountries";

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
    { url: `${baseUrl}/gps-tracking-system-school-bus`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/truck-gps`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/logistics-fleet-gps`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/commercial-vehicle-tracking`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gps-tracker-for-car`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/4g-gps-tracker`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/vehicle-tracking-system`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gps-tracking-company-india`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gps-tracker-west-india`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gps-tracker-india`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/gps-tracker-international`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/fuel-monitoring-system`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, changeFrequency: "monthly", priority: 0.8 }));
  const stateRoutes: MetadataRoute.Sitemap = indiaStates.map((state) => ({ url: `${baseUrl}/gps-tracker/${state.slug}`, changeFrequency: "monthly", priority: state.southPriority ? 0.9 : 0.8 }));
  const cities = [...new Map([...priorityCities, ...westIndiaCities].map((city) => [city.slug, city])).values()];
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({ url: `${baseUrl}/gps-tracker/${city.slug}`, changeFrequency: "monthly", priority: 0.9 }));
  const internationalRoutes: MetadataRoute.Sitemap = internationalCountries.map((country) => ({ url: `${baseUrl}/gps-tracker/${country.slug}`, changeFrequency: "monthly", priority: 0.9 }));
  return [...staticRoutes, ...stateRoutes, ...cityRoutes, ...internationalRoutes, ...productRoutes];
}
