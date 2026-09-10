import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("italy");

export const metadata = generateInternationalMetadata(country);

export default function ItalyPage() {
  return <CountryGpsPage country={country} />;
}
