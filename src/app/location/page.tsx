import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { LocationRegionHubLinks } from "@/components/location/LocationRegionHubLinks";
import { LocationSection } from "@/components/sections/LocationSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { createPageMetadata } from "@/lib/metadata";
import { getMainLandingHubLinks } from "@/lib/seo/internal-links";
import { getOfficeLocationWithAccess } from "@/lib/office-location";
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
        // 방문 예약 안내는 바로 아래 노란 배너가 보여 주므로 소개 문장에서는 뺀다(같은 문장이 연달아 나왔다, 2026-11-15)
        intro={`${siteConfig.name}는 ${getOfficeLocationWithAccess()}에 있습니다.`}
        relatedLinks={[
          ...getMainLandingHubLinks().slice(0, 8),
          { href: "/등기관할과사무소위치", label: "등기 관할과 사무소 위치" },
          { href: "/contact", label: "상담 신청" },
          { href: "/office", label: "사무소 소개" },
          { href: "/부산법무사무소", label: "부산 법무사 사무소 안내 — 업무·상담 방법" },
          { href: "/services", label: "업무안내" },
          { href: "/faq", label: "자주 묻는 질문" },
        ]}
        consultationDescription="찾아오시기 어려우시면 전화·카카오톡·네이버 톡톡으로도 상담 가능합니다."
      >
        <LocationSection />
        <LocationRegionHubLinks />
      </PageContentSection>
    </PageContainer>
  );
}
