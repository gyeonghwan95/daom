import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { ResourceHubView } from "@/components/resources/ResourceHubView";
import { buildSeoTitle, createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: buildSeoTitle("의뢰 전 준비자료｜상속·법인·미수금·부동산"),
  description:
    "상속등기를 앞둔 가족, 법인 변경을 준비하는 대표·담당자, 미수금이 있는 사업자, 잔금을 앞둔 매도인·매수인이 의뢰 전에 상황과 자료를 정리하는 정보글과 빈 정리표(PNG·PDF)입니다.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <PageContainer>
      <ResourceHubView />
    </PageContainer>
  );
}
