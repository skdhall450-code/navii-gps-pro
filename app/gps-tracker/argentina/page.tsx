import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("argentina");
export const metadata = generateInternationalMetadata(country);

export default function ArgentinaPage() {
  return <CountryGpsPage country={country} />;
}
