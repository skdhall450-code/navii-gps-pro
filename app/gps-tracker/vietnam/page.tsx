import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("vietnam");
export const metadata = generateInternationalMetadata(country);

export default function VietnamPage() {
  return <CountryGpsPage country={country} />;
}
