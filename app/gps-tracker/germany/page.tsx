import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("germany");

export const metadata = generateInternationalMetadata(country);

export default function GermanyPage() {
  return <CountryGpsPage country={country} />;
}
