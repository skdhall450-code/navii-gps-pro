import Header from "@/components/layout/HeaderV2";
import Footer from "@/components/layout/FooterV2";

import SoftwareHero from "@/components/software/hero/SoftwareHero";
import DashboardPreview from "@/components/software/dashboard/DashboardPreview";
import SoftwareFeatures from "@/components/software/features/SoftwareFeatures";
import SoftwareModules from "@/components/software/modules/SoftwareModules";
import MobileApps from "@/components/software/apps/MobileApps";
import IndustrySupport from "@/components/software/industries/IndustrySupport";
import CTA from "@/components/software/CTA";

export default function SoftwarePage() {
  return (
    <>
      <Header />

      <main>

        <SoftwareHero />

        <DashboardPreview />

        <SoftwareFeatures />

        <SoftwareModules />

        <MobileApps />

        <IndustrySupport />

        <CTA />

      </main>

      <Footer />

    </>
  );
}