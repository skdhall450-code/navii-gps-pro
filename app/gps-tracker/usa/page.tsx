import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("usa");

export const metadata = generateInternationalMetadata(country);

export default function UsaPage() {
  return <CountryGpsPage country={country} />;
}
