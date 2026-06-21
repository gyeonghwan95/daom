import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.contact);

export default function ContactPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="상담 문의"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "상담" },
        ]}
        currentPath="/contact"
        intro="상속·등기·회생 등 법률 문제로 고민이 있으시면 다옴법무사사무소 안윤정 법무사에게 연락해 주세요. 전화, 카카오톡, 네이버 톡톡 중 편한 방법으로 상담하실 수 있으며, 사무소 방문은 예약 후 이용해 주세요."
        introSideImage={siteImages.contact.top}
        relatedLinks={[
          { href: "/location", label: "오시는 길" },
          { href: "/services", label: "업무안내" },
          { href: "/faq", label: "자주 묻는 질문" },
          { href: "/office", label: "사무소 소개" },
        ]}
        showConsultationCTA={false}
      >
        <ContactSection />
      </PageContentSection>
    </PageContainer>
  );
}
