import Link from "next/link";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import {
  ChecklistBox,
  ContentSection,
  PageHero,
  WarningBox,
} from "@/components/readability";
import {
  getGlossaryGuide,
  getGlossaryPolicy,
  getGlossaryTermBySlug,
  josa,
} from "@/lib/glossary";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import type { PageData } from "@/lib/pageData/types";

type GlossaryTermViewProps = {
  page: PageData;
  slug: string;
};

export function GlossaryTermView({ page, slug }: GlossaryTermViewProps) {
  const term = getGlossaryTermBySlug(slug);
  const guide = getGlossaryGuide(slug);
  const policy = getGlossaryPolicy(slug);
  const cover = getCoverImageForPageData(page);

  if (!term || !guide || !policy) return null;

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={page.h1}
        intro={term.oneLineDefinition}
        keywords={[]}
        eyebrow="용어 확인"
        ctaHref={policy.serviceOwner}
        ctaLabel={`${policy.serviceOwnerLabel} 보기`}
        showDiagnosisCta={false}
        showAboutLawyerCta={false}
        showNationwideChip={false}
      />

      <ContentSection id="glossary-confusions" title={`${term.term}에서 자주 헷갈리는 점`}>
        <p className="body-text mb-4">{guide.answerLead}</p>
        <ChecklistBox items={guide.stuckPoints.slice(0, 3)} />
      </ContentSection>

      <ContentSection id="glossary-scope" title={`${term.term}에서 법무사가 맡는 범위`}>
        <p className="body-text">{guide.scrivenerScope}</p>
        {guide.outOfScope ? (
          <WarningBox title="이 페이지에서 맡지 않는 업무">
            <p>{guide.outOfScope}</p>
          </WarningBox>
        ) : null}
      </ContentSection>

      <ContentSection id="glossary-owner" title={`${term.term} 대표 업무 안내`}>
        <p className="body-text mb-4">
          {josa(term.term, "을/를")} 신청·등기할 때의 기한·서류·비용은 이 용어 페이지가 아니라
          아래 대표 안내가 기준입니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={policy.serviceOwner}
            className="interactive-surface rounded-lg border border-navy/15 bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-navy/90"
          >
            {policy.serviceOwnerLabel} →
          </Link>
          {term.diagnosisLinks[0] ? (
            <Link
              href={term.diagnosisLinks[0].href}
              className="interactive-surface rounded-lg border border-navy/10 bg-white px-4 py-3 text-sm font-semibold text-navy hover:bg-beige/50"
            >
              {term.diagnosisLinks[0].label}
            </Link>
          ) : null}
        </div>
      </ContentSection>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/glossary"
          className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
        >
          ← 용어 목록
        </Link>
        <Link
          href="/situations"
          className="interactive-surface rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-beige/50"
        >
          상황별 안내
        </Link>
      </div>

      <DiagnosisFAQ items={page.faqs} />
    </article>
  );
}
