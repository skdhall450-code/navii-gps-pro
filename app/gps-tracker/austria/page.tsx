import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("austria");
export const metadata = generateInternationalMetadata(country);

export default function AustriaPage() {
  return <CountryGpsPage country={country} />;
}
