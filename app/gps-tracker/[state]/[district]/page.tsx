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
  notFound();
}
