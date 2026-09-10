import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("denmark");
export const metadata = generateInternationalMetadata(country);

export default function DenmarkPage() {
  return <CountryGpsPage country={country} />;
}
