import Link from "next/link";
import type { ReactNode } from "react";
import { InlineConsultationCTA } from "@/components/consultation/InlineConsultationCTA";
import {
  InheritanceCostGuide,
  InheritanceJourneyNav,
  RemoteInheritanceProcess,
} from "@/components/inheritance";
import { ArticleVisualSlot } from "@/components/media/ArticleVisual";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { getTopicHubDiagnosisLinks } from "@/data/diagnosis-hub-meta";
import {
  buildFaqPageSchema,
  buildLandingPageArticleSchema,
  buildServicePageSchema,
  buildWebPageSchema,
} from "@/lib/seo/json-ld";
import { getServiceImage } from "@/lib/site-images";
import {
  isInheritanceFlagshipPage,
  isInheritanceJourneyPage,
} from "@/lib/inheritance/journey";
import type { TopicHubPage } from "@/lib/topic-hubs/types";
import { ComparisonTable } from "@/components/readability";

type TopicHubContentProps = {
  page: TopicHubPage;
};

function ContentBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
    >
      <h2 className="section-heading">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TopicHubQuickLinks({ page }: { page: TopicHubPage }) {
  const links = [
    page.documentsHref
      ? { href: page.documentsHref, label: "필요서류 확인" }
      : null,
    page.costHref ? { href: page.costHref, label: "비용·보수 안내" } : null,
    page.jurisdictionHref
      ? {
          href: page.jurisdictionHref,
          label:
            page.slug === "개인회생파산"
              ? "관할 법원 확인"
              : "관할 법원·등기소 확인",
        }
      : null,
    { href: "/location", label: "오시는 길·방문 예약" },
    { href: "/contact/inquiry", label: "1분만에 문의하기" },
  ].filter((item): item is { href: string; label: string } => item !== null);

  return (
    <nav aria-label="빠른 안내" className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href + link.label}
          href={link.href}
          className="inline-flex min-h-10 items-center rounded-lg border border-navy/15 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-navy/30"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function RehabComparisonTable() {
  return (
    <section
      id="rehab-vs-bankruptcy"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
    >
      <h2 className="section-heading">개인회생과 개인파산, 한눈에 비교</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy/70">
        요건은 「채무자 회생 및 파산에 관한 법률」·법원 안내에 따르며, 인가·면책은
        보장하지 않습니다. 확인일 2026-08-26.
      </p>
      <div className="mt-4">
        <ComparisonTable
          caption="개인회생과 개인파산의 소득·핵심·재산·준비자료 비교"
          columns={[
            { key: "구분", header: "구분" },
            { key: "회생", header: "개인회생" },
            { key: "파산", header: "개인파산·면책" },
          ]}
          rows={[
            {
              구분: "소득",
              회생: "계속·반복 수입을 설명할 여지가 있을 때",
              파산: "변제 여력이 거의 없을 때",
            },
            {
              구분: "핵심",
              회생: "변제계획",
              파산: "지급불능·면책 검토",
            },
            {
              구분: "재산",
              회생: "청산가치와 변제액을 함께 봄",
              파산: "재산관계 조사",
            },
            {
              구분: "주요자료",
              회생: "소득·채무·재산 목록",
              파산: "채무·재산·면책 관련 자료",
            },
          ]}
        />
      </div>
    </section>
  );
}

export function TopicHubContent({ page }: TopicHubContentProps) {
  const diagnosisLinks = getTopicHubDiagnosisLinks(page.slug);
  const isRehabHub = page.slug === "개인회생파산";
  const breadcrumbs = isRehabHub
    ? [
        { label: "홈", href: "/" },
        { label: "회생·파산" },
      ]
    : page.slug === "상속"
      ? [
          { label: "홈", href: "/" },
          { label: "상속" },
        ]
      : [
          { label: "홈", href: "/" },
          { label: "업무안내", href: "/services" },
          { label: page.title },
        ];
  const showInheritanceJourney = isInheritanceJourneyPage(page.slug);
  const showInheritanceExtras = isInheritanceFlagshipPage(page.slug);

  return (
    <article className="content-stack">
      <Breadcrumb items={breadcrumbs} />
      <BreadcrumbJsonLd items={breadcrumbs} currentPath={page.path} />
      <JsonLd
        data={[
          buildWebPageSchema({
            title: page.title,
            description: page.description,
            path: page.path,
            h1: page.h1,
          }),
          buildServicePageSchema(page.title, page.path),
          buildLandingPageArticleSchema(page.title, page.description, page.path),
          buildFaqPageSchema(page.faqs, page.path),
        ]}
      />

      <PageCoverBanner image={getServiceImage(page.primaryServiceSlug)} />

      <header>
        <p className="text-sm font-medium text-navy-light">부산 · 토픽 허브</p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      {isRehabHub ? <RehabComparisonTable /> : null}

      <InlineConsultationCTA
        pageType="service"
        serviceSlug={page.primaryServiceSlug}
        pageSlug={page.slug}
        title={`${page.title} 상담 문의`}
        description={page.ctaDescription}
        diagnosisHref={diagnosisLinks[0]?.href ?? "/자가진단"}
      />

      <TopicHubQuickLinks page={page} />

      {showInheritanceJourney ? (
        <InheritanceJourneyNav currentSlug={page.slug} />
      ) : null}

      {showInheritanceExtras ? (
        <ArticleVisualSlot
          path={page.path}
          slot="after-intro"
          serviceSlug={page.primaryServiceSlug}
        />
      ) : null}

      {getTopicHubDiagnosisLinks(page.slug).length > 0 ? (
        <ContentBlock id="diagnosis" title="관련 자가진단">
          <p className="mb-4 text-base leading-relaxed text-navy/80">
            상담 전 현재 상황을 간단히 점검해 보세요. 절차·서류·기한 방향을 안내받을 수 있습니다.
          </p>
          <RelatedLinks title="자가진단 바로가기" links={getTopicHubDiagnosisLinks(page.slug)} />
        </ContentBlock>
      ) : null}

      {showInheritanceExtras ? (
        <>
          <RemoteInheritanceProcess fromPage={page.slug} />
          <InheritanceCostGuide fromPage={page.slug} />
        </>
      ) : null}

      {page.sections.map((section) => (
        <ContentBlock
          key={section.title}
          id={section.title.replace(/\s+/g, "-")}
          title={section.title}
        >
          <p className="mb-4 text-base leading-relaxed text-navy/80">
            {section.intro}
          </p>
          <RelatedLinks title="관련 안내" links={section.links} />
        </ContentBlock>
      ))}

      {page.faqs.length > 0 ? (
        <ContentBlock id="hub-faq" title="자주 묻는 질문">
          <FAQAccordion items={page.faqs} />
        </ContentBlock>
      ) : null}

      <ContentBlock id="lawyer-opinion" title="안윤정 법무사 의견">
        <div className="card-surface border-navy/10 bg-beige p-6 md:p-8">
          <p className="text-base leading-relaxed text-navy/80 md:text-lg">
            {page.lawyerOpinion}
          </p>
          <Link
            href="/about"
            className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-navy-light hover:underline"
          >
            안윤정 법무사 프로필 보기 →
          </Link>
        </div>
      </ContentBlock>

      <RelatedLinks title="관련 업무 허브" links={page.relatedHubLinks} />

      <div
        id="consultation"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <CTASection
          pageType="service"
          serviceSlug={page.primaryServiceSlug}
          pageSlug={page.slug}
          description={page.ctaDescription}
          diagnosisHref={diagnosisLinks[0]?.href ?? "/자가진단"}
        />
      </div>
    </article>
  );
}
