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
import { NationwideCasePageView } from "@/components/nationwide-cases/NationwideCasePageView";
import { GyeongnamCasePageView } from "@/components/gyeongnam-cases/GyeongnamCasePageView";
import { SoutheastCasePageView } from "@/components/southeast-cases/SoutheastCasePageView";
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
import {
  GYEONGNAM_CORE_CITY_LINKS,
  GYEONGNAM_HUB_FILTERS,
  getGyeongnamBySlug,
  getGyeongnamPageDataBySlug,
  getPublishedGyeongnamDefs,
  getPublishedGyeongnamSlugs,
} from "@/lib/gyeongnam-cases";
import { buildLectureHistoryDetailPageData } from "@/lib/lectures/history-page-data";
import {
  getNationwideCaseBySlug,
  getNationwideCasePageDataBySlug,
  getPublishedNationwideCaseDefs,
  getPublishedNationwideCaseSlugs,
  getRegionHubGroups,
} from "@/lib/nationwide-cases";
import {
  SOUTHEAST_HUB_LINKS,
  getPublishedSoutheastDefs,
  getPublishedSoutheastSlugs,
  getSoutheastBySlug,
  getSoutheastHubFilters,
  getSoutheastPageDataBySlug,
} from "@/lib/southeast-cases";
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

  const nationwideCaseParams = getPublishedNationwideCaseSlugs().map(
    (slug) => ({
      landingSlug: "업무사례",
      childSlug: slug,
    }),
  );

  const gyeongnamCaseParams = getPublishedGyeongnamSlugs().map((slug) => ({
    landingSlug: "업무사례",
    childSlug: slug,
  }));

  const southeastCaseParams = getPublishedSoutheastSlugs().map((slug) => ({
    landingSlug: "업무사례",
    childSlug: slug,
  }));

  return [
    ...lectureParams,
    ...caseHubParams,
    ...caseRegionParams,
    ...nationwideCaseParams,
    ...gyeongnamCaseParams,
    ...southeastCaseParams,
  ];
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

    const nationwidePage = getNationwideCasePageDataBySlug(child);
    if (nationwidePage) {
      const meta = pageDataToMetadata(nationwidePage);
      return {
        ...meta,
        alternates: {
          ...meta.alternates,
          canonical: getCanonicalUrl(nationwidePage.path),
        },
      };
    }

    const gyeongnamPage = getGyeongnamPageDataBySlug(child);
    if (gyeongnamPage) {
      const meta = pageDataToMetadata(gyeongnamPage);
      return {
        ...meta,
        alternates: {
          ...meta.alternates,
          canonical: getCanonicalUrl(gyeongnamPage.path),
        },
      };
    }

    const southeastPage = getSoutheastPageDataBySlug(child);
    if (southeastPage) {
      const meta = pageDataToMetadata(southeastPage);
      return {
        ...meta,
        alternates: {
          ...meta.alternates,
          canonical: getCanonicalUrl(southeastPage.path),
        },
      };
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

    const nationwideDef = getNationwideCaseBySlug(child);
    const nationwidePage = getNationwideCasePageDataBySlug(child);
    if (nationwideDef && nationwidePage) {
      const explorerItems = getPublishedNationwideCaseDefs()
        .filter((d) => d.kind === "region")
        .map((d) => ({
          slug: d.slug,
          regionName: d.regionName,
          parentRegion: d.parentRegion,
          primaryKeyword: d.primaryKeyword,
          h1: d.h1,
          priority: d.priority,
          keywords: [d.primaryKeyword, ...d.secondaryKeywords, d.slug],
        }));

      return (
        <PageContainer>
          <NationwideCasePageView
            page={nationwidePage}
            def={nationwideDef}
            explorerItems={explorerItems}
            explorerGroups={getRegionHubGroups()}
          />
        </PageContainer>
      );
    }

    const gyeongnamDef = getGyeongnamBySlug(child);
    const gyeongnamPage = getGyeongnamPageDataBySlug(child);
    if (gyeongnamDef && gyeongnamPage) {
      const explorerItems = getPublishedGyeongnamDefs().map((d) => ({
        slug: d.slug,
        regionName: d.regionName,
        parentRegion: d.parentRegion,
        primaryKeyword: d.primaryKeyword,
        h1: d.h1,
        pageType: d.pageType,
        keywords: [d.primaryKeyword, ...d.secondaryKeywords, d.slug, d.pageType],
      }));

      return (
        <PageContainer>
          <GyeongnamCasePageView
            page={gyeongnamPage}
            def={gyeongnamDef}
            explorerItems={explorerItems}
            explorerFilters={GYEONGNAM_HUB_FILTERS.map((f) => ({
              id: f.id,
              label: f.label,
            }))}
            coreLinks={[...GYEONGNAM_CORE_CITY_LINKS]}
          />
        </PageContainer>
      );
    }

    const southeastDef = getSoutheastBySlug(child);
    const southeastPage = getSoutheastPageDataBySlug(child);
    if (southeastDef && southeastPage) {
      const explorerItems = getPublishedSoutheastDefs()
        .filter((d) => d.regionGroup === southeastDef.regionGroup)
        .map((d) => ({
          slug: d.slug,
          regionName: d.regionName,
          parentRegion: d.parentRegion,
          primaryKeyword: d.primaryKeyword,
          h1: d.h1,
          pageType: d.pageType,
          keywords: [
            d.primaryKeyword,
            ...d.secondaryKeywords,
            d.slug,
            d.pageType,
            d.regionGroup,
          ],
        }));

      return (
        <PageContainer>
          <SoutheastCasePageView
            page={southeastPage}
            def={southeastDef}
            explorerItems={explorerItems}
            explorerFilters={getSoutheastHubFilters(southeastDef.regionGroup)}
            coreLinks={[...SOUTHEAST_HUB_LINKS[southeastDef.regionGroup]]}
          />
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
