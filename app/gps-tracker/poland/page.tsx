import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("poland");
export const metadata = generateInternationalMetadata(country);

export default function PolandPage() {
  return <CountryGpsPage country={country} />;
}
