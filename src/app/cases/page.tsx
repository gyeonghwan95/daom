import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { StaticRedirect } from "@/components/seo/StaticRedirect";

export const metadata: Metadata = {
  title: "사례 안내 이동 | 다옴법무사사무소",
  description: "다옴법무사사무소 사례 페이지로 이동합니다.",
  robots: { index: false, follow: true },
};

export default function LegacyCasesIndexPage() {
  return (
    <PageContainer>
      <StaticRedirect
        targetPath="/services#cases"
        message="사례 안내 페이지로 이동합니다."
      />
    </PageContainer>
  );
}
