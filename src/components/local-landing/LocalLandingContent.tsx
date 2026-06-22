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
import { buildFaqPageSchema, buildServicePageSchema } from "@/lib/seo/json-ld";
import { consultationCopy } from "@/lib/consultation";
import { getConversionConsultationChannels } from "@/lib/contact";
import { getServiceImage } from "@/lib/site-images";
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

export function LocalLandingContent({ page }: LocalLandingContentProps) {
  const conversionChannels = getConversionConsultationChannels();
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
          buildFaqPageSchema(page.faqs),
        ]}
      />

      <PageCoverBanner image={getServiceImage(page.serviceSlug)} />

      <header>
        <p className="text-sm font-medium text-navy-light">
          {page.regionLabel} · {page.neighborhoods.join(" · ")}
        </p>
        <h1 className="page-title mt-2">{page.h1}</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{page.problemStatement}</p>
      </header>

      <ContentBlock id="consultation-case" title="실제 상담 사례">
        <div className="card-surface bg-beige p-6 md:p-8">
          <h3 className="text-lg font-semibold text-navy">{page.consultationCase.title}</h3>
          <p className="mt-3 text-base leading-relaxed text-navy/80">
            {page.consultationCase.summary}
          </p>
          {page.consultationCase.href ? (
            <Link
              href={page.consultationCase.href}
              className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-navy-light hover:underline"
            >
              관련 사례 자세히 보기 →
            </Link>
          ) : null}
        </div>
      </ContentBlock>

      <InlineConsultationCTA
        channels={conversionChannels}
        title={`${page.regionLabel} ${page.title} 지금 상담`}
        description={`${page.regionLabel}에서 ${page.title.replace(page.regionLabel, "").trim()}가 필요하시면 전화·카카오톡·네이버 예약으로 편하게 문의해 주세요.`}
      />

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
        channels={conversionChannels}
        title="비용·절차가 궁금하신가요?"
        description="카카오톡으로 등기부·상황을 보내주시면 대략적인 비용과 순서를 안내해 드립니다."
      />

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

      <div
        id="consultation"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <CTASection
          channels={conversionChannels}
          title={`${page.regionLabel} ${page.title} 상담 신청`}
          description={consultationCopy.default}
        />
      </div>

      <LocalLandingInternalLinks
        currentSlug={page.slug}
        regionKey={page.regionKey}
        serviceSlug={page.serviceSlug}
        regionLabel={page.regionLabel}
      />
    </article>
  );
}
