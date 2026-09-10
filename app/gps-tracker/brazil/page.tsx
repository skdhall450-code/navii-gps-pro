import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("brazil");
export const metadata = generateInternationalMetadata(country);

export default function BrazilPage() {
  return <CountryGpsPage country={country} />;
}
