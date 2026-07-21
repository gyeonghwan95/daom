import Link from "next/link";
import type { Diagnosis } from "@/data/diagnosis";
import {
  DIAGNOSIS_HUB_CATEGORIES,
  DIAGNOSIS_HUB_INTRO,
  POPULAR_DIAGNOSIS_SLUGS,
} from "@/data/diagnosis-hub-meta";
import { DiagnosisCTA } from "@/components/diagnosis/DiagnosisCTA";
import { DiagnosisFAQ } from "@/components/diagnosis/DiagnosisFAQ";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageCoverBanner } from "@/components/sections/PageCoverBanner";
import { getDiagnosisCtaCopy } from "@/lib/diagnosis/builder";
import { getCoverImageForPageData } from "@/lib/pageData/cover-image";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import type { PageData } from "@/lib/pageData/types";

type DiagnosisHubViewProps = {
  page: PageData;
  topics: Diagnosis[];
};

function diagnosisLabel(topics: Diagnosis[], slug: string): string {
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) return slug;
  return topic.serviceName.includes("자가진단")
    ? topic.serviceName
    : `${topic.serviceName} 자가진단`;
}

export function DiagnosisHubView({ page, topics }: DiagnosisHubViewProps) {
  const cover = getCoverImageForPageData(page);
  const cta = getDiagnosisCtaCopy();

  const popularTopics = POPULAR_DIAGNOSIS_SLUGS.flatMap((slug) => {
    const topic = topics.find((item) => item.slug === slug);
    if (!topic) return [];
    return [{ slug, label: diagnosisLabel(topics, slug) }];
  });

  return (
    <article className="content-stack">
      <Breadcrumb items={page.breadcrumbs} />
      <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
      <JsonLd data={buildJsonLdForPageData(page)} />

      <PageCoverBanner image={cover} />

      <header>
        <h1 className="page-title">부산 법무사 업무별 자가진단</h1>
        <p className="body-text mt-4 max-w-3xl md:mt-5">{DIAGNOSIS_HUB_INTRO}</p>
      </header>

      <section id="diagnosis-categories">
        <h2 className="section-heading">업무 카테고리</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIAGNOSIS_HUB_CATEGORIES.map((category) => (
            <li key={category.id}>
              <article className="interactive-surface card-surface flex h-full flex-col px-4 py-5 hover:bg-beige/40 md:px-5">
                <h3 className="text-lg font-semibold text-navy">{category.title}</h3>
                <p className="mt-1 text-sm text-navy/60">{category.description}</p>
                <ul className="mt-4 flex flex-1 flex-col gap-2">
                  {category.diagnosisSlugs.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/${slug}`}
                        className="text-sm font-medium text-navy-light hover:text-navy hover:underline"
                      >
                        {diagnosisLabel(topics, slug)} →
                      </Link>
                    </li>
                  ))}
                </ul>
                {category.topicHubHref ? (
                  <Link
                    href={category.topicHubHref}
                    className="mt-4 text-xs font-semibold text-navy/50 hover:text-navy"
                  >
                    {category.title} 종합 안내 보기
                  </Link>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="popular-diagnosis">
        <h2 className="section-heading">인기 자가진단</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularTopics.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/${item.slug}`}
                className="interactive-surface card-surface flex min-h-[4.5rem] flex-col justify-center px-4 py-4 hover:bg-beige/40 md:px-5"
              >
                <span className="font-semibold text-navy">{item.label}</span>
                <span className="mt-1 text-sm text-navy/55">
                  절차·서류·비용·기한 확인
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <DiagnosisFAQ items={page.faqs} />

      <div id="consultation">
        <DiagnosisCTA title={cta.title} description={cta.text} pageSlug="자가진단" />
      </div>
    </article>
  );
}
