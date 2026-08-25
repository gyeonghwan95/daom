import {
  InheritanceCostGuide,
  InheritanceJourneyNav,
  RemoteInheritanceProcess,
} from "@/components/inheritance";
import {
  RemoteCostChecklist,
  RemoteLegalProcess,
  RemoteServiceMatrixTable,
} from "@/components/remote";
import { isInheritanceJourneyPage } from "@/lib/inheritance/journey";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ServiceConversionEnhancements } from "@/components/conversion";
import { resolveConversionKey } from "@/lib/service-conversion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { RelatedRecommendations } from "@/components/internal-links/RelatedRecommendations";
import {
  ArticleSummary,
  ChecklistBox,
  ConsultationCTA,
  ContentSection,
  PageHero,
  PageTableOfContents,
  ProseParagraphs,
  RelatedContentGrid,
  StepTimeline,
  WarningBox,
} from "@/components/readability";
import { recommendationFromService } from "@/lib/internal-links";
import { getSearchIntentContent } from "@/lib/local-landing/search-intent";
import { subproxyJurisdictionData } from "@/lib/local-landing/search-intent";
import { MassRegistryB2BAddon } from "@/components/b2b/MassRegistryB2BAddon";
import { allServiceDetails } from "@/lib/services-data";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { NationwideServiceCard } from "@/components/nationwide/NationwideServiceCard";
import { shouldShowNationwideRegionChip } from "@/lib/nationwide/show-region-chip";
import Link from "next/link";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import { consultationInquiryCopy } from "@/lib/consultation-inquiry";

type SearchIntentPageViewProps = {
  page: PageData;
};

