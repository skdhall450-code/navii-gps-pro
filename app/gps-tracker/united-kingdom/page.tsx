import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("united-kingdom");

export const metadata = generateInternationalMetadata(country);

export default function UnitedKingdomPage() {
  return <CountryGpsPage country={country} />;
}
