import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("japan");
export const metadata = generateInternationalMetadata(country);

export default function JapanPage() {
  return <CountryGpsPage country={country} />;
}
