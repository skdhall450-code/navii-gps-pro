import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("ireland");

export const metadata = generateInternationalMetadata(country);

export default function IrelandPage() {
  return <CountryGpsPage country={country} />;
}
