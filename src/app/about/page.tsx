import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteImage } from "@/components/media/SiteImage";
import { ActivitySectionBlock } from "@/components/profile/ActivitySectionBlock";
import { PageContentSection } from "@/components/page/PageContentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { buildPersonSchema } from "@/lib/seo/json-ld";
import { lawyerActivitySections, lawyerQualifications } from "@/lib/lawyer-activities";
import { siteImages } from "@/lib/site-images";
import { staticPageSeo } from "@/lib/seo/page-seo";

export const metadata: Metadata = createPageMetadata(staticPageSeo.about);

export default function AboutPage() {
  return (
    <PageContainer>
      <JsonLd data={buildPersonSchema()} />
      <PageContentSection
        h1="안윤정 법무사 소개"
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "소개" },
        ]}
        currentPath="/about"
        intro="다옴법무사사무소를 이끄는 안윤정 법무사는 부산 해운대·센텀에서 상속등기, 부동산등기, 법인등기, 개인회생·파산 업무를 수행합니다. 법무사·공인중개사·신용관리사 자격을 모두 갖추었고, 교육대학원 석사 과정을 통해 정식 교사 자격까지 보유한 법률 에듀케이터입니다. 개인 의뢰인 상담과 함께 기업·공공기관·지역사회를 위한 법률 지원, 정책 자문, 생활 법률 강의에도 적극 참여하고 있습니다."
        relatedLinks={[
          { href: "/office", label: "사무소 소개" },
          { href: "/services", label: "업무안내" },
          { href: "/media", label: "언론·활동" },
          { href: "/contact", label: "상담 신청" },
        ]}
        consultationDescription="안윤정 법무사에게 직접 상담을 요청하세요. 사건 내용을 듣고 진행 가능 여부와 예상 절차를 안내해 드립니다."
      >
        <div className="space-y-8">
          <section className="card-surface overflow-hidden p-0 md:grid md:grid-cols-5">
            <div className="relative aspect-[4/3] md:col-span-2 md:aspect-auto md:min-h-[280px]">
              <SiteImage
                {...siteImages.about.profile}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                priority
                className="h-full w-full"
              />
            </div>
            <div className="p-5 md:col-span-3 md:p-8">
              <h2 className="section-heading">주요 경력 및 자격</h2>
              <ul className="mt-4 space-y-2.5 text-base text-navy/80">
                {lawyerQualifications.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-navy-light" aria-hidden>
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {lawyerActivitySections.map((section, index) => (
            <ActivitySectionBlock
              key={section.id}
              section={section}
              imagePosition={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </PageContentSection>
    </PageContainer>
  );
}
