import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import type { LegalDocument } from "@/lib/legal";
import { getSiteUrl } from "@/lib/site-url";

type LegalDocumentViewProps = {
  document: LegalDocument;
  /** 교차 링크 (개인정보 ↔ 이용약관) */
  counterpart: { href: string; label: string };
};

function formatKoDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function LegalDocumentView({
  document,
  counterpart,
}: LegalDocumentViewProps) {
  const site = getSiteUrl().replace(/\/$/, "");
  const pageUrl = `${site}${document.path}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: document.h1,
    description: document.metaDescription,
    url: pageUrl,
    dateModified: document.lastUpdated,
    datePublished: document.effectiveDate,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: "다옴법무사사무소",
      url: site,
    },
  };

  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: document.title },
  ];

  return (
    <PageContainer>
      <Breadcrumb items={breadcrumbs} />
      <BreadcrumbJsonLd items={breadcrumbs} currentPath={document.path} />
      <JsonLd data={schema} />

      <article className="content-stack">
        <header>
          <p className="text-sm font-medium text-navy/60">법적 고지</p>
          <h1 className="page-title mt-1">{document.h1}</h1>
          <p className="body-text mt-4 max-w-3xl">{document.intro}</p>
          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy/70">
            <div className="flex gap-2">
              <dt className="font-semibold text-navy/80">시행일</dt>
              <dd>{formatKoDate(document.effectiveDate)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-navy/80">최종 수정</dt>
              <dd>{formatKoDate(document.lastUpdated)}</dd>
            </div>
          </dl>
        </header>

        <nav
          aria-label="목차"
          className="rounded-2xl border border-beige-dark bg-cream/50 p-5 sm:p-6"
        >
          <p className="text-sm font-semibold text-navy">목차</p>
          <ol className="mt-3 grid gap-2 text-sm text-navy/85 sm:grid-cols-2">
            {document.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="underline-offset-2 hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {document.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
            >
              <h2 className="section-heading text-xl">{section.title}</h2>
              <div className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-navy/90 md:text-base">
                {section.paragraphs.map((p, i) => (
                  <p key={`${section.id}-p-${i}`}>{p}</p>
                ))}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((item, i) => (
                      <li key={`${section.id}-b-${i}`}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.note ? (
                  <p className="rounded-xl border border-navy/10 bg-beige/40 px-4 py-3 text-sm text-navy/80">
                    {section.note}
                  </p>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <p className="text-sm text-navy/70">
          관련 문서:{" "}
          <Link
            href={counterpart.href}
            className="font-medium text-navy underline-offset-2 hover:underline"
          >
            {counterpart.label}
          </Link>
        </p>

        <RelatedLinks
          title="관련 안내"
          links={[
            { href: counterpart.href, label: counterpart.label },
            { href: "/contact", label: "상담 문의" },
            { href: "/contact/inquiry", label: "1분만에 문의하기" },
            { href: "/faq", label: "자주 묻는 질문" },
            { href: "/about", label: "사무소 소개" },
          ]}
        />
      </article>
    </PageContainer>
  );
}
