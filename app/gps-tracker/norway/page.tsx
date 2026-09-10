import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("norway");
export const metadata = generateInternationalMetadata(country);

export default function NorwayPage() {
  return <CountryGpsPage country={country} />;
}
