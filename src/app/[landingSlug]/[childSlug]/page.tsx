import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CaseRegionsByAreaView,
  CaseRegionsByServiceView,
} from "@/components/case-regions/CaseRegionHubViews";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { PageDataTemplate } from "@/components/page-data/PageDataTemplate";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { LectureHistoryDetailView } from "@/components/lectures/history/LectureHistoryDetailView";
import {
  getAllLectureHistorySlugs,
  getLectureHistoryBySlug,
} from "@/data/lectures/history";
import {
  buildCaseRegionPageData,
  buildCaseRegionsByAreaPageData,
  buildCaseRegionsByServicePageData,
} from "@/lib/case-regions/builder";
import {
  caseRegionPath,
  getAllCaseRegionEntries,
  getCaseRegionBySlug,
  getChildrenOfDistrict,
  type DistrictKey,
} from "@/lib/case-regions";
import { buildLectureHistoryDetailPageData } from "@/lib/lectures/history-page-data";
import { buildJsonLdForPageData } from "@/lib/pageData/json-ld";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { normalizeRouteSlug } from "@/lib/seo/slug";

type Props = {
  params: Promise<{ landingSlug: string; childSlug: string }>;
};

export const dynamicParams = false;

/**
 * `/강의이력/[slug]`, `/업무사례/[slug]` —
 * 한글 물리 폴더 아래 동적 세그먼트는 static export 시 InvalidCharacterError가 나므로
 * `[landingSlug]/[childSlug]` 로 생성합니다.
 */
export function generateStaticParams() {
  const lectureParams = getAllLectureHistorySlugs().map((slug) => ({
    landingSlug: "강의이력",
    childSlug: slug,
  }));

  const caseHubParams = ["지역별", "업무별"].map((slug) => ({
    landingSlug: "업무사례",
    childSlug: slug,
  }));

  const caseRegionParams = getAllCaseRegionEntries().map((entry) => ({
    landingSlug: "업무사례",
    childSlug: entry.slug,
  }));

  return [...lectureParams, ...caseHubParams, ...caseRegionParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { landingSlug, childSlug } = await params;
  const parent = normalizeRouteSlug(landingSlug);
  const child = normalizeRouteSlug(childSlug);

  if (parent === "강의이력") {
    const entry = getLectureHistoryBySlug(child);
    if (!entry) return {};
    return pageDataToMetadata(buildLectureHistoryDetailPageData(entry));
  }

  if (parent === "업무사례") {
    if (child === "지역별") {
      return pageDataToMetadata(buildCaseRegionsByAreaPageData());
    }
    if (child === "업무별") {
      return pageDataToMetadata(buildCaseRegionsByServicePageData());
    }

    const entry = getCaseRegionBySlug(child);
    if (!entry) return {};

    const page = buildCaseRegionPageData(entry);
    const meta = pageDataToMetadata(page);
    const canonicalSlug = entry.canonicalSlug ?? entry.slug;
    const shouldIndex =
      entry.indexable &&
      (!entry.canonicalSlug || entry.canonicalSlug === entry.slug);

    return {
      ...meta,
      alternates: {
        ...meta.alternates,
        canonical: getCanonicalUrl(caseRegionPath(canonicalSlug)),
      },
      robots: shouldIndex ? meta.robots : { index: false, follow: true },
    };
  }

  return {};
}

export default async function NestedKoreanLandingChildPage({ params }: Props) {
  const { landingSlug, childSlug } = await params;
  const parent = normalizeRouteSlug(landingSlug);
  const child = normalizeRouteSlug(childSlug);

  if (parent === "강의이력") {
    const entry = getLectureHistoryBySlug(child);
    if (!entry) notFound();

    const page = buildLectureHistoryDetailPageData(entry);

    return (
      <PageContainer>
        <Breadcrumb items={page.breadcrumbs} />
        <BreadcrumbJsonLd items={page.breadcrumbs} currentPath={page.path} />
        <JsonLd data={buildJsonLdForPageData(page)} />
        <article>
          <LectureHistoryDetailView entry={entry} />
        </article>
      </PageContainer>
    );
  }

  if (parent === "업무사례") {
    if (child === "지역별") {
      return (
        <PageContainer>
          <CaseRegionsByAreaView page={buildCaseRegionsByAreaPageData()} />
        </PageContainer>
      );
    }

    if (child === "업무별") {
      return (
        <PageContainer>
          <CaseRegionsByServiceView page={buildCaseRegionsByServicePageData()} />
        </PageContainer>
      );
    }

    const entry = getCaseRegionBySlug(child);
    if (!entry) notFound();

    const page = buildCaseRegionPageData(entry);
    const children =
      entry.kind === "district" && entry.parentDistrictKey
        ? getChildrenOfDistrict(entry.parentDistrictKey as DistrictKey).slice(
            0,
            12,
          )
        : [];

    return (
      <PageContainer>
        <PageDataTemplate page={page}>
          {children.length > 0 ? (
            <section className="space-y-3">
              <h2 className="section-heading">이 지역 세부 안내</h2>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {children.map((region) => (
                  <li key={region.slug}>
                    <Link
                      href={caseRegionPath(region.slug)}
                      className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-3 text-sm font-medium text-navy no-underline hover:bg-beige/40"
                    >
                      {region.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </PageDataTemplate>
      </PageContainer>
    );
  }

  notFound();
}
