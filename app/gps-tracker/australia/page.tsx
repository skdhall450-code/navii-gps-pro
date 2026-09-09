import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("australia");

export const metadata = generateInternationalMetadata(country);

export default function AustraliaPage() {
  return <CountryGpsPage country={country} />;
}
