import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ConsultationInquiryForm } from "@/components/conversion/ConsultationInquiryForm";
import { InquiryFormLoader } from "@/components/conversion/InquiryFormLoader";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { staticPageSeo } from "@/lib/seo/page-seo";
import { INQUIRY_RELAXED_NOTE } from "@/lib/service-conversion/copy";

export const metadata: Metadata = createPageMetadata(staticPageSeo.contactInquiry);

export default function ContactInquiryPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="상담 신청"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상담 문의", href: "/contact" },
          { label: "상담 신청" },
        ]}
        currentPath="/contact/inquiry"
        intro={`약 1분이면 상담 신청을 완료할 수 있습니다. 이름·연락처·상담 분야·현재 상황을 남겨 주시면 사무소 이메일로 전달됩니다. ${INQUIRY_RELAXED_NOTE}`}
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
