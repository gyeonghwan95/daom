import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { AboutExternalActivitiesMarquee } from "@/components/profile/AboutExternalActivitiesMarquee";
import { ActivitySectionBlock } from "@/components/profile/ActivitySectionBlock";
import { LawyerQualificationsSection } from "@/components/profile/LawyerQualificationsSection";
import { PageContentSection } from "@/components/page/PageContentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { LawyerEeatProfile } from "@/components/profile/LawyerEeatProfile";
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
          { label: "소개" },
        ]}
        currentPath="/about"
        intro="다옴법무사사무소를 이끄는 안윤정 법무사는 부산 해운대구·센텀에서 상속등기, 부동산등기, 법인등기, 개인회생·파산 업무를 수행합니다. 법무사·공인중개사·신용관리사 자격을 모두 갖추었고, 교육대학원 석사 과정을 통해 정식 교사 자격까지 보유한 법률 에듀케이터입니다. 개인 의뢰인 상담과 함께 기업·공공기관·지역사회를 위한 법률 지원, 정책 자문, 생활 법률 강의에도 적극 참여하고 있습니다."
        introSideImage={siteImages.about.nameplate}
        relatedLinks={[
          { href: "/office", label: "사무소 소개" },
          { href: "/services", label: "업무안내" },
          { href: "/법률강의", label: "법률 강의·특강" },
          { href: "/강사소개", label: "강사 소개" },
          { href: "/media", label: "언론·활동" },
          { href: "/contact", label: "상담 신청" },
        ]}
        consultationDescription="안윤정 법무사에게 직접 상담을 요청하세요. 사건 내용을 듣고 진행 가능 여부와 예상 절차를 안내해 드립니다."
      >
        <div className="space-y-8">
          <LawyerEeatProfile />
          <LawyerQualificationsSection profileImage={siteImages.about.profile} />

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
