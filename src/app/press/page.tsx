import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { StaticRedirect } from "@/components/seo/StaticRedirect";

export const metadata: Metadata = {
  title: "언론보도 이동 | 다옴법무사사무소",
  description: "다옴법무사사무소 언론·활동 페이지로 이동합니다.",
  robots: { index: false, follow: true },
};

export default function LegacyPressIndexPage() {
  return (
    <PageContainer>
      <StaticRedirect
        targetPath="/media#press"
        message="언론·활동 페이지로 이동합니다."
      />
    </PageContainer>
  );
}
