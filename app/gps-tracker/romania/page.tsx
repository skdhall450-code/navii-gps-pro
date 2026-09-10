import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("romania");
export const metadata = generateInternationalMetadata(country);

export default function RomaniaPage() {
  return <CountryGpsPage country={country} />;
}
