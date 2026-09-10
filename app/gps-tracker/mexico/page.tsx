import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("mexico");
export const metadata = generateInternationalMetadata(country);

export default function MexicoPage() {
  return <CountryGpsPage country={country} />;
}
