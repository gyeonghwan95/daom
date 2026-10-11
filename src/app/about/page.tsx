import type { Metadata } from "next";
import { LawyerProfileNav } from "@/components/profile/LawyerProfileNav";
import { LawyerAtAGlance } from "@/components/profile/LawyerAtAGlance";
import { PageContainer } from "@/components/layout/PageContainer";
import { AboutExternalActivitiesMarquee } from "@/components/profile/AboutExternalActivitiesMarquee";
import { ActivitySectionBlock } from "@/components/profile/ActivitySectionBlock";
import { LawyerQualificationsSection } from "@/components/profile/LawyerQualificationsSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { LawyerEeatProfile } from "@/components/profile/LawyerEeatProfile";
import { LawyerTrackRecordTables } from "@/components/profile/LawyerTrackRecordTables";
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import { createPageMetadata } from "@/lib/metadata";
import { buildLawyerAboutSchemas } from "@/lib/seo/json-ld";
import { lawyerActivitySections } from "@/lib/lawyer-activities";
import { siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.about);

export default function AboutPage() {
  return (
    <PageContainer>
      <JsonLd data={buildLawyerAboutSchemas()} />
      <PageContentSection
        h1="안윤정 법무사 소개"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "법무사 소개" },
        ]}
        currentPath="/about"
        lead="내 일을 맡길 법무사, 안윤정입니다."
        intro="현재 상황과 서류를 함께 살펴, 필요한 절차와 비용을 설명하고 등기·신청 업무를 직접 진행합니다. 부산 해운대·센텀 다옴법무사사무소에서 상속·부동산·법인등기와 개인회생·파산을 맡고 있습니다. 자격·수상·언론·강의 이력과 실제 처리 사례는 아래에서 바로 확인하실 수 있습니다."
        introSideImage={siteImages.home.trust}
        relatedLinks={[
          { href: "/office", label: "사무소 소개" },
          { href: "/services", label: "업무안내" },
          { href: "/법률강의", label: "법률 강의·특강" },
          { href: "/강의이력", label: "강의 이력" },
          { href: "/강사소개", label: "강사 소개" },
          { href: "/media", label: "언론·활동" },
          { href: "/contact", label: "상담 신청" },
        ]}
        consultationDescription="안윤정 법무사에게 직접 상담을 요청하세요. 사건 내용을 듣고 진행 가능 여부와 예상 절차를 안내해 드립니다."
      >
        <div className="space-y-8">
          <LawyerProfileNav />
          <LawyerAtAGlance />
          <LawyerEeatProfile />
          <LawyerTrackRecordTables />
          <LawyerQualificationsSection profileImage={siteImages.about.profile} />

          <BusinessCredentialSlot
            path="/about"
            slug="about"
          />

          {lawyerActivitySections.map((section, index) =>
            section.id === "external" ? (
              <AboutExternalActivitiesMarquee key={section.id} />
            ) : (
              <ActivitySectionBlock
                key={section.id}
                section={section}
                imagePosition={index % 2 === 0 ? "left" : "right"}
              />
            ),
          )}
        </div>
      </PageContentSection>
    </PageContainer>
  );
}
