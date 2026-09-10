import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("peru");
export const metadata = generateInternationalMetadata(country);

export default function PeruPage() {
  return <CountryGpsPage country={country} />;
}
