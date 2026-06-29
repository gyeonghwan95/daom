import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SituationsHubView } from "@/components/situations/SituationsHubView";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveSituationsHubPageData } from "@/lib/situations";

export function generateMetadata(): Metadata {
  const page = resolveSituationsHubPageData();
  return pageDataToMetadata(page);
}

export default function SituationsHubPage() {
  const page = resolveSituationsHubPageData();

  return (
    <PageContainer>
      <SituationsHubView page={page} />
    </PageContainer>
  );
}
