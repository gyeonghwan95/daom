import Link from "next/link";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import {
  ArticleSummary,
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  RelatedContentGrid,
  StepTimeline,
  WarningBox,
} from "@/components/readability";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
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

/** 상황 데이터를 자연스러운 줄글 문단으로 조합 (카드 반복 대신) */
function buildSituationBodyParagraphs(situation: NonNullable<
  ReturnType<typeof getSituationBySlug>
>): string[] {
  const paragraphs: string[] = [];

  paragraphs.push(situation.conclusion);

  if (situation.situationChecklist.length > 0) {
    paragraphs.push(
      `이런 상황으로 검색·상담을 찾는 경우가 많습니다. ${situation.situationChecklist
        .slice(0, 4)
        .join(" ")} 위와 비슷한지 먼저 짚어 보시면, 아래 절차·서류 안내가 더 잘 맞습니다.`,
    );
  }

  if (situation.firstChecks.length > 0) {
    paragraphs.push(
      `준비가 덜 된 상태라면 한꺼번에 서류를 모으기보다, 지금 확인 가능한 것부터 정리하는 편이 안전합니다. ${situation.firstChecks
        .slice(0, 3)
        .map((item, i) => `${i + 1}) ${item}`)
        .join(" ")}`,
    );
  }

  if (situation.solutions.length > 0) {
    const solutionLines = situation.solutions
      .slice(0, 3)
      .map(
        (s) =>
          `「${s.title}」은 ${s.body} 선택 기준으로는 ${s.whenToChoose}`,
      )
      .join(" ");
    paragraphs.push(
      `비슷해 보이는 선택지도 조건에 따라 갈립니다. ${solutionLines}`,
    );
  }

  if (situation.selfHandleCases.length > 0 || situation.lawyerNeededCases.length > 0) {
    const self = situation.selfHandleCases.slice(0, 2).join(" ");
    const lawyer = situation.lawyerNeededCases.slice(0, 2).join(" ");
    paragraphs.push(
      [
        self
          ? `혼자 서류·절차를 진행해 볼 수 있는 경우로는 ${self} 정도가 있습니다.`
          : null,
        lawyer
          ? `반면 ${lawyer}처럼 기한·당사자·관할이 얽히면 법무사 상담으로 순서를 먼저 확인하는 편이 좋습니다.`
          : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  if (situation.commonMistakes.length > 0) {
    paragraphs.push(
      `지연하거나 잘못 처리하면 보정·재신청·과태료·기한 문제로 이어질 수 있습니다. 특히 ${situation.commonMistakes
        .slice(0, 3)
        .join(", ")} 같은 실수를 피해야 합니다.`,
    );
  }

  return paragraphs.filter((p) => p.trim().length > 0);
}

export function SituationPageView({ page, slug }: SituationPageViewProps) {
  const situation = getSituationBySlug(slug);
  const cover = getCoverImageForPageData(page);

  if (!situation) return null;

  const category = getSituationCategoryById(situation.situationCategory);
  const relatedSituations = getRelatedSituationLinks(situation);
  const showNationwide = shouldShowNationwideRegionChip(
    page.path,
    page.slug,
    situation.serviceSlug,
  );
  const bodyParagraphs = buildSituationBodyParagraphs(situation);

  const tocItems = [
    { id: "article-body", label: "본문 안내" },
    { id: "documents", label: "필요한 서류" },
    { id: "procedures", label: "예상 절차" },
    { id: "cost-factors", label: "비용·기간 요소" },
    { id: "case-example", label: "상담 사례" },
    { id: "diagnosis-links", label: "관련 자가진단" },
    { id: "service-links", label: "관련 서비스·허브" },
    ...(relatedSituations.length > 0
      ? [{ id: "related-situations", label: "비슷한 상황" }]
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
        showNationwideChip={showNationwide}
      />

      {showNationwide ? (
        <NationwideServiceCard
          headline="부산에 방문하지 않아도 상담과 진행이 가능합니다"
        />
      ) : null}

      {slug === "payment-order-certified-mail" ? (
        <ServiceConversionEnhancements
          conversionKey={slug}
          pageSlug={slug}
          placement="top"
        />
      ) : null}

      <ArticleSummary
        conclusion={situation.conclusion}
        checkItems={situation.firstChecks.slice(0, 3)}
        consultTriggers={situation.lawyerNeededCases.slice(0, 3)}
      />

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={situation.serviceSlug}
      />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="article-body" title="상황 이해하기">
        <div className="article-body">
          {bodyParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-navy/65">
          <Link
            href={category.path}
            className="font-semibold text-navy-light hover:text-navy"
          >
            {category.label} 허브
          </Link>
          에서 비슷한 상황도 함께 확인할 수 있습니다.
        </p>
      </ContentSection>

      <ContentSection id="documents" title="필요한 서류">
        <ChecklistBox
          items={situation.documents}
          note="사안에 따라 추가 서류가 필요할 수 있습니다. 상담 전에 목록을 확인해 두시면 좋습니다."
        />
      </ContentSection>

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={situation.serviceSlug}
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

      <ContentSection id="cost-factors" title="절차·기간·비용에 영향을 주는 요소">
        <ChecklistBox items={situation.costFactors} />
        <WarningBox title="비용·기간 안내">
          <p>
            등기·법원·공탁 비용과 법무사 수임료는 사건 복잡도에 따라 달라집니다.
            위 항목을 기준으로 상담 시 구분해 안내드립니다.
          </p>
        </WarningBox>
      </ContentSection>

      {slug === "payment-order-certified-mail" ? (
        <ServiceConversionEnhancements
          conversionKey={slug}
          pageSlug={slug}
          placement="mid"
        />
      ) : null}

      <ContentSection id="case-example" title="현실적인 상담 사례">
        <div className="rounded-xl border border-beige-dark/80 bg-white p-4 sm:p-5">
          <h3 className="font-semibold text-navy">{situation.caseExample.title}</h3>
          <p className="mt-2 text-[1.015rem] leading-[1.85] text-navy/80 md:text-[1.0625rem]">
            {situation.caseExample.body}
          </p>
        </div>
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

      <div id="faq">
        <DiagnosisFAQ items={page.faqs} />
      </div>

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
          title="현재 상황에 필요한 절차부터 확인해보세요"
          description="업무명을 정확히 모르거나 준비된 서류가 없어도 괜찮습니다. 현재 상황을 남겨주시면 필요한 절차와 준비자료부터 확인할 수 있습니다."
          buttonLabel="상담 내용 남기기"
          inquiryField={situation.serviceSlug}
        />
      </div>
    </article>
  );
}
