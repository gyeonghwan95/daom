import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ConsultationInquiryForm } from "@/components/conversion/ConsultationInquiryForm";
import { InquiryFormLoader } from "@/components/conversion/InquiryFormLoader";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "상담 신청",
  description:
    "다옴법무사사무소 상담 신청 양식입니다. 상속등기·부동산등기·법인등기·개인회생 등 상담 분야를 선택해 현재 상황을 보내 주세요.",
  path: "/contact/inquiry",
});

export default function ContactInquiryPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="상담 신청"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상담", href: "/contact" },
          { label: "상담 신청" },
        ]}
        currentPath="/contact/inquiry"
        intro="이름·연락처·상담 분야·현재 상황을 적어 주시면 검토가 수월합니다. 서류를 모두 준비하지 못하셔도 괜찮습니다."
        relatedLinks={[
          { href: "/contact", label: "상담 안내" },
          { href: "/location", label: "오시는 길" },
          { href: "/services", label: "업무안내" },
        ]}
        showConsultationCTA={false}
      >
        <Suspense fallback={<ConsultationInquiryForm />}>
          <InquiryFormLoader />
        </Suspense>
      </PageContentSection>
    </PageContainer>
  );
}
