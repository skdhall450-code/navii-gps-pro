import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HaryanaDistrictGpsPage } from "@/components/seo/HaryanaDistrictGpsPage";
import {
  generateHaryanaDistrictMetadata,
  getHaryanaDistrict,
  haryanaDistricts,
} from "@/lib/seo/haryanaDistricts";
import { PunjabDistrictGpsPage } from "@/components/seo/PunjabDistrictGpsPage";
import {
  generatePunjabDistrictMetadata,
  getPunjabDistrict,
  punjabDistricts,
} from "@/lib/seo/punjabDistricts";
import { DelhiDistrictGpsPage } from "@/components/seo/DelhiDistrictGpsPage";
import {
  delhiDistricts,
  generateDelhiDistrictMetadata,
  getDelhiDistrict,
} from "@/lib/seo/delhiDistricts";
import { UttarPradeshDistrictGpsPage } from "@/components/seo/UttarPradeshDistrictGpsPage";
import {
  generateUttarPradeshDistrictMetadata,
  getUttarPradeshDistrict,
  uttarPradeshDistricts,
} from "@/lib/seo/uttarPradeshDistricts";
import { TamilNaduDistrictGpsPage } from "@/components/seo/TamilNaduDistrictGpsPage";
import {
  generateTamilNaduDistrictMetadata,
  getTamilNaduDistrict,
  tamilNaduDistricts,
} from "@/lib/seo/tamilNaduDistricts";
import { KarnatakaDistrictGpsPage } from "@/components/seo/KarnatakaDistrictGpsPage";
import {
  generateKarnatakaDistrictMetadata,
  getKarnatakaDistrict,
  karnatakaDistricts,
} from "@/lib/seo/karnatakaDistricts";
import { AndhraPradeshDistrictGpsPage } from "@/components/seo/AndhraPradeshDistrictGpsPage";
import {
  andhraPradeshDistricts,
  generateAndhraPradeshDistrictMetadata,
  getAndhraPradeshDistrict,
} from "@/lib/seo/andhraPradeshDistricts";
import { TelanganaDistrictGpsPage } from "@/components/seo/TelanganaDistrictGpsPage";
import {
  generateTelanganaDistrictMetadata,
  getTelanganaDistrict,
  telanganaDistricts,
} from "@/lib/seo/telanganaDistricts";
import { KeralaDistrictGpsPage } from "@/components/seo/KeralaDistrictGpsPage";
import {
  generateKeralaDistrictMetadata,
  getKeralaDistrict,
  keralaDistricts,
} from "@/lib/seo/keralaDistricts";
import { MaharashtraDistrictGpsPage } from "@/components/seo/MaharashtraDistrictGpsPage";
import { generateMaharashtraDistrictMetadata, getMaharashtraDistrict, maharashtraDistricts } from "@/lib/seo/maharashtraDistricts";
import { GujaratDistrictGpsPage } from "@/components/seo/GujaratDistrictGpsPage";
import { generateGujaratDistrictMetadata, getGujaratDistrict, gujaratDistricts } from "@/lib/seo/gujaratDistricts";
import { RajasthanDistrictGpsPage } from "@/components/seo/RajasthanDistrictGpsPage";
import { generateRajasthanDistrictMetadata, getRajasthanDistrict, rajasthanDistricts } from "@/lib/seo/rajasthanDistricts";
import { MadhyaPradeshDistrictGpsPage } from "@/components/seo/MadhyaPradeshDistrictGpsPage";
import { generateMadhyaPradeshDistrictMetadata, getMadhyaPradeshDistrict, madhyaPradeshDistricts } from "@/lib/seo/madhyaPradeshDistricts";
import { ChhattisgarhDistrictGpsPage } from "@/components/seo/ChhattisgarhDistrictGpsPage";
import { chhattisgarhDistricts, generateChhattisgarhDistrictMetadata, getChhattisgarhDistrict } from "@/lib/seo/chhattisgarhDistricts";

type PageProps = {
  params: Promise<{ state: string; district: string }>;
};

