import Link from "next/link";
import type { ReactNode } from "react";
import { InlineConsultationCTA } from "@/components/consultation/InlineConsultationCTA";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { LocalLandingInternalLinks } from "@/components/local-landing/LocalLandingInternalLinks";
import { RelatedBlogPosts } from "@/components/local-landing/RelatedBlogPosts";
import { buildFaqPageSchema, buildLandingPageArticleSchema, buildServicePageSchema } from "@/lib/seo/json-ld";
import { getServiceImage, siteImages } from "@/lib/site-images";
import type { LocalLandingPage } from "@/types/local-landing";

type LocalLandingContentProps = {
  page: LocalLandingPage;
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

function getCoverImage(page: LocalLandingPage) {
  if (page.pageType === "court-registry") {
    return siteImages.faq.cover;
  }
  return getServiceImage(page.serviceSlug);
}

export function LocalLandingContent({ page }: LocalLandingContentProps) {
  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: page.title },
  ];

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={breadcrumbs} />
      <BreadcrumbJsonLd items={breadcrumbs} currentPath={page.path} />
      <JsonLd
        data={[
          buildServicePageSchema(page.title, page.path),
          buildLandingPageArticleSchema(page.title, page.description, page.path),
          buildFaqPageSchema(page.faqs),
        ]}
      />

      <PageCoverBanner image={getCoverImage(page)} />

      <header>
        <p className="text-sm font-medium text-navy-light">
          {page.regionLabel} · {page.neighborhoods.join(" · ")}
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.problemStatement}</p>
      </header>

      <InlineConsultationCTA
        pageType="service"
        serviceSlug={page.serviceSlug}
        pageSlug={page.slug}
        title={`${page.regionLabel} ${page.title} 지금 상담`}
        description={page.ctaDescription}
      />

      <ContentBlock id="when-needed" title="어떤 경우 필요한 업무인가요?">
        <ul className="space-y-3">
          {page.whenNeeded.map((item) => (
            <li
              key={item}
              className="card-surface px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
            >
              {item}
            </li>
          ))}
        </ul>
      </ContentBlock>

      <ContentBlock id="jurisdiction" title="관할 법원·등기소 안내">
        <div className="card-surface bg-cream p-6 md:p-8">
          <h3 className="text-lg font-semibold text-navy">{page.jurisdictionGuide.title}</h3>
          {page.jurisdictionGuide.address ? (
            <p className="mt-2 text-base text-navy/80">{page.jurisdictionGuide.address}</p>
          ) : null}
          {page.jurisdictionGuide.accessNote ? (
            <p className="mt-2 text-sm text-navy/70">{page.jurisdictionGuide.accessNote}</p>
          ) : null}
          <p className="mt-4 text-base leading-relaxed text-navy/80">
            {page.jurisdictionGuide.jurisdictionNote}
          </p>
          <ul className="mt-4 space-y-2">
            {page.jurisdictionGuide.practicalNotes.map((note) => (
              <li key={note} className="flex gap-2 text-sm text-navy/70">
                <span aria-hidden="true">·</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </ContentBlock>

      <ContentBlock id="consultation-cases" title="실제 상담 사례">
        <div className="space-y-4">
          {page.consultationCases.map((caseItem) => (
            <div key={caseItem.title} className="card-surface bg-beige p-6 md:p-8">
              <h3 className="text-lg font-semibold text-navy">{caseItem.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-navy/80">
                {caseItem.summary}
              </p>
              {caseItem.href ? (
                <Link
                  href={caseItem.href}
                  className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-navy-light hover:underline"
                >
                  관련 사례 자세히 보기 →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </ContentBlock>

      <ContentBlock id="legal-issues" title="법적 쟁점">
        <ul className="space-y-3">
          {page.legalIssues.map((issue) => (
            <li
              key={issue}
              className="card-surface px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
            >
              {issue}
            </li>
          ))}
        </ul>
      </ContentBlock>

      <ContentBlock id="procedures" title="절차 설명">
        <ol className="space-y-3">
          {page.procedures.map((step, index) => (
            <li
              key={`${index}-${step}`}
              className="flex gap-4 rounded-lg border border-beige-dark bg-cream px-4 py-3 md:px-5 md:py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-medium text-white">
                {index + 1}
              </span>
              <span className="text-base leading-relaxed text-navy/80 md:pt-1">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </ContentBlock>

      <ContentBlock id="documents" title="필요 서류">
        <ul className="grid gap-2 sm:grid-cols-2">
          {page.documents.map((doc) => (
            <li
              key={doc}
              className="flex items-start gap-2 rounded-lg bg-beige px-4 py-3 text-base text-navy/80"
            >
              <span className="mt-1 text-navy-light" aria-hidden="true">
                ·
              </span>
              {doc}
            </li>
          ))}
        </ul>
      </ContentBlock>

      <ContentBlock id="cost-guide" title="비용 안내">
        <div className="card-surface bg-cream p-6 md:p-8">
          <p className="text-base leading-relaxed text-navy/80 md:text-lg">
            {page.costGuide}
          </p>
          <p className="mt-3 text-sm text-navy/60">
            정확한 견적은 사건 내용 확인 후 안내합니다. 숨겨진 비용 없이 항목별로 설명해 드립니다.
          </p>
        </div>
      </ContentBlock>

      <InlineConsultationCTA
        pageType="service"
        serviceSlug={page.serviceSlug}
        pageSlug={page.slug}
        title="비용·절차가 궁금하신가요?"
        description="카카오톡으로 등기부·상황을 보내주시면 대략적인 비용과 순서를 안내해 드립니다."
      />

      <ContentBlock id="precautions" title="주의사항">
        <ul className="space-y-3">
          {page.precautions.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
            >
              {item}
            </li>
          ))}
        </ul>
      </ContentBlock>

      <ContentBlock id="local-faq" title="자주 묻는 질문">
        <FAQAccordion items={page.faqs} />
      </ContentBlock>

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

      <RelatedBlogPosts posts={page.relatedBlogHrefs} />

      <ContentBlock id="directions" title="오시는 길">
        <p className="text-base leading-relaxed text-navy/80">{page.directionsNote}</p>
        <Link
          href="/location"
          className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy/90"
        >
          오시는 길 자세히 보기
        </Link>
      </ContentBlock>

      <div
        id="consultation"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <CTASection
          pageType="service"
          serviceSlug={page.serviceSlug}
          pageSlug={page.slug}
          title={`${page.regionLabel} ${page.title} 상담 신청`}
          description={page.ctaDescription}
        />
      </div>

      <LocalLandingInternalLinks
        currentSlug={page.slug}
        regionKey={page.regionKey}
        serviceSlug={page.serviceSlug}
        regionLabel={page.regionLabel}
        pageType={page.pageType}
        relatedServiceLinks={page.relatedServiceLinks}
        relatedRegionLinks={page.relatedRegionLinks}
      />
    </article>
  );
}
