import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ConsultationInquiryForm } from "@/components/conversion/ConsultationInquiryForm";
import { InquiryFormLoader } from "@/components/conversion/InquiryFormLoader";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(
  staticPageSeo.contactInquiry,
);

export default function ContactInquiryPage() {
  return (
    <PageContainer>
      <PageContentSection
        showCostNote={false}
        h1="상담 신청"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상담 문의", href: "/contact" },
          { label: "상담 신청" },
        ]}
        currentPath="/contact/inquiry"
        intro="연락처와 상황 한두 줄만 남기시면 상담 신청이 완료됩니다. 안윤정 법무사가 직접 읽고, 평일 2시간 안에 연락드립니다."
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
