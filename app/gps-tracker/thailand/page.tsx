import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("thailand");
export const metadata = generateInternationalMetadata(country);

export default function ThailandPage() {
  return <CountryGpsPage country={country} />;
}
