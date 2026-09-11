import type { MetadataRoute } from "next";

import { products } from "@/components/products/data/productsData";
import { indiaStates } from "@/lib/seo/indiaStates";
import { priorityCities } from "@/lib/seo/priorityCities";
import { westIndiaCities } from "@/lib/seo/westIndiaCities";
import { internationalCountries } from "@/lib/seo/internationalCountries";
import { internationalCities } from "@/lib/seo/internationalCities";
import { haryanaDistricts } from "@/lib/seo/haryanaDistricts";
import { haryanaCities } from "@/lib/seo/haryanaCities";
import { punjabDistricts } from "@/lib/seo/punjabDistricts";
import { punjabCities } from "@/lib/seo/punjabCities";
import { delhiDistricts } from "@/lib/seo/delhiDistricts";
import { delhiAreas } from "@/lib/seo/delhiAreas";
import { uttarPradeshDistricts } from "@/lib/seo/uttarPradeshDistricts";

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
  const internationalCityRoutes: MetadataRoute.Sitemap = internationalCities.map((city) => ({ url: `${baseUrl}/gps-tracker/${city.slug}`, changeFrequency: "monthly", priority: 0.85 }));
  const haryanaDistrictRoutes: MetadataRoute.Sitemap = haryanaDistricts.map((district) => ({ url: `${baseUrl}/gps-tracker/haryana/${district.slug}`, changeFrequency: "monthly", priority: 0.88 }));
  const haryanaCityRoutes: MetadataRoute.Sitemap = haryanaCities.map((city) => ({ url: `${baseUrl}/gps-tracker/haryana/${city.districtSlug}/${city.slug}`, changeFrequency: "monthly", priority: 0.84 }));
  const punjabDistrictRoutes: MetadataRoute.Sitemap = punjabDistricts.map((district) => ({ url: `${baseUrl}/gps-tracker/punjab/${district.slug}`, changeFrequency: "monthly", priority: 0.88 }));
  const punjabCityRoutes: MetadataRoute.Sitemap = punjabCities.map((city) => ({ url: `${baseUrl}/gps-tracker/punjab/${city.districtSlug}/${city.slug}`, changeFrequency: "monthly", priority: 0.84 }));
  const delhiDistrictRoutes: MetadataRoute.Sitemap = delhiDistricts.map((district) => ({ url: `${baseUrl}/gps-tracker/delhi/${district.slug}`, changeFrequency: "monthly", priority: 0.88 }));
  const delhiAreaRoutes: MetadataRoute.Sitemap = delhiAreas.map((area) => ({ url: `${baseUrl}/gps-tracker/delhi/${area.districtSlug}/${area.slug}`, changeFrequency: "monthly", priority: 0.84 }));
  const uttarPradeshDistrictRoutes: MetadataRoute.Sitemap = uttarPradeshDistricts.map((district) => ({ url: `${baseUrl}/gps-tracker/uttar-pradesh/${district.slug}`, changeFrequency: "monthly", priority: 0.88 }));
  return [...staticRoutes, ...stateRoutes, ...cityRoutes, ...internationalRoutes, ...internationalCityRoutes, ...haryanaDistrictRoutes, ...haryanaCityRoutes, ...punjabDistrictRoutes, ...punjabCityRoutes, ...delhiDistrictRoutes, ...delhiAreaRoutes, ...uttarPradeshDistrictRoutes, ...productRoutes];
}
