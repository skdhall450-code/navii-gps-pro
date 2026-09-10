import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("belgium");

export const metadata = generateInternationalMetadata(country);

export default function BelgiumPage() {
  return <CountryGpsPage country={country} />;
}
