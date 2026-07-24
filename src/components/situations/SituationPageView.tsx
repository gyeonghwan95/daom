import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { QuickInquiryInlineCard } from "@/components/quick-inquiry";
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
import { NationwideRemoteBanner } from "@/components/nationwide/NationwideRemoteBanner";
import { recommendationFromSituation } from "@/lib/internal-links";
import { shouldShowNationwideRegionChip } from "@/lib/nationwide/show-region-chip";
import {
  getRelatedSituationLinks,
  getSituationBySlug,
  getSituationCategoryById,
} from "@/lib/situations";
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

  const category = getSituationCategoryById(situation.situationCategory);
  const relatedSituations = getRelatedSituationLinks(situation);

  const summaryBullets = [
    situation.conclusion,
    situation.firstChecks[0] ? `먼저 확인: ${situation.firstChecks[0]}` : null,
    situation.solutions[0]
      ? `선택지: ${situation.solutions[0].title}`
      : null,
    situation.procedures[0]
      ? `예상 절차: ${situation.procedures[0]}`
      : null,
  ].filter((item): item is string => Boolean(item)).slice(0, 4);

  const tocItems = [
    { id: "conclusion", label: "핵심 결론" },
    { id: "situation-check", label: "이런 상황인가요?" },
    { id: "first-checks", label: "지금 가장 먼저 할 일" },
    { id: "solutions", label: "해결 방법과 선택 기준" },
    { id: "self-handle", label: "혼자 처리해도 되는 경우" },
    { id: "lawyer-needed", label: "법무사 상담이 필요한 경우" },
    { id: "cost-factors", label: "비용·기간 요소" },
    { id: "common-mistakes", label: "자주 하는 실수" },
    { id: "case-example", label: "상담 사례" },
    { id: "documents", label: "필요한 서류" },
    { id: "procedures", label: "예상 절차" },
    { id: "diagnosis-links", label: "관련 자가진단" },
    { id: "service-links", label: "관련 서비스·허브" },
    { id: "faq-links", label: "관련 FAQ" },
    ...(relatedSituations.length > 0
      ? [{ id: "related-situations", label: "비슷한 상황" }]
      : []),
    ...(situation.extraLinks.length > 0
      ? [{ id: "more-links", label: "더 보기" }]
      : []),
    { id: "faq", label: "자주 묻는 질문" },
    { id: "consultation", label: "상담 문의" },
  ];

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={page.h1}
        intro={page.intro}
        keywords={page.primaryKeywords}
        eyebrow={`${category.label} · 상황 안내`}
        ctaLabel="상담 문의하기"
        showDiagnosisCta={false}
        showAboutLawyerCta
        showNationwideChip={shouldShowNationwideRegionChip(
          page.path,
          page.slug,
          situation.serviceSlug,
        )}
      />

      {shouldShowNationwideRegionChip(
        page.path,
        page.slug,
        situation.serviceSlug,
      ) ? (
        <NationwideRemoteBanner />
      ) : null}

      {slug === "payment-order-certified-mail" ? (
        <ServiceConversionEnhancements
          conversionKey={slug}
          pageSlug={slug}
          placement="top"
        />
      ) : null}

      <SummaryBox items={summaryBullets} />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="conclusion" title="핵심 결론">
        <p className="text-base leading-relaxed text-navy md:text-lg">
          {situation.conclusion}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-navy/65">
          <Link href={category.path} className="font-semibold text-navy-light hover:text-navy">
            {category.label} 허브
          </Link>
          에서 비슷한 상황도 함께 확인할 수 있습니다.
        </p>
      </ContentSection>

      <ContentSection id="situation-check" title="이런 상황인가요?">
        <ChecklistBox items={situation.situationChecklist} />
      </ContentSection>

      <ContentSection id="first-checks" title="지금 가장 먼저 할 일">
        <ChecklistBox items={situation.firstChecks} />
      </ContentSection>

      <ContentSection id="solutions" title="가능한 해결 방법과 선택 기준">
        <ul className="space-y-4">
          {situation.solutions.map((solution) => (
            <li
              key={solution.title}
              className="rounded-xl border border-navy/10 bg-white p-4 sm:p-5"
            >
              <h3 className="font-semibold text-navy">{solution.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/75 sm:text-base">
                {solution.body}
              </p>
              <p className="mt-2 text-sm text-navy/60">
                <span className="font-semibold text-navy/75">선택 기준: </span>
                {solution.whenToChoose}
              </p>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="self-handle" title="혼자 처리해도 되는 경우">
        <ChecklistBox items={situation.selfHandleCases} />
      </ContentSection>

      <ContentSection id="lawyer-needed" title="법무사 상담이 필요한 경우">
        <ChecklistBox items={situation.lawyerNeededCases} />
      </ContentSection>

      <ContentSection id="cost-factors" title="절차·기간·비용에 영향을 주는 요소">
        <ChecklistBox items={situation.costFactors} />
        <WarningBox title="비용·기간 안내">
          <p>
            등기·법원·공탁 비용과 법무사 수임료는 사건 복잡도에 따라 달라집니다.
            위 항목을 기준으로 상담 시 구분해 안내드립니다.
          </p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="common-mistakes" title="자주 하는 실수와 주의사항">
        <ChecklistBox items={situation.commonMistakes} />
      </ContentSection>

      <ContentSection id="case-example" title="현실적인 상담 사례">
        <div className="rounded-xl border border-beige-dark bg-beige/20 p-4 sm:p-5">
          <h3 className="font-semibold text-navy">{situation.caseExample.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy/75 sm:text-base">
            {situation.caseExample.body}
          </p>
        </div>
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

      <QuickInquiryInlineCard
        pageTitle={page.h1 || page.title}
        pageUrl={page.path}
      />

      <ContentSection id="procedures" title="예상 절차">
        <StepTimeline steps={situation.procedures} />
        <WarningBox title="법률·절차 고지">
          <p>
            위 순서는 일반적인 흐름입니다. 관할·서류·당사자 관계·시점에 따라
            달라질 수 있으며, 본 안내는 법률 자문을 대체하지 않습니다.
          </p>
        </WarningBox>
      </ContentSection>

      <ContentSection id="diagnosis-links" title="관련 자가진단">
        <p className="mb-4 text-sm text-navy/65 md:text-base">
          질문에 답하며 위험도와 다음 절차를 확인할 수 있습니다.
        </p>
        <RelatedContentGrid links={situation.diagnosisLinks} />
      </ContentSection>

      <ContentSection id="service-links" title="관련 업무·허브">
        <RelatedContentGrid links={situation.serviceLinks} />
      </ContentSection>

      <ContentSection id="faq-links" title="관련 FAQ">
        <RelatedContentGrid links={situation.faqLinks} />
      </ContentSection>

      {relatedSituations.length > 0 ? (
        <ContentSection id="related-situations" title="비슷한 상황 안내">
          <RelatedContentGrid links={relatedSituations} />
        </ContentSection>
      ) : null}

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
