import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { CasesExplorerView } from "@/components/cases/CasesExplorerView";
import { getAllCaseRecords } from "@/lib/cases";
import { resolveCasesHubPageData } from "@/lib/cases/builder";
import { pageDataToMetadata } from "@/lib/pageData/metadata";

export function generateMetadata(): Metadata {
  const page = resolveCasesHubPageData();
  return pageDataToMetadata(page);
}

export default function CasesExplorerPage() {
  const page = resolveCasesHubPageData();
  const cases = getAllCaseRecords();

  return (
    <PageContainer>
      <CasesExplorerView page={page} cases={cases} />
    </PageContainer>
  );
}
