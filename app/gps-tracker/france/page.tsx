import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("france");

export const metadata = generateInternationalMetadata(country);

export default function FrancePage() {
  return <CountryGpsPage country={country} />;
}
