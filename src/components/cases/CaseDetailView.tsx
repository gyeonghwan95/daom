import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import { CASE_RESULT_NOTICE } from "@/lib/service-conversion/copy";
import {
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  InfoCard,
  KeywordBadges,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
import { recommendationFromCaseRecord } from "@/lib/internal-links";
import { formatContentDate, getServiceLabel } from "@/lib/content/loader";
import { CASE_DISCLAIMER } from "@/lib/cases/types";
import type { CaseRecord } from "@/lib/cases/types";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import type { PageData } from "@/lib/pageData/types";

type CaseDetailViewProps = {
  page: PageData;
  record: CaseRecord;
  faqLinks: { href: string; label: string }[];
};

export function CaseDetailView({ page, record, faqLinks }: CaseDetailViewProps) {
  const cover = getCoverImageForPageData(page);
  const { sections } = record;

  const serviceLinks = record.relatedServices.map((slug) => ({
    href: `/services/${slug}`,
    label: getServiceLabel(slug),
  }));

  const summaryBullets = [
    page.intro,
    sections.background
      ? sections.background.length > 100
        ? `${sections.background.slice(0, 97)}…`
        : sections.background
      : null,
    sections.concerns[0] ? `의뢰인 우려: ${sections.concerns[0]}` : null,
    sections.procedures[0] ? `진행 절차: ${sections.procedures[0]}` : null,
    sections.outcome
      ? `처리 결과: ${sections.outcome.length > 80 ? `${sections.outcome.slice(0, 77)}…` : sections.outcome}`
      : null,
  ].filter((item): item is string => Boolean(item)).slice(0, 5);

  const tocItems = [
    ...(sections.background ? [{ id: "case-background", label: "사건 배경" }] : []),
    ...(sections.concerns.length > 0
      ? [{ id: "case-concerns", label: "의뢰인이 처음 걱정한 점" }]
      : []),
    ...(sections.issues.length > 0 ? [{ id: "case-issues", label: "쟁점" }] : []),
    ...(sections.documents.length > 0
      ? [{ id: "case-documents", label: "준비서류" }]
      : []),
    ...(sections.procedures.length > 0
      ? [{ id: "case-procedures", label: "진행 절차" }]
      : []),
    ...(sections.outcome ? [{ id: "case-outcome", label: "결과" }] : []),
    ...(sections.cautions.length > 0
      ? [{ id: "case-cautions", label: "비슷한 상황에서 주의할 점" }]
      : []),
    ...(serviceLinks.length > 0 ? [{ id: "case-services", label: "관련 서비스" }] : []),
    ...(faqLinks.length > 0 ? [{ id: "case-faqs", label: "관련 FAQ" }] : []),
    { id: "consultation", label: "상담 문의" },
  ];

  const badgeKeywords = [
    record.caseCategory,
    record.region,
    ...record.situationTags.slice(0, 4),
  ];

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={page.h1}
        intro={page.intro}
        keywords={page.primaryKeywords}
        eyebrow="Case Study"
        ctaLabel="비슷한 상황 상담하기"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <KeywordBadges keywords={badgeKeywords} max={8} />
          <p className="text-sm text-navy/55">
            {formatContentDate(record.date)} · {record.category}
          </p>
        </div>
      </PageHero>

      <WarningBox title="사례 안내">
        <p>{CASE_DISCLAIMER}</p>
      </WarningBox>

      <SummaryBox items={summaryBullets} />

      <PageTableOfContents items={tocItems} />

      {sections.background ? (
        <ContentSection id="case-background" title="사건 배경">
          <ProseParagraphs
            paragraphs={sections.background.split(/\n\n+/).filter(Boolean)}
          />
        </ContentSection>
      ) : null}

      {sections.concerns.length > 0 ? (
        <ContentSection id="case-concerns" title="의뢰인이 처음 걱정한 점">
          <ChecklistBox items={sections.concerns} />
        </ContentSection>
      ) : null}

      {sections.issues.length > 0 ? (
        <ContentSection id="case-issues" title="쟁점">
          <div className="grid gap-3 sm:grid-cols-2">
            {sections.issues.map((item) => (
              <InfoCard key={item}>
                <p className="text-sm leading-relaxed text-navy/85 md:text-base">
                  {item}
                </p>
              </InfoCard>
            ))}
          </div>
        </ContentSection>
      ) : null}

      {sections.documents.length > 0 ? (
        <ContentSection id="case-documents" title="준비서류">
          <ChecklistBox items={sections.documents} />
        </ContentSection>
      ) : null}

      <ConsultationCTA
        title="비슷한 상황이라면 서류부터 확인해 보세요"
        description="준비서류를 먼저 점검한 뒤 상담을 요청하시면 검토가 수월합니다."
        buttonLabel="상담 문의하기"
      />

      {sections.procedures.length > 0 ? (
        <ContentSection id="case-procedures" title="진행 절차">
          <StepTimeline steps={sections.procedures} />
        </ContentSection>
      ) : null}

      {sections.outcome ? (
        <ContentSection id="case-outcome" title="결과">
          <InfoCard variant="highlight">
            <p className="text-sm leading-relaxed text-navy/85 md:text-base">
              {sections.outcome}
            </p>
          </InfoCard>
          <WarningBox title="결과 안내">
            <p>{CASE_RESULT_NOTICE}</p>
          </WarningBox>
        </ContentSection>
      ) : null}

      {sections.cautions.length > 0 ? (
        <ContentSection id="case-cautions" title="비슷한 상황에서 주의할 점">
          <div className="space-y-3">
            {sections.cautions.map((item) => (
              <WarningBox key={item} title="주의사항">
                <p>{item}</p>
              </WarningBox>
            ))}
          </div>
        </ContentSection>
      ) : null}

      {serviceLinks.length > 0 ? (
        <ContentSection id="case-services" title="관련 서비스">
          <RelatedContentGrid links={serviceLinks} />
        </ContentSection>
      ) : null}

      {faqLinks.length > 0 ? (
        <ContentSection id="case-faqs" title="관련 FAQ">
          <RelatedContentGrid links={faqLinks} />
        </ContentSection>
      ) : null}

      <RelatedRecommendations source={recommendationFromCaseRecord(record)} />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/cases"
          className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
        >
          ← 사례 탐색기
        </Link>
        <Link
          href="/services"
          className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
        >
          업무안내
        </Link>
      </div>

      <div id="consultation">
        <ConsultationCTA
          title="내 상황에 맞는 서류와 절차를 확인하고 상담하기"
          description={page.ctaText}
          buttonLabel="상담 문의하기"
        />
        <div className="mt-6">
          <LawyerConsultationGuide
            pageType="case"
            showSecondaryLinks
            pageSlug={record.slug}
            documentsHref="#case-documents"
          />
        </div>
      </div>
    </article>
  );
}
