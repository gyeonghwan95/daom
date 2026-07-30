import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTASection } from "@/components/sections/CTASection";
import { IntentSelector } from "@/components/counsel/IntentSelector";
import {
  ArticleSummary,
  ChecklistBox,
  ContentSection,
  PageHero,
  PageTableOfContents,
  RelatedContentGrid,
  StepTimeline,
  WarningBox,
} from "@/components/readability";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import { getCounselContent } from "@/lib/counsel-intent/content";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import type { CounselScopeLevel } from "@/lib/counsel-intent/types";
import { siteImages } from "@/lib/site-images";

const SCOPE_LABELS: Record<CounselScopeLevel, string> = {
  "direct-support": "직접 지원",
  "procedure-guide": "관련 절차 안내",
  "expert-review": "별도 검토 필요",
};

type CounselIntentPageViewProps = {
  page: PageData;
};

function buildCounselBody(
  content: NonNullable<ReturnType<typeof getCounselContent>>,
): string[] {
  const paragraphs = [...content.heroParagraphs];

  if (content.situationCards.length > 0) {
    paragraphs.push(
      `이런 상황으로 상담을 찾는 경우가 많습니다. ${content.situationCards
        .slice(0, 3)
        .map((c) => c.description)
        .join(" ")}`,
    );
  }

  if (content.supportItems.length > 0) {
    paragraphs.push(
      `법무사가 직접 지원할 수 있는 범위는 사안마다 다르지만, 대표적으로는 ${content.supportItems
        .slice(0, 3)
        .join(", ")} 등을 먼저 확인합니다.`,
    );
  }

  if (content.commonMistakes.length > 0) {
    paragraphs.push(
      `준비가 덜 된 상태에서 진행하면 ${content.commonMistakes
        .slice(0, 2)
        .join(", ")} 같은 실수를 하기 쉽습니다. 업무명을 몰라도 현재 상황만 정리해 두시면 필요한 절차부터 안내드릴 수 있습니다.`,
    );
  }

  return paragraphs.filter((p) => p.trim().length > 0);
}

export function CounselIntentPageView({ page }: CounselIntentPageViewProps) {
  const content = getCounselContent(page.slug);
  if (!content) return null;

  const bodyParagraphs = buildCounselBody(content);
  const showNationwide =
    page.slug.includes("상담") ||
    page.slug.includes("전국") ||
    page.path.includes("상담");

  const tocItems = [
    { id: "article-body", label: "본문 안내" },
    { id: "scope", label: "업무범위" },
    { id: "selector", label: "업무 선택기" },
    { id: "documents", label: "준비자료" },
    { id: "process", label: "진행 절차" },
    { id: "cost", label: "비용 요인" },
    { id: "faq", label: "FAQ" },
  ];

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroIntro}
        keywords={content.primaryKeywords}
        ctaLabel="상담 내용 남기기"
        ctaHref="/contact/inquiry"
        secondaryCta={{ href: "#selector", label: "필요한 업무 확인하기" }}
        showDiagnosisCta={false}
        showAboutLawyerCta={false}
        showNationwideChip={showNationwide}
        sideImage={siteImages.home.trust}
      />

      {showNationwide ? (
        <NationwideServiceCard headline="부산에 방문하지 않아도 상담과 진행이 가능합니다" />
      ) : null}

      <p className="text-sm font-medium text-navy">{content.officeLine}</p>

      <WarningBox title="업무범위 안내">
        <p>{content.scopeNotice}</p>
      </WarningBox>

      <ArticleSummary
        conclusion={
          content.summaryItems.map((item) => `${item.label}: ${item.value}`).join(" ") ||
          content.heroIntro
        }
        checkItems={content.documents.slice(0, 3)}
        consultTriggers={content.situationCards.slice(0, 3).map((c) => c.title)}
      />

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="article-body" title="자세히 알아보기">
        <div className="article-body">
          {bodyParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="scope" title="지원 가능한 업무와 별도 검토가 필요한 업무">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-beige-dark bg-cream/50">
                <th className="px-3 py-2 font-semibold text-navy">항목</th>
                <th className="px-3 py-2 font-semibold text-navy">구분</th>
                <th className="px-3 py-2 font-semibold text-navy">안내</th>
              </tr>
            </thead>
            <tbody>
              {content.scopeRows.map((row) => (
                <tr key={row.label} className="border-b border-beige-dark/70">
                  <td className="px-3 py-2 text-navy">{row.label}</td>
                  <td className="px-3 py-2 font-medium text-navy">
                    {SCOPE_LABELS[row.level]}
                  </td>
                  <td className="px-3 py-2 text-navy/70">{row.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-navy/70">
          “불가능”이라고 일률적으로 단정하지 않습니다. 사안별로 적절한
          업무영역 확인이 필요합니다.
        </p>
      </ContentSection>

      <ContentSection id="selector" title="업무 선택기">
        <p className="mb-3 text-sm text-navy/70">
          넓은 검색어로 들어왔다면, 가까운 문제를 선택해 관련 안내 페이지로
          이동하세요.
        </p>
        <IntentSelector variant="counsel" />
      </ContentSection>

      <ContentSection id="documents" title="준비자료">
        <ChecklistBox items={content.documents} />
      </ContentSection>

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      <ContentSection id="process" title="일반적인 진행절차">
        <StepTimeline steps={content.procedures} />
      </ContentSection>

      <ContentSection id="cost" title="비용이 달라지는 요소">
        <ChecklistBox items={content.costFactors} />
        {content.commonMistakes.length > 0 ? (
          <div className="mt-4">
            <WarningBox title="자주 하는 실수">
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy/85">
                {content.commonMistakes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </WarningBox>
          </div>
        ) : null}
      </ContentSection>

      <ContentSection id="related" title="관련 기존 페이지">
        <RelatedContentGrid links={content.relatedLinks} />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <CTASection
        title="현재 상황에 필요한 절차부터 확인해보세요"
        description={content.ctaText}
        pageSlug={page.slug}
      />

      <p className="text-center text-sm text-navy/60">
        <Link href="/contact/inquiry" className="font-semibold text-navy-light">
          상담 내용 남기기
        </Link>
      </p>
    </article>
  );
}
