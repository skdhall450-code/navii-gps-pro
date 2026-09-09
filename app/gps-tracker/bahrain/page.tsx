import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("bahrain");

export const metadata = generateInternationalMetadata(country);

export default function BahrainPage() {
  return <CountryGpsPage country={country} />;
}
