import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  InfoCard,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { getPreservationRegistrationContent } from "@/lib/local-landing/preservation-registration-content";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type PreservationRegistrationPageViewProps = {
  page: PageData;
};

export function PreservationRegistrationPageView({
  page,
}: PreservationRegistrationPageViewProps) {
  const content = getPreservationRegistrationContent();
  const cover = getCoverImageForPageData(page);

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const tocItems = [
    { id: "summary", label: "핵심 요약" },
    { id: "what-is", label: "보존등기란" },
    { id: "building-types", label: "건물 유형" },
    { id: "comparison", label: "일반·집합 비교" },
    { id: "documents", label: "준비 서류" },
    { id: "procedures", label: "진행 절차" },
    { id: "problems", label: "자주 생기는 문제" },
    { id: "share-guide", label: "링크 공유 안내" },
    { id: "busan", label: "부산 상담" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "related", label: "관련 페이지" },
    { id: "consultation", label: "상담 문의" },
  ];

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        introParagraphs={content.heroParagraphs}
        keywords={content.primaryKeywords}
        ctaHref="/contact"
        ctaLabel="보존등기 상담하기"
        secondaryCta={{
          href: "#documents",
          label: "건축주 준비서류 확인하기",
        }}
        showDiagnosisCta={false}
      />

      <ServiceConversionEnhancements
        conversionKey="부산신축건물보존등기"
        pageSlug={page.slug}
        placement="top"
      />

      <div id="summary">
        <SummaryBox items={content.summaryBullets} />
      </div>

      <PageTableOfContents items={tocItems} />

      <ContentSection id="what-is" title={content.whatIsTitle}>
        <ProseParagraphs paragraphs={content.whatIsParagraphs} />
      </ContentSection>

      <ContentSection id="building-types" title="어떤 건물에 필요할까요?">
        <p className="body-text mb-4 max-w-3xl">
          건물 용도와 집합건물 여부에 따라 보존등기 절차와 서류가 달라질 수
          있습니다. 아래 유형을 참고해 해당하는지 확인해 보세요.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.buildingTypes.map((card) => (
            <InfoCard key={card.title} variant="highlight">
              <h3 className="text-base font-semibold text-navy md:text-lg">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/85 md:text-base">
                {card.description}
              </p>
              <p className="mt-3 text-xs text-navy/60 md:text-sm">
                {card.keywords.join(" · ")}
              </p>
            </InfoCard>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        id="comparison"
        title="일반건물 보존등기와 집합건물 보존등기 차이"
      >
        <div className="overflow-x-auto rounded-xl border border-beige-dark">
          <table className="min-w-full text-left text-sm md:text-base">
            <thead className="bg-beige/60 text-navy">
              <tr>
                <th className="px-4 py-3 font-semibold md:px-6">항목</th>
                <th className="px-4 py-3 font-semibold md:px-6">
                  일반건물 보존등기
                </th>
                <th className="px-4 py-3 font-semibold md:px-6">
                  집합건물 보존등기
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-dark bg-white">
              {content.comparisonRows.map((row) => (
                <tr key={row.label}>
                  <th className="px-4 py-3 font-medium text-navy md:px-6">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 leading-relaxed text-navy/85 md:px-6">
                    {row.general}
                  </td>
                  <td className="px-4 py-3 leading-relaxed text-navy/85 md:px-6">
                    {row.collective}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <WarningBox title="비교표 안내">
          <p>{content.comparisonNote}</p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="documents" title="건축주가 준비해야 할 서류">
        <ChecklistBox items={content.documents} note={content.documentsNote} />
      </ContentSection>

      <ContentSection id="procedures" title="보존등기 진행 절차">
        <StepTimeline steps={content.procedures} />
        <WarningBox title="절차 안내">
          <p>
            위 단계는 일반적인 흐름입니다. 건축 형태·건축주·관할 등기소에 따라
            순서나 소요 기간이 달라질 수 있으니 상담 시 확인해 보시면 좋습니다.
          </p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="problems" title="보존등기에서 자주 생기는 문제">
        <div className="grid gap-3 sm:grid-cols-2">
          {content.commonProblems.map((problem) => (
            <WarningBox key={problem} title="주의 사항">
              <p>{problem}</p>
            </WarningBox>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="share-guide" title={content.shareGuidanceTitle}>
        <div className="rounded-xl border border-navy/10 bg-beige/30 p-6 md:p-8">
          <ProseParagraphs paragraphs={content.shareGuidanceParagraphs} />
          <p className="mt-4 text-sm text-navy/70">
            이 페이지 주소:{" "}
            <Link href={page.path} className="font-medium text-navy underline">
              daom-law.com{page.path}
            </Link>
          </p>
        </div>
      </ContentSection>

      <ContentSection id="busan" title={content.busanConsultTitle}>
        <ProseParagraphs paragraphs={content.busanConsultParagraphs} />
      </ContentSection>

      <ContentSection id="public-agency" title="공공기관 신축건물 보존등기">
        <p className="body-text max-w-3xl">
          공공청사·시설·산업단지 신축 건물도 사용승인 후 보존등기가 필요한 경우가
          많습니다. 공공기관 담당자는 법인등기·부동산등기·촉탁등기를 함께 검토할 때{" "}
          <Link href="/공공기관등기업무" className="font-medium text-navy underline">
            공공기관 등기업무 안내
          </Link>
          를 참고하시면 좋습니다.
        </p>
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <ContentSection id="related" title="관련 내부 링크">
        <RelatedContentGrid links={content.internalLinks} />
      </ContentSection>

      <ServiceConversionEnhancements
        conversionKey="부산신축건물보존등기"
        pageSlug={page.slug}
        placement="detail"
      />
      <ServiceConversionEnhancements
        conversionKey="부산신축건물보존등기"
        pageSlug={page.slug}
        placement="post-faq"
      />
      <ServiceConversionEnhancements
        conversionKey="부산신축건물보존등기"
        pageSlug={page.slug}
        placement="footer"
      />

      <div id="consultation">
        <ConsultationCTA
          title="보존등기 상담"
          description={content.bottomCtaText}
          buttonLabel="보존등기 상담하기"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contact/inquiry?field=preservation-registration"
            className="btn-primary inline-flex min-h-12 items-center px-6"
          >
            보존등기 상담 신청하기
          </Link>
          <Link
            href="/contact/inquiry?field=preservation-registration"
            className="btn-secondary inline-flex min-h-12 items-center px-6"
          >
            서류 준비 문의하기
          </Link>
        </div>
        <div className="mt-6">
          <CTASection
            pageType="faq"
            title="부산 신축건물 보존등기 상담"
            description={content.bottomCtaText}
            pageSlug={page.slug}
          />
        </div>
      </div>
    </article>
  );
}
