import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { ToolsHubView } from "@/components/tools/ToolsHubView";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveToolsHubPageData } from "@/lib/tools";

export function generateMetadata(): Metadata {
  const page = resolveToolsHubPageData();
  return pageDataToMetadata(page);
}

export default function ToolsHubPage() {
  const page = resolveToolsHubPageData();

  return (
    <PageContainer>
      <ToolsHubView page={page} />
    </PageContainer>
  );
}
