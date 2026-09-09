import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("oman");

export const metadata = generateInternationalMetadata(country);

export default function OmanPage() {
  return <CountryGpsPage country={country} />;
}
