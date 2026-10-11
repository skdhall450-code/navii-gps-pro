import { CountryGpsPage } from "@/components/seo/CountryGpsPage";
import { generateInternationalMetadata, getInternationalCountry } from "@/lib/seo/internationalCountries";
const country = getInternationalCountry("south-africa");
export const metadata = generateInternationalMetadata(country);
export default function Page() { return <CountryGpsPage country={country} />; }
