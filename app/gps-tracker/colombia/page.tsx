import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("colombia");
export const metadata = generateInternationalMetadata(country);

export default function ColombiaPage() {
  return <CountryGpsPage country={country} />;
}
