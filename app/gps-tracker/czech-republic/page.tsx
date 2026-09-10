import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("czech-republic");
export const metadata = generateInternationalMetadata(country);

export default function CzechRepublicPage() {
  return <CountryGpsPage country={country} />;
}
