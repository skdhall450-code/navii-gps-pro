import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("new-zealand");

export const metadata = generateInternationalMetadata(country);

export default function NewZealandPage() {
  return <CountryGpsPage country={country} />;
}
