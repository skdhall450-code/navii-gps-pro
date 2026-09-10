import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("chile");
export const metadata = generateInternationalMetadata(country);

export default function ChilePage() {
  return <CountryGpsPage country={country} />;
}
