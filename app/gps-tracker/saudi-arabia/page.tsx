import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("saudi-arabia");

export const metadata = generateInternationalMetadata(country);

export default function SaudiArabiaPage() {
  return <CountryGpsPage country={country} />;
}