export function SearchIntentPageView({ page }: SearchIntentPageViewProps) {
  const content = getSearchIntentContent(page.slug);
  if (!content) return null;

  const cover = getCoverImageForPageData(page);
  const conversionKey = resolveConversionKey(page);
  const service = allServiceDetails.find((s) => s.slug === content.serviceSlug);

  const faqSchemaPage: PageData = {
    ...page,
    faqs: content.faqs,
    includeFaqSchema: true,
  };

  const showJourney =
    content.showInheritanceJourney !== false &&
    isInheritanceJourneyPage(page.slug);

  const isJeonseVictimHub = content.slug === "전세사기피해대응절차";

  const tocItems = [
    ...(showJourney
      ? [{ id: "inheritance-journey", label: "절차 여정" }]
      : []),
    ...(content.situationNav?.length
      ? [{ id: "situation-nav", label: "지금 어떤 상황이신가요?" }]
      : []),
    ...(content.featuredChecklist?.length
      ? [{ id: "first-checks-list", label: "먼저 확인할 7가지" }]
      : []),
    { id: "article-body", label: "본문 안내" },
    ...(content.proseSections?.map((s) => ({ id: s.id, label: s.title })) ??
      []),
    ...(content.officialSources?.length
      ? [{ id: "official-sources", label: "공식 법령·공공 안내" }]
      : []),
    { id: "documents", label: "준비서류" },
    { id: "procedures", label: "절차" },
    ...(content.showRemoteInheritance
      ? [{ id: "remote-inheritance", label: "비대면 진행" }]
      : []),
    ...(content.showRemoteLegalProcess
      ? [{ id: "remote-legal-process", label: "방문 전 확인" }]
      : []),
    ...(content.showRemoteServiceMatrix
      ? [{ id: "remote-service-matrix", label: "원격 적합도" }]
      : []),
    ...(content.showInheritanceCostGuide
      ? [{ id: "inheritance-cost-guide", label: "비용 안내" }]
      : []),
    ...(content.showRemoteCostChecklist
      ? [{ id: "remote-cost-checklist", label: "비용 확인 정보" }]
      : []),
    { id: "mistakes", label: "자주 하는 실수" },
    { id: "faq", label: "자주 묻는 질문" },
    ...(content.relatedCaseLinks.length > 0 || !isJeonseVictimHub
      ? [{ id: "related-cases", label: "관련 사례" }]
      : []),
    { id: "related-services", label: "관련 서비스" },
    { id: "consultation", label: "상담 문의" },
  ];

  const showNationwide = shouldShowNationwideRegionChip(
    page.path,
    page.slug,
    page.serviceSlug,
  );

  const bodyParagraphs = [
    ...content.heroParagraphs.slice(1),
    ...(content.suppressKeywordChips
      ? []
      : [
          content.searchIntents.length > 0
            ? `이런 검색·상담이 많습니다. ${content.searchIntents.slice(0, 3).join(" ")}`
            : "",
          content.whenNeeded.length > 0
            ? `언제 필요한지부터 보면 판단이 쉬워집니다. ${content.whenNeeded.slice(0, 3).join(" ")}`
            : "",
        ]),
  ].filter((p) => p.trim().length > 0);

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(faqSchemaPage)} />

      <PageCoverBanner image={cover} />

      <PageHero
        h1={content.h1}
        eyebrow={content.eyebrow}
        intro={content.heroParagraphs[0]}
        keywords={
          content.suppressKeywordChips === false ? content.primaryKeywords : []
        }
        ctaLabel={
          content.showRemoteInheritance ||
          content.showInheritanceCostGuide ||
          content.showRemoteLegalProcess ||
          content.showRemoteCostChecklist
            ? "업무 가능 여부 확인하기"
            : consultationInquiryCopy.ctaShort
        }
        showDiagnosisCta={false}
        showAboutLawyerCta
        showNationwideChip={showNationwide}
      />

      {showNationwide ? <NationwideServiceCard /> : null}

      {content.situationNav?.length ? (
        <ContentSection id="situation-nav" title="지금 어떤 상황이신가요?">
          <div className="grid gap-3 sm:grid-cols-2">
            {content.situationNav.map((item) => {
              const className =
                "block rounded-xl border border-beige-dark bg-white px-4 py-4 no-underline transition hover:border-navy/30";
              const inner = (
                <>
                  <strong className="block text-navy">{item.title}</strong>
                  <span className="mt-1 block text-sm text-navy/70">
                    {item.description}
                  </span>
                </>
              );
              return item.href.startsWith("#") ? (
                <a key={item.title} href={item.href} className={className}>
                  {inner}
                </a>
              ) : (
                <Link key={item.title} href={item.href} className={className}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </ContentSection>
      ) : null}

      {content.featuredChecklist?.length ? (
        <ContentSection id="first-checks-list" title="먼저 확인할 7가지">
          <ChecklistBox items={content.featuredChecklist} />
        </ContentSection>
      ) : (
        <ArticleSummary
          conclusion={
            content.summaryBullets.slice(0, 2).join(" ") ||
            content.heroParagraphs[0]
          }
          checkItems={content.documents.slice(0, 3)}
          consultTriggers={content.whenNeeded.slice(0, 3)}
        />
      )}

      {showJourney ? (
        <InheritanceJourneyNav currentSlug={page.slug} />
      ) : null}

      {bodyParagraphs.length > 0 ? (
        <ContentSection id="article-body" title="자세히 알아보기">
          <div className="article-body">
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </ContentSection>
      ) : null}

      {content.proseSections?.map((section) => (
        <ContentSection key={section.id} id={section.id} title={section.title}>
          <ProseParagraphs paragraphs={section.paragraphs} />
        </ContentSection>
      ))}

      {content.officialSources?.length ? (
        <ContentSection id="official-sources" title="공식 법령·공공 안내">
          <p className="mb-3 text-sm text-navy/75">
            블로그가 아니라 국가법령정보센터·HUG·부산시 공식 안내를 기준으로 합니다.
            지원 요건과 연락처는 바뀔 수 있으니 방문 전에 원문을 확인하세요.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed md:text-base">
            {content.officialSources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  className="font-medium text-navy underline underline-offset-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {source.label}
                </a>
                {source.note ? (
                  <span className="text-navy/70"> — {source.note}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}

      <ArticleVisualSlot
        path={page.path}
        slot="after-intro"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      {conversionKey ? (
        <ServiceConversionEnhancements
          conversionKey={conversionKey}
          pageSlug={page.slug}
          placement="top"
        />
      ) : null}

      <PageTableOfContents items={tocItems} />

      <ArticleVisualSlot
        path={page.path}
        slot="before-procedures"
        category={page.category}
        serviceSlug={page.serviceSlug}
      />

      {page.slug === "부산등기복대리" ? (
        <ContentSection id="jurisdictions" title="관할별 안내(사전 확인)">
          <p className="mb-4 text-sm text-navy/75">
            가능 여부는 일정·서류에 따라 달라질 수 있습니다. 수행하지 않는 업무를
            가능하다고 표시하지 않습니다.
          </p>
          <div className="space-y-4">
            {subproxyJurisdictionData.map((row) => (
              <div
                key={row.officeName}
                className="rounded-xl border border-beige-dark bg-white px-4 py-4"
              >
                <h3 className="font-semibold text-navy">{row.officeName}</h3>
                <p className="mt-1 text-sm text-navy/75">{row.jurisdiction}</p>
                <p className="mt-2 text-sm">
                  <span className="font-medium">가능 업무: </span>
                  {row.acceptedWork.join(", ")}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-medium">제외: </span>
                  {row.excludedWork.join(", ")}
                </p>
                <p className="mt-1 text-sm text-navy/70">{row.contactNotice}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      ) : null}

      <ContentSection id="documents" title="준비서류">
        <ChecklistBox
          items={content.documents}
          note={content.documentsNote}
        />
      </ContentSection>

      <ContentSection id="procedures" title="절차">
        <StepTimeline steps={content.procedures} />
      </ContentSection>

      {content.showRemoteInheritance ? (
        <RemoteInheritanceProcess fromPage={page.slug} />
      ) : null}

      {content.showRemoteLegalProcess ? (
        <RemoteLegalProcess
          fromPage={page.slug}
          inquiryField={content.serviceSlug}
        />
      ) : null}

      {content.showRemoteServiceMatrix ? (
        <RemoteServiceMatrixTable />
      ) : null}

      {content.showInheritanceCostGuide ? (
        <InheritanceCostGuide fromPage={page.slug} />
      ) : null}

      {content.showRemoteCostChecklist ? (
        <RemoteCostChecklist
          fromPage={page.slug}
          inquiryField={content.serviceSlug}
          variant={content.remoteCostChecklistVariant ?? "inheritance"}
        />
      ) : null}

      <ContentSection id="mistakes" title="자주 하는 실수">
        <WarningBox title="상담 전에 자주 놓치는 부분">
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy/85 md:text-base">
            {content.commonMistakes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </WarningBox>
      </ContentSection>

      <ContentSection id="faq" title="자주 묻는 질문">
        <FAQAccordion items={content.faqs} />
      </ContentSection>

      {page.slug === "부산집단등기" ? <MassRegistryB2BAddon /> : null}

      {content.relatedCaseLinks.length > 0 ? (
        <ContentSection id="related-cases" title="관련 사례">
          <RelatedContentGrid links={content.relatedCaseLinks} />
        </ContentSection>
      ) : isJeonseVictimHub ? null : (
        <ContentSection id="related-cases" title="관련 사례">
          <RelatedContentGrid
            links={[{ href: "/업무사례", label: "업무 사례 전체 보기" }]}
          />
        </ContentSection>
      )}

      <ContentSection id="related-services" title="관련 서비스">
        <RelatedContentGrid links={content.relatedServiceLinks} />
        <div className="mt-6">
          <RelatedContentGrid links={content.relatedGuideLinks} />
        </div>
      </ContentSection>

      {service ? (
        <RelatedRecommendations
          source={recommendationFromService(service)}
          title="함께 보면 좋은 안내"
        />
      ) : null}

      <div id="consultation">
        <ConsultationCTA
          title={
            isJeonseVictimHub
              ? "전세사기인지 정확히 판단되지 않아도 괜찮습니다"
              : "현재 상황에 필요한 절차부터 확인해보세요"
          }
          description={content.bottomCtaText}
          buttonLabel={
            isJeonseVictimHub
              ? "전세보증금 문제 문의"
              : content.showRemoteInheritance ||
                  content.showInheritanceCostGuide ||
                  page.slug.includes("증여")
                ? "업무 가능 여부 확인하기"
                : consultationInquiryCopy.ctaPrimary
          }
          inquiryField={content.serviceSlug ?? page.serviceSlug}
          fromPage={page.slug}
          showAboutLawyer={!isJeonseVictimHub}
          intent={
            isJeonseVictimHub
              ? "전세보증금 미반환·피해 대응 순서 확인"
              : page.slug.includes("증여")
                ? "증여등기 서류·비용 구성 확인"
                : content.showInheritanceCostGuide || content.showRemoteInheritance
                  ? "상속 절차·비용 확인"
                  : undefined
          }
        />
      </div>

      {conversionKey ? (
        <ServiceConversionEnhancements
          conversionKey={conversionKey}
          pageSlug={page.slug}
          placement="footer"
        />
      ) : null}
    </article>
  );
}
