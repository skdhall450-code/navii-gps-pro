import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("sweden");
export const metadata = generateInternationalMetadata(country);

export default function SwedenPage() {
  return <CountryGpsPage country={country} />;
}
