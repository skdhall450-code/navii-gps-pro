import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("finland");
export const metadata = generateInternationalMetadata(country);

export default function FinlandPage() {
  return <CountryGpsPage country={country} />;
}