export function generateStaticParams() {
  return [
    ...haryanaDistricts.map((district) => ({ state: "haryana", district: district.slug })),
    ...punjabDistricts.map((district) => ({ state: "punjab", district: district.slug })),
    ...delhiDistricts.map((district) => ({ state: "delhi", district: district.slug })),
    ...uttarPradeshDistricts.map((district) => ({ state: "uttar-pradesh", district: district.slug })),
    ...tamilNaduDistricts.map((district) => ({ state: "tamil-nadu", district: district.slug })),
    ...karnatakaDistricts.map((district) => ({ state: "karnataka", district: district.slug })),
    ...andhraPradeshDistricts.map((district) => ({ state: "andhra-pradesh", district: district.slug })),
    ...telanganaDistricts.map((district) => ({ state: "telangana", district: district.slug })),
    ...keralaDistricts.map((district) => ({ state: "kerala", district: district.slug })),
    ...maharashtraDistricts.map((district) => ({ state: "maharashtra", district: district.slug })),
    ...gujaratDistricts.map((district) => ({ state: "gujarat", district: district.slug })),
    ...rajasthanDistricts.map((district) => ({ state: "rajasthan", district: district.slug })),
    ...madhyaPradeshDistricts.map((district) => ({ state: "madhya-pradesh", district: district.slug })),
    ...chhattisgarhDistricts.map((district) => ({ state: "chhattisgarh", district: district.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, district: slug } = await params;
  if (state === "haryana") {
    const district = getHaryanaDistrict(slug);
    return district ? generateHaryanaDistrictMetadata(district) : {};
  }
  if (state === "punjab") {
    const district = getPunjabDistrict(slug);
    return district ? generatePunjabDistrictMetadata(district) : {};
  }
  if (state === "delhi") {
    const district = getDelhiDistrict(slug);
    return district ? generateDelhiDistrictMetadata(district) : {};
  }
  if (state === "uttar-pradesh") {
    const district = getUttarPradeshDistrict(slug);
    return district ? generateUttarPradeshDistrictMetadata(district) : {};
  }
  if (state === "tamil-nadu") {
    const district = getTamilNaduDistrict(slug);
    return district ? generateTamilNaduDistrictMetadata(district) : {};
  }
  if (state === "karnataka") {
    const district = getKarnatakaDistrict(slug);
    return district ? generateKarnatakaDistrictMetadata(district) : {};
  }
  if (state === "andhra-pradesh") {
    const district = getAndhraPradeshDistrict(slug);
    return district ? generateAndhraPradeshDistrictMetadata(district) : {};
  }
  if (state === "telangana") {
    const district = getTelanganaDistrict(slug);
    return district ? generateTelanganaDistrictMetadata(district) : {};
  }
  if (state === "kerala") {
    const district = getKeralaDistrict(slug);
    return district ? generateKeralaDistrictMetadata(district) : {};
  }
  if (state === "maharashtra") {
    const district = getMaharashtraDistrict(slug);
    return district ? generateMaharashtraDistrictMetadata(district) : {};
  }
  if (state === "gujarat") {
    const district = getGujaratDistrict(slug);
    return district ? generateGujaratDistrictMetadata(district) : {};
  }
  if (state === "rajasthan") {
    const district = getRajasthanDistrict(slug);
    return district ? generateRajasthanDistrictMetadata(district) : {};
  }
  if (state === "madhya-pradesh") {
    const district = getMadhyaPradeshDistrict(slug);
    return district ? generateMadhyaPradeshDistrictMetadata(district) : {};
  }
  if (state === "chhattisgarh") {
    const district = getChhattisgarhDistrict(slug);
    return district ? generateChhattisgarhDistrictMetadata(district) : {};
  }
  return {};
}

export default async function DistrictGpsTrackerPage({ params }: PageProps) {
  const { state, district: slug } = await params;
  if (state === "haryana") {
    const district = getHaryanaDistrict(slug);
    if (!district) notFound();
    return <HaryanaDistrictGpsPage district={district} />;
  }
  if (state === "punjab") {
    const district = getPunjabDistrict(slug);
    if (!district) notFound();
    return <PunjabDistrictGpsPage district={district} />;
  }
  if (state === "delhi") {
    const district = getDelhiDistrict(slug);
    if (!district) notFound();
    return <DelhiDistrictGpsPage district={district} />;
  }
  if (state === "uttar-pradesh") {
    const district = getUttarPradeshDistrict(slug);
    if (!district) notFound();
    return <UttarPradeshDistrictGpsPage district={district} />;
  }
  if (state === "tamil-nadu") {
    const district = getTamilNaduDistrict(slug);
    if (!district) notFound();
    return <TamilNaduDistrictGpsPage district={district} />;
  }
  if (state === "karnataka") {
    const district = getKarnatakaDistrict(slug);
    if (!district) notFound();
    return <KarnatakaDistrictGpsPage district={district} />;
  }
  if (state === "andhra-pradesh") {
    const district = getAndhraPradeshDistrict(slug);
    if (!district) notFound();
    return <AndhraPradeshDistrictGpsPage district={district} />;
  }
  if (state === "telangana") {
    const district = getTelanganaDistrict(slug);
    if (!district) notFound();
    return <TelanganaDistrictGpsPage district={district} />;
  }
  if (state === "kerala") {
    const district = getKeralaDistrict(slug);
    if (!district) notFound();
    return <KeralaDistrictGpsPage district={district} />;
  }
  if (state === "maharashtra") {
    const district = getMaharashtraDistrict(slug);
    if (!district) notFound();
    return <MaharashtraDistrictGpsPage district={district} />;
  }
  if (state === "gujarat") {
    const district = getGujaratDistrict(slug);
    if (!district) notFound();
    return <GujaratDistrictGpsPage district={district} />;
  }
  if (state === "rajasthan") {
    const district = getRajasthanDistrict(slug);
    if (!district) notFound();
    return <RajasthanDistrictGpsPage district={district} />;
  }
  if (state === "madhya-pradesh") {
    const district = getMadhyaPradeshDistrict(slug);
    if (!district) notFound();
    return <MadhyaPradeshDistrictGpsPage district={district} />;
  }
  if (state === "chhattisgarh") {
    const district = getChhattisgarhDistrict(slug);
    if (!district) notFound();
    return <ChhattisgarhDistrictGpsPage district={district} />;
  }
  notFound();
}
