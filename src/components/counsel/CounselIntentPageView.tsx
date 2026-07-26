import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTASection } from "@/components/sections/CTASection";
import { IntentSelector } from "@/components/counsel/IntentSelector";
import {
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  SummaryBox,
  WarningBox,
} from "@/components/readability";
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

export function CounselIntentPageView({ page }: CounselIntentPageViewProps) {
  const content = getCounselContent(page.slug);
  if (!content) return null;

  const tocItems = [
    { id: "summary", label: "핵심 요약" },
    { id: "situations", label: "이런 상황" },
    { id: "support", label: "지원 업무" },
    { id: "scope", label: "업무범위" },
    { id: "selector", label: "업무 선택기" },
    { id: "documents", label: "준비자료" },
    { id: "process", label: "진행 절차" },
    { id: "mistakes", label: "실수 주의" },
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
        ctaLabel="필요한 업무 확인하기"
        ctaHref="#selector"
        secondaryCta={{ href: "/contact", label: "상담 가능 업무 문의하기" }}
        showDiagnosisCta={false}
        showAboutLawyerCta={false}
        sideImage={siteImages.home.trust}
      />

      <p className="text-sm font-medium text-navy">{content.officeLine}</p>

      <div className="flex flex-wrap gap-2">
        <Link href="#selector" className="btn-primary">
          필요한 업무 확인하기
        </Link>
        <Link href="/contact" className="btn-secondary">
          상담 가능 업무 문의하기
        </Link>
        <Link href="/자가진단" className="btn-secondary">
          준비서류 먼저 확인하기
        </Link>
      </div>

      <ProseParagraphs paragraphs={content.heroParagraphs} />

      <WarningBox title="업무범위 안내">
        <p>{content.scopeNotice}</p>
      </WarningBox>

      <PageTableOfContents items={tocItems} />

      <ContentSection id="summary" title="30초 핵심 요약">
        <dl className="grid gap-3 sm:grid-cols-2">
          {content.summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-beige-dark bg-cream/40 px-4 py-3"
            >
              <dt className="text-xs text-navy/55">{item.label}</dt>
              <dd className="mt-1 text-sm font-medium text-navy">{item.value}</dd>
            </div>
          ))}
        </dl>
      </ContentSection>

      <ContentSection id="situations" title="어떤 상황에서 이 페이지를 찾나요?">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.situationCards.map((card) => (
            <li
              key={card.title}
              className="rounded-2xl border border-beige-dark bg-white p-4"
            >
              <Link
                href={card.href}
                className="block no-underline hover:opacity-90"
              >
                <h3 className="font-semibold text-navy">{card.title}</h3>
                <p className="mt-1 text-sm text-navy/70">{card.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection id="support" title="법무사가 지원할 수 있는 업무">
        <SummaryBox items={content.supportItems} />
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
        <SummaryBox items={content.documents} />
      </ContentSection>

      <ContentSection id="process" title="일반적인 진행절차">
        <StepTimeline steps={content.procedures} />
      </ContentSection>

      <ContentSection id="mistakes" title="자주 하는 실수">
        <SummaryBox items={content.commonMistakes} />
      </ContentSection>

      <ContentSection id="cost" title="비용이 달라지는 요소">
        <SummaryBox items={content.costFactors} />
      </ContentSection>

      <ContentSection id="related" title="관련 기존 페이지">
        <RelatedContentGrid links={content.relatedLinks} />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <CTASection title={content.ctaTitle} description={content.ctaText} />
    </article>
  );
}
