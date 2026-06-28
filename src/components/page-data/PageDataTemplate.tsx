import Link from "next/link";
import type { ReactNode } from "react";
import { InlineConsultationCTA } from "@/components/consultation/InlineConsultationCTA";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { getConversionConsultationChannels } from "@/lib/contact";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData, PageSection } from "@/lib/pageData/types";
import { PageDataNapSection } from "./PageDataNapSection";

type PageDataTemplateProps = {
  page: PageData;
  children?: ReactNode;
  showCover?: boolean;
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

function ExtraSections({ sections }: { sections: PageSection[] }) {
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => (
        <ContentBlock
          key={`${section.title}-${index}`}
          id={`section-${index}`}
          title={section.title}
        >
          <p className="body-text">{section.body}</p>
          {section.items && section.items.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="card-surface px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          {section.links && section.links.length > 0 ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="card-surface flex min-h-12 items-center px-4 py-3 text-base text-navy/80 hover:border-navy/20 hover:bg-beige/50 md:px-5 md:py-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </ContentBlock>
      ))}
    </>
  );
}

export function PageDataTemplate({
  page,
  children,
  showCover = true,
}: PageDataTemplateProps) {
  const conversionChannels = getConversionConsultationChannels();
  const cover = getCoverImageForPageData(page);
  const displayFaqs = page.faqs.slice(0, 3);

  return (
    <article className="space-y-8 md:space-y-12">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      {showCover ? <PageCoverBanner image={cover} /> : null}

      <header>
        <h1 className="page-title">{page.h1}</h1>
        <div className="mt-4 max-w-3xl space-y-4 md:mt-5">
          {page.introParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="body-text">
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      <InlineConsultationCTA
        channels={conversionChannels}
        title={page.ctaTitle}
        description={page.ctaText}
      />

      <ContentBlock id="procedures" title="핵심 절차">
        <ol className="space-y-3">
          {page.procedures.map((step, index) => (
            <li
              key={step}
              className="card-surface flex gap-3 px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </ContentBlock>

      <ContentBlock id="documents" title="필요 서류">
        <ul className="space-y-3">
          {page.documents.map((doc) => (
            <li
              key={doc}
              className="card-surface px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
            >
              {doc}
            </li>
          ))}
        </ul>
        <p className="body-text mt-4 text-sm text-navy/65">
          사건마다 추가 서류가 필요할 수 있습니다. 상담 시 체크리스트로
          안내드립니다.
        </p>
      </ContentBlock>

      {page.consultationPoints.length > 0 ? (
        <ContentBlock id="consultation-points" title="상담 포인트">
          <ul className="space-y-3">
            {page.consultationPoints.map((point) => (
              <li
                key={point}
                className="card-surface px-4 py-3 text-base leading-relaxed text-navy/80 md:px-5 md:py-4"
              >
                {point}
              </li>
            ))}
          </ul>
        </ContentBlock>
      ) : null}

      <ContentBlock id="consultation-example" title="실제 상담 상황 예시">
        <div className="card-surface bg-cream p-6 md:p-8">
          <h3 className="text-lg font-semibold text-navy">
            {page.consultationExample.title}
          </h3>
          <p className="body-text mt-3">{page.consultationExample.body}</p>
        </div>
      </ContentBlock>

      <ExtraSections sections={page.sections} />

      {children ? (
        <ContentBlock id="detail-content" title="상세 안내">
          <div className="mdx-content">{children}</div>
        </ContentBlock>
      ) : null}

      <ContentBlock id="faq" title="자주 묻는 질문">
        <FAQAccordion items={displayFaqs} />
      </ContentBlock>

      <RelatedLinks title="관련 페이지" links={page.internalLinks} />

      <div id="consultation">
        <CTASection
          title={page.ctaTitle}
          description={page.ctaText}
        />
      </div>

      <PageDataNapSection
        contactLinks={page.relatedLinks.filter((link) =>
          link.href.startsWith("tel:") ||
          link.label.includes("카카오") ||
          link.label.includes("톡톡") ||
          link.href === "/location",
        )}
      />
    </article>
  );
}
