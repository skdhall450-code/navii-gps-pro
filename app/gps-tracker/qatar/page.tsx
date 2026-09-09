import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("qatar");

export const metadata = generateInternationalMetadata(country);

export default function QatarPage() {
  return <CountryGpsPage country={country} />;
}
