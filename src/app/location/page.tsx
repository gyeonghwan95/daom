import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { LocationSection } from "@/components/sections/LocationSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { getOfficeLocationWithAccess, officeLocation } from "@/lib/office-location";
import { siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata(staticPageSeo.location);

export default function LocationPage() {
  return (
    <PageContainer>
      <PageContentSection
        h1="오시는 길"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "오시는 길" },
        ]}
        currentPath="/location"
        coverImage={siteImages.location.header}
        intro={`${siteConfig.name}는 ${getOfficeLocationWithAccess()}에 있습니다. ${officeLocation.visitNoticeDetail}`}
        relatedLinks={[
          { href: "/contact", label: "상담 신청" },
          { href: "/office", label: "사무소 소개" },
          { href: "/services", label: "업무안내" },
          { href: "/faq", label: "자주 묻는 질문" },
        ]}
        consultationDescription="찾아오시기 어려우시면 전화·카카오톡·네이버 톡톡으로도 상담 가능합니다."
      >
        <LocationSection />
      </PageContentSection>
    </PageContainer>
  );
}
