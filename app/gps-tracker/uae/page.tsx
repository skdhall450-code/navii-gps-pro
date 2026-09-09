import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("uae");

export const metadata = generateInternationalMetadata(country);

export default function UaePage() {
  return <CountryGpsPage country={country} />;
}
