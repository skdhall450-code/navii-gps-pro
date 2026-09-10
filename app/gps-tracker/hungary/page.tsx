import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("hungary");
export const metadata = generateInternationalMetadata(country);

export default function HungaryPage() {
  return <CountryGpsPage country={country} />;
}
