import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("singapore");

export const metadata = generateInternationalMetadata(country);

export default function SingaporePage() {
  return <CountryGpsPage country={country} />;
}
