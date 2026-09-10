import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("spain");

export const metadata = generateInternationalMetadata(country);

export default function SpainPage() {
  return <CountryGpsPage country={country} />;
}
