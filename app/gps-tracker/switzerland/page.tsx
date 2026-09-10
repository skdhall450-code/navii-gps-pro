import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("switzerland");

export const metadata = generateInternationalMetadata(country);

export default function SwitzerlandPage() {
  return <CountryGpsPage country={country} />;
}
