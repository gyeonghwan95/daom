import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { RelatedContentGrid } from "@/components/readability";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { getDirectConsultationChannels } from "@/lib/contact";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";
import {
  caseRegionPath,
  getChildrenOfDistrict,
  getCaseRegionBySlug,
  type DistrictKey,
} from "@/lib/case-regions";

type CaseRegionPageViewProps = {
  page: PageData;
  regionSlug: string;
};

export function CaseRegionPageView({
  page,
  regionSlug,
}: CaseRegionPageViewProps) {
  const entry = getCaseRegionBySlug(regionSlug);
  const channels = getDirectConsultationChannels();
  const children =
    entry?.kind === "district" && entry.parentDistrictKey
      ? getChildrenOfDistrict(entry.parentDistrictKey as DistrictKey).slice(0, 12)
      : [];

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <header className="space-y-3 border-b border-beige-dark pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/50">
          Regional case guide
        </p>
        <h1 className="page-title max-w-4xl">{page.h1}</h1>
        <p className="body-text max-w-3xl text-navy/80">{page.intro}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/contact" className="btn-primary min-h-11 px-5 text-sm">
            상담 문의하기
          </Link>
          <Link
            href="/업무사례/지역별"
            className="btn-secondary min-h-11 px-5 text-sm"
          >
            다른 지역 찾기
          </Link>
        </div>
      </header>

      <div className="max-w-3xl space-y-4">
        {page.introParagraphs.map((p) => (
          <p key={p.slice(0, 40)} className="body-text text-navy/80">
            {p}
          </p>
        ))}
      </div>

      {page.sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="section-heading">{section.title}</h2>
          {section.body ? (
            <p className="body-text max-w-3xl text-navy/75">{section.body}</p>
          ) : null}
          {section.items?.length ? (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-navy/80 md:text-[0.9375rem]">
              {section.items.map((item) => (
                <li key={item.slice(0, 48)}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.links?.length ? (
            <div className="pt-1">
              <RelatedContentGrid links={section.links} />
            </div>
          ) : null}
        </section>
      ))}

      {children.length > 0 ? (
        <section>
          <h2 className="section-heading">이 지역 세부 안내</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <li key={child.slug}>
                <Link
                  href={caseRegionPath(child.slug)}
                  className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-3 text-sm font-medium text-navy no-underline hover:bg-beige/40"
                >
                  {child.displayName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="section-heading">자주 묻는 질문</h2>
        <div className="mt-4">
          <FAQAccordion items={page.faqs} />
        </div>
      </section>

      <section className="rounded-2xl border border-beige-dark bg-beige/30 p-5 md:p-8">
        <h2 className="text-lg font-semibold text-navy">{page.ctaTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/75">{page.ctaText}</p>
        <div className="mt-5">
          <ConsultationButtons
            channels={channels}
            theme="light"
            layout="grid"
            showQrCodes={false}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary min-h-11 px-5 text-sm">
            상담 신청
          </Link>
          <Link href="/cases" className="btn-secondary min-h-11 px-5 text-sm">
            전체 업무 사례
          </Link>
        </div>
      </section>
    </article>
  );
}
