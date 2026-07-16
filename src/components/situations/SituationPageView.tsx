import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import {
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { recommendationFromSituation } from "@/lib/internal-links";
import { getSituationBySlug } from "@/lib/situations";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type SituationPageViewProps = {
  page: PageData;
  slug: string;
};

export function SituationPageView({ page, slug }: SituationPageViewProps) {
  const situation = getSituationBySlug(slug);
  const cover = getCoverImageForPageData(page);

  if (!situation) return null;

  const summaryBullets = [
    page.intro,
    situation.situationChecklist[0]
      ? `이런 상황이라면: ${situation.situationChecklist[0]}`
      : null,
    situation.firstChecks[0]
      ? `먼저 확인: ${situation.firstChecks[0]}`
      : null,
    situation.procedures[0]
      ? `예상 절차: ${situation.procedures[0]}`
      : null,
    situation.documents[0]
      ? `준비 서류: ${situation.documents[0]}`
      : null,
  ].filter((item): item is string => Boolean(item)).slice(0, 5);

  const tocItems = [
    { id: "situation-check", label: "이런 상황인가요?" },
    { id: "first-checks", label: "먼저 확인해야 할 것" },
    { id: "self-handle", label: "혼자 처리해도 되는 경우" },
    { id: "lawyer-needed", label: "법무사 상담이 필요한 경우" },
    { id: "documents", label: "필요한 서류" },
    { id: "procedures", label: "예상 절차" },
    { id: "diagnosis-links", label: "관련 자가진단" },
    { id: "service-links", label: "관련 서비스·허브" },
    { id: "faq-links", label: "관련 FAQ" },
    ...(situation.extraLinks.length > 0
      ? [{ id: "more-links", label: "더 보기" }]
      : []),
    { id: "faq", label: "자주 묻는 질문" },
    { id: "consultation", label: "상담 문의" },
  ];

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={page.h1}
        intro={page.intro}
        keywords={page.primaryKeywords}
        eyebrow="Situation Guide"
        ctaLabel="상담 문의하기"
      />

      {slug === "payment-order-certified-mail" ? (
        <>
          <ServiceConversionEnhancements
            conversionKey={slug}
            pageSlug={slug}
            placement="top"
          />
        </>
      ) : null}

      <SummaryBox items={summaryBullets} />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="situation-check" title="이런 상황인가요?">
        <ChecklistBox items={situation.situationChecklist} />
      </ContentSection>

      <ContentSection id="first-checks" title="먼저 확인해야 할 것">
        <ChecklistBox items={situation.firstChecks} />
      </ContentSection>

      <ContentSection id="self-handle" title="혼자 처리해도 되는 경우">
        <ChecklistBox items={situation.selfHandleCases} />
      </ContentSection>

      <ContentSection id="lawyer-needed" title="법무사 상담이 필요한 경우">
        <ChecklistBox items={situation.lawyerNeededCases} />
      </ContentSection>

      <ContentSection id="documents" title="필요한 서류">
        <ChecklistBox
          items={situation.documents}
          note="사안에 따라 추가 서류가 필요할 수 있습니다. 상담 전에 목록을 확인해 두시면 좋습니다."
        />
      </ContentSection>

      {slug === "payment-order-certified-mail" ? (
        <ServiceConversionEnhancements
          conversionKey={slug}
          pageSlug={slug}
          placement="mid"
        />
      ) : null}

      <ConsultationCTA
        title="비슷한 상황이라면 먼저 점검해 보세요"
        description="자가진단으로 위험도와 다음 절차를 확인한 뒤, 필요하면 상담을 요청하실 수 있습니다."
        buttonLabel="상담 문의하기"
      />

      <ContentSection id="procedures" title="예상 절차">
        <StepTimeline steps={situation.procedures} />
        <WarningBox title="절차 안내">
          <p>
            위 순서는 일반적인 흐름입니다. 관할·서류·당사자 관계에 따라
            달라질 수 있으니 참고용으로 확인해 주세요.
          </p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="diagnosis-links" title="관련 자가진단">
        <p className="mb-4 text-sm text-navy/65 md:text-base">
          질문에 답하며 위험도와 다음 절차를 확인할 수 있습니다.
        </p>
        <RelatedContentGrid links={situation.diagnosisLinks} />
      </ContentSection>

      <ContentSection id="service-links" title="관련 서비스·허브">
        <RelatedContentGrid links={situation.serviceLinks} />
      </ContentSection>

      <ContentSection id="faq-links" title="관련 FAQ">
        <RelatedContentGrid links={situation.faqLinks} />
      </ContentSection>

      {situation.extraLinks.length > 0 ? (
        <ContentSection id="more-links" title="더 보기">
          <RelatedContentGrid links={situation.extraLinks} />
        </ContentSection>
      ) : null}

      <DiagnosisFAQ items={page.faqs} />

      {slug === "payment-order-certified-mail" ? (
        <>
          <ServiceConversionEnhancements
            conversionKey={slug}
            pageSlug={slug}
            placement="detail"
          />
          <ServiceConversionEnhancements
            conversionKey={slug}
            pageSlug={slug}
            placement="post-faq"
          />
          <ServiceConversionEnhancements
            conversionKey={slug}
            pageSlug={slug}
            placement="footer"
          />
        </>
      ) : null}

      <RelatedRecommendations source={recommendationFromSituation(situation)} />

      <div id="consultation">
        <ConsultationCTA
          title="내 상황에 맞는 서류와 절차를 확인하고 상담하기"
          description={page.ctaText}
          buttonLabel="상담 문의하기"
        />
        <div className="mt-6">
          <LawyerConsultationGuide
            pageType="situation"
            title={page.ctaTitle}
            description={page.ctaText}
            showSecondaryLinks
            pageSlug={slug}
            diagnosisHref={situation.diagnosisLinks[0]?.href ?? "/자가진단"}
          />
        </div>
      </div>
    </article>
  );
}
