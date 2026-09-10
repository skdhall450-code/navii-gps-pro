import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("south-korea");
export const metadata = generateInternationalMetadata(country);

export default function SouthKoreaPage() {
  return <CountryGpsPage country={country} />;
}
