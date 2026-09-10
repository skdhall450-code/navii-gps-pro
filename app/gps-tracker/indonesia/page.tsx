import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("indonesia");
export const metadata = generateInternationalMetadata(country);

export default function IndonesiaPage() {
  return <CountryGpsPage country={country} />;
}
