import Link from "next/link";
import { LawyerConsultationGuide } from "@/components/consultation/LawyerConsultationGuide";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import { GlossaryNationwideNotice } from "@/components/glossary/GlossaryNationwideNotice";
import {
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  SummaryBox,
} from "@/components/readability";
import { recommendationFromGlossaryTerm } from "@/lib/internal-links";
import { getGlossaryPlainParagraphs, getGlossaryTermBySlug, isGlossaryNationwideTerm } from "@/lib/glossary";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import type { PageData } from "@/lib/pageData/types";

type GlossaryTermViewProps = {
  page: PageData;
  slug: string;
};

export function GlossaryTermView({ page, slug }: GlossaryTermViewProps) {
  const term = getGlossaryTermBySlug(slug);
  const cover = getCoverImageForPageData(page);

  if (!term) return null;

  const plainParagraphs = getGlossaryPlainParagraphs(
    term.slug,
    term.plainExplanation,
  );

  const summaryBullets = [
    term.oneLineDefinition,
    plainParagraphs[0]
      ? plainParagraphs[0].length > 120
        ? `${plainParagraphs[0].slice(0, 117)}…`
        : plainParagraphs[0]
      : null,
    term.whenItMatters[0] ? `관련 상황: ${term.whenItMatters[0]}` : null,
    term.checks[0] ? `확인 사항: ${term.checks[0]}` : null,
  ]
    .filter((item): item is string => Boolean(item))
    .slice(0, 5);

  const tocItems = [
    { id: "glossary-plain", label: "쉽게 풀어쓴 설명" },
    { id: "glossary-matters", label: "언제 문제가 되는지" },
    { id: "glossary-checks", label: "준비서류 또는 확인사항" },
    { id: "glossary-diagnosis", label: "관련 자가진단" },
    { id: "glossary-services", label: "관련 서비스" },
    { id: "glossary-faq", label: "관련 FAQ" },
    { id: "glossary-cases", label: "관련 사례" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "consultation", label: "상담 문의" },
  ];

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={page.h1}
        intro={term.oneLineDefinition}
        keywords={page.primaryKeywords}
        eyebrow="Legal Glossary"
        ctaLabel="용어 관련 상담하기"
        showDiagnosisCta={false}
        showAboutLawyerCta
        showNationwideChip={isGlossaryNationwideTerm(slug)}
      />

      <SummaryBox items={summaryBullets} />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="glossary-plain" title="쉽게 풀어쓴 설명">
        <div className="glossary-prose">
          <ProseParagraphs paragraphs={plainParagraphs} />
        </div>
        {isGlossaryNationwideTerm(slug) ? (
          <GlossaryNationwideNotice termLabel={term.term} />
        ) : null}
      </ContentSection>

      <ConsultationCTA
        title="용어와 관련해 절차가 궁금하신가요?"
        description="자가진단으로 상황을 점검하거나, 상담을 통해 서류와 절차를 확인해 보실 수 있습니다."
        buttonLabel="상담 문의하기"
      />

      <ContentSection id="glossary-matters" title="언제 문제가 되는지">
        <ChecklistBox items={term.whenItMatters} />
      </ContentSection>

      <ContentSection id="glossary-checks" title="준비서류 또는 확인사항">
        <ChecklistBox
          items={term.checks}
          note="사안에 따라 추가로 확인할 항목이 있을 수 있습니다."
        />
      </ContentSection>

      <ContentSection id="glossary-diagnosis" title="관련 자가진단">
        <RelatedContentGrid links={term.diagnosisLinks} />
      </ContentSection>

      <ContentSection id="glossary-services" title="관련 서비스">
        <RelatedContentGrid links={term.serviceLinks} />
      </ContentSection>

      <ContentSection id="glossary-faq" title="관련 FAQ">
        <RelatedContentGrid links={term.faqLinks} />
      </ContentSection>

      <ContentSection id="glossary-cases" title="관련 사례">
        <RelatedContentGrid links={term.caseLinks} />
      </ContentSection>

      <RelatedRecommendations source={recommendationFromGlossaryTerm(term)} />

      <div className="flex flex-wrap gap-2">
        <Link
          href="/glossary"
          className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
        >
          ← 법률 용어사전 목록
        </Link>
        <Link
          href="/situations"
          className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
        >
          상황별 법률문제
        </Link>
      </div>

      <DiagnosisFAQ items={page.faqs} />

      <div id="consultation">
        <ConsultationCTA
          title="내 상황에 맞는 서류와 절차를 확인하고 상담하기"
          description={page.ctaText}
          buttonLabel="상담 문의하기"
        />
        <div className="mt-6">
          <LawyerConsultationGuide
            pageType="glossary"
            title={page.ctaTitle}
            description={page.ctaText}
            showSecondaryLinks
            pageSlug={slug}
            diagnosisHref={term.diagnosisLinks[0]?.href ?? "/자가진단"}
          />
        </div>
      </div>
    </article>
  );
}
