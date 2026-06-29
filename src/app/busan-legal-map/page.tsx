import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { BusanLegalMapView } from "@/components/busan-legal-map/BusanLegalMapView";
import { resolveBusanLegalMapHubPageData } from "@/lib/busan-legal-map";
import { pageDataToMetadata } from "@/lib/pageData/metadata";

export function generateMetadata(): Metadata {
  const page = resolveBusanLegalMapHubPageData();
  return pageDataToMetadata(page);
}

export default function BusanLegalMapPage() {
  const page = resolveBusanLegalMapHubPageData();

  return (
    <PageContainer>
      <BusanLegalMapView page={page} />
    </PageContainer>
  );
}
