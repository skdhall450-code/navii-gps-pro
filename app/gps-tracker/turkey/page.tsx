import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("turkey");
export const metadata = generateInternationalMetadata(country);

export default function TurkeyPage() {
  return <CountryGpsPage country={country} />;
}
