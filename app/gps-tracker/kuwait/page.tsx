import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import {
  generateInternationalMetadata,
  getInternationalCountry,
} from "@/lib/seo/internationalCountries";

const country = getInternationalCountry("kuwait");

export const metadata = generateInternationalMetadata(country);

export default function KuwaitPage() {
  return <CountryGpsPage country={country} />;
}
