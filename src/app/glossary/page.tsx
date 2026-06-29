import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlossaryHubView } from "@/components/glossary/GlossaryHubView";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveGlossaryHubPageData } from "@/lib/glossary";

export function generateMetadata(): Metadata {
  const page = resolveGlossaryHubPageData();
  return pageDataToMetadata(page);
}

export default function GlossaryHubPage() {
  const page = resolveGlossaryHubPageData();

  return (
    <PageContainer>
      <GlossaryHubView page={page} />
    </PageContainer>
  );
}
