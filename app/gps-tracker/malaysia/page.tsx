import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("malaysia");

export const metadata = generateInternationalMetadata(country);

export default function MalaysiaPage() {
  return <CountryGpsPage country={country} />;
}
