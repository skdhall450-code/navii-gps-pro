import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("portugal");
export const metadata = generateInternationalMetadata(country);

export default function PortugalPage() {
  return <CountryGpsPage country={country} />;
}
