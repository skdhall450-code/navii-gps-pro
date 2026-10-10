import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";
const country = getInternationalCountry("kenya");
export const metadata = generateInternationalMetadata(country);
export default function Page() { return <CountryGpsPage country={country} />; }
