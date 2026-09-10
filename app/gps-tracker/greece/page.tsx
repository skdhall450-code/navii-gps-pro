import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("greece");
export const metadata = generateInternationalMetadata(country);

export default function GreecePage() {
  return <CountryGpsPage country={country} />;
}
