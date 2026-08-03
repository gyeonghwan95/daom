import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTASection } from "@/components/sections/CTASection";
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
import { BusinessCredentialSlot } from "@/components/credentials/BusinessCredentialSlot";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import { getCorporateContent } from "@/lib/corporate-intent/content";
import { shouldShowNationwideRegionChip } from "@/lib/nationwide/show-region-chip";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import { siteImages } from "@/lib/site-images";

type CorporateIntentPageViewProps = {
  page: PageData;
};

function buildCorporateBody(content: NonNullable<ReturnType<typeof getCorporateContent>>) {
  const paragraphs = [
    content.conclusion,
    ...content.heroParagraphs,
  ];

  if (content.whoNeedsThis.length) {
    paragraphs.push(
      `이런 경우에 자주 확인합니다. ${content.whoNeedsThis.slice(0, 3).join(" ")}`,
    );
  }

  if (content.whenAndDeadline.length) {
    paragraphs.push(
      `등기 시점과 기한을 먼저 보면 우선순위가 분명해집니다. ${content.whenAndDeadline.slice(0, 3).join(" ")}`,
    );
  }

  if (content.decisionBodies.length) {
    paragraphs.push(
      `결의기관과 의사결정 구조를 확인하지 않으면 서류가 어긋나기 쉽습니다. ${content.decisionBodies.slice(0, 3).join(" ")}`,
    );
  }

  if (content.commonConfusions.length) {
    paragraphs.push(
      `비슷해 보이지만 다른 경우도 있습니다. ${content.commonConfusions.slice(0, 3).join(" ")}`,
    );
  }

  if (content.procedures.length) {
    paragraphs.push(
      `실제 진행은 보통 ${content.procedures.join(" → ")} 흐름입니다. 정관·등기부·결의 일자가 맞지 않으면 보정으로 일정이 밀릴 수 있습니다.`,
    );
  }

  if (content.documents.length) {
    paragraphs.push(
      `상담·접수 전에 자주 확인하는 서류로는 ${content.documents.slice(0, 5).join(", ")} 등이 있습니다. 사건마다 추가·생략이 있을 수 있습니다.`,
    );
  }

  if (content.diyErrors.length || content.penaltyRisks.length) {
    paragraphs.push(
      [
        content.diyErrors[0]
          ? `직접 진행할 때 ${content.diyErrors.slice(0, 2).join(", ")} 같은 실수가 생기기 쉽습니다.`
          : null,
        content.penaltyRisks[0]
          ? `지연하거나 누락하면 ${content.penaltyRisks.slice(0, 2).join(", ")} 위험이 있습니다.`
          : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  if (content.anonymousCase) {
    paragraphs.push(`실제 상담에서는 이런 흐름이 있었습니다. ${content.anonymousCase}`);
  }

  if (content.faqs.length > 0) {
    paragraphs.push(
      `자주 묻는 질문도 본문과 함께 확인하면 좋습니다. ${content.faqs
        .slice(0, 2)
        .map((f) => `${f.question} ${f.answer}`)
        .join(" ")}`,
    );
  }

  return paragraphs.filter((p) => p.trim().length > 0);
}

export function CorporateIntentPageView({ page }: CorporateIntentPageViewProps) {
  const content = getCorporateContent(page.slug);
  if (!content) return null;

  const isHub = content.kind === "hub";
  const bodyParagraphs = buildCorporateBody(content);
  const showNationwide =
    isHub ||
    shouldShowNationwideRegionChip(page.path, page.slug, page.serviceSlug);

  const tocItems = [
    { id: "article-body", label: "본문 안내" },
    ...(isHub ? [{ id: "clusters", label: "업무별 안내" }] : []),
    { id: "deadline", label: "시점·기한" },
    { id: "decision", label: "결의·의사결정" },
    { id: "documents", label: "준비서류" },
    { id: "process", label: "진행 절차" },
    { id: "cost", label: "비용 요인" },
    ...(content.anonymousCase ? [{ id: "case", label: "상담 사례" }] : []),
    { id: "related", label: "관련 페이지" },
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
        keywords={[content.primaryKeyword, ...content.secondaryKeywords.slice(0, 4)]}
        ctaLabel={content.ctaTitle}
        ctaHref={`/contact/inquiry?field=${encodeURIComponent("corporate-registration")}&from=${encodeURIComponent(content.slug)}`}
        secondaryCta={{ href: "/법인변경등기", label: "변경등기 허브 보기" }}
        showDiagnosisCta={false}
        showAboutLawyerCta={false}
        showNationwideChip={showNationwide}
        sideImage={siteImages.home.trust}
      />

      {showNationwide ? (
        <NationwideServiceCard headline="타 지역 법인도 비대면으로 등기 상담이 가능합니다" />
      ) : null}

      <p className="text-sm font-medium text-navy">{content.officeLine}</p>

      <WarningBox title="업무범위 안내">
        <p>{content.scopeNotice}</p>
      </WarningBox>

      <ArticleSummary
        conclusion={content.conclusion}
        checkItems={content.whenAndDeadline.slice(0, 3)}
        consultTriggers={content.whoNeedsThis.slice(0, 3)}
      />

      <BusinessCredentialSlot path={page.path} slug={page.slug} />

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug ?? "corporate-registration"}
      />

      <PageTableOfContents items={tocItems} />

      <ContentSection id="article-body" title="자세히 알아보기">
        <div className="article-body">
          {bodyParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </ContentSection>

      {isHub && content.topicClusters ? (
        <ContentSection id="clusters" title="검색 의도별 변경등기 안내">
          <div className="grid gap-6">
            {content.topicClusters.map((cluster) => (
              <div
                key={cluster.title}
                className="rounded-2xl border border-beige-dark bg-white p-5"
              >
                <h3 className="text-lg font-semibold text-navy">{cluster.title}</h3>
                <p className="mt-1 text-sm text-navy/70">{cluster.intro}</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {cluster.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl border border-beige-dark/80 bg-cream/30 p-3 no-underline hover:bg-cream/60"
                      >
                        <span className="font-medium text-navy">{link.label}</span>
                        <p className="mt-1 text-xs text-navy/65">{link.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ContentSection id="deadline" title="등기 시점과 기한">
        <ChecklistBox items={content.whenAndDeadline} />
      </ContentSection>

      <ContentSection id="decision" title="결의기관과 의사결정 구조">
        <ChecklistBox items={content.decisionBodies} />
      </ContentSection>

      <ContentSection id="documents" title="준비서류">
        <ChecklistBox items={content.documents} />
      </ContentSection>

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={page.serviceSlug ?? "corporate-registration"}
      />

      <ContentSection id="process" title="진행 절차">
        <StepTimeline steps={content.procedures} />
      </ContentSection>

      <ContentSection id="cost" title="기간·비용에 영향을 주는 요소">
        <ChecklistBox items={content.costFactors} />
      </ContentSection>

      {content.anonymousCase ? (
        <ContentSection id="case" title="익명 상담 사례(요약)">
          <p className="text-[1.015rem] leading-[1.85] text-navy/80">
            {content.anonymousCase}
          </p>
        </ContentSection>
      ) : null}

      <ContentSection id="related" title="관련 업무 페이지">
        <RelatedContentGrid links={content.relatedLinks} />
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      <CTASection
        title="현재 상황에 필요한 절차부터 확인해보세요"
        description={content.ctaText}
        pageSlug={content.slug}
        serviceSlug="corporate-registration"
      />
    </article>
  );
}
