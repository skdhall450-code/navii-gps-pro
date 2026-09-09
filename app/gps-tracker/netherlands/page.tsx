import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("netherlands");

export const metadata = generateInternationalMetadata(country);

export default function NetherlandsPage() {
  return <CountryGpsPage country={country} />;
}
