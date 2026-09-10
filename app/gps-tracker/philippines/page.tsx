import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("philippines");
export const metadata = generateInternationalMetadata(country);

export default function PhilippinesPage() {
  return <CountryGpsPage country={country} />;
}
