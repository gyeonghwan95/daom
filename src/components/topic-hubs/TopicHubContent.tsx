import Link from "next/link";
import type { ReactNode } from "react";
import { InlineConsultationCTA } from "@/components/consultation/InlineConsultationCTA";
import { QuickInquiryInlineCard } from "@/components/quick-inquiry";
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
} from "@/lib/seo/json-ld";
import { getServiceImage } from "@/lib/site-images";
import { shouldShowQuickInquiryInline } from "@/lib/quick-inquiry/placements";
import type { TopicHubPage } from "@/lib/topic-hubs/types";

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
      ? { href: page.jurisdictionHref, label: "관할 법원·등기소 확인" }
      : null,
    { href: "/location", label: "오시는 길·방문 예약" },
    { href: "/contact", label: "상담 문의하기" },
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

export function TopicHubContent({ page }: TopicHubContentProps) {
  const diagnosisLinks = getTopicHubDiagnosisLinks(page.slug);
  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: "업무안내", href: "/services" },
    { label: page.title },
  ];

  return (
    <article className="content-stack">
      <Breadcrumb items={breadcrumbs} />
      <BreadcrumbJsonLd items={breadcrumbs} currentPath={page.path} />
      <JsonLd
        data={[
          buildServicePageSchema(page.title, page.path),
          buildLandingPageArticleSchema(page.title, page.description, page.path),
          buildFaqPageSchema(page.faqs),
        ]}
      />

      <PageCoverBanner image={getServiceImage(page.primaryServiceSlug)} />

      <header>
        <p className="text-sm font-medium text-navy-light">부산 · 토픽 허브</p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.intro}</p>
      </header>

      <TopicHubQuickLinks page={page} />

      {getTopicHubDiagnosisLinks(page.slug).length > 0 ? (
        <ContentBlock id="diagnosis" title="관련 자가진단">
          <p className="mb-4 text-base leading-relaxed text-navy/80">
            상담 전 현재 상황을 간단히 점검해 보세요. 절차·서류·기한 방향을 안내받을 수 있습니다.
          </p>
          <RelatedLinks title="자가진단 바로가기" links={getTopicHubDiagnosisLinks(page.slug)} />
        </ContentBlock>
      ) : null}

      <InlineConsultationCTA
        pageType="service"
        serviceSlug={page.primaryServiceSlug}
        pageSlug={page.slug}
        title={`${page.title} 지금 상담`}
        description={page.ctaDescription}
        diagnosisHref={diagnosisLinks[0]?.href ?? "/자가진단"}
      />

      {shouldShowQuickInquiryInline({ slug: page.slug }) ? (
        <QuickInquiryInlineCard pageTitle={page.h1 || page.title} pageUrl={page.path} />
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
