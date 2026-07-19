/**
 * 사이트 전체 URL 중앙 PageData 레지스트리
 *
 * 카테고리: core, service, local, cost, court, businessDistrict,
 *           realEstate, pillar, diagnosis, blog, case, faq, media, external
 *
 * 전체 path 목록: `npm run validate:page-data` 또는
 * `scripts/output/page-manifest.json` (prebuild 시 생성)
 */
import { allDiagnosisPages } from "@/data/diagnosis-registry";
import { getContentMeta, getContentSlugs } from "@/lib/content/loader";
import { buildPageDataFromDiagnosis } from "@/lib/diagnosis/builder";
import {
  getAllLocalLandingPages,
  getLocalLandingBySlug,
} from "@/lib/local-landing";
import { getAllPressArticles } from "@/lib/press-articles";
import { getAllSeoLandingPageData } from "@/lib/seo-landing";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { allServiceDetails } from "@/lib/services-data";
import { getAllTopicHubSlugs, getTopicHubBySlug } from "@/lib/topic-hubs";
import {
  buildSituationsHubPageData,
  getAllSituationPages,
  buildPageDataFromSituation,
} from "@/lib/situations";
import { buildBusanLegalMapHubPageData } from "@/lib/busan-legal-map/builder";
import {
  buildAllGlossaryTermPageData,
  buildGlossaryHubPageData,
} from "@/lib/glossary";
import { buildCasesHubPageData } from "@/lib/cases/builder";
import {
  buildCaseRegionPageData,
  buildCaseRegionsByAreaPageData,
  buildCaseRegionsByServicePageData,
  buildCaseRegionsHubPageData,
} from "@/lib/case-regions/builder";
import { getAllCaseRegionEntries } from "@/lib/case-regions";
import { buildAllNationwidePageData } from "@/lib/nationwide";
import { buildAllPublishedNationwideCasePageData } from "@/lib/nationwide-cases";
import { buildAllPublishedGyeongnamPageData } from "@/lib/gyeongnam-cases";
import { buildAllPublishedSoutheastPageData } from "@/lib/southeast-cases";

import {
  buildToolsHubPageData,
  getAllToolDefinitions,
  buildPageDataFromTool,
} from "@/lib/tools";
import { buildAllLectureHistoryPageData } from "@/lib/lectures/history-page-data";
import {
  buildCorePageData,
  buildHomePageData,
  buildLegacyRedirectPageData,
  buildPageDataFromBlogMeta,
  buildPageDataFromCaseMeta,
  buildPageDataFromFaqMeta,
  buildPageDataFromLocalLanding,
  buildPageDataFromPress,
  buildPageDataFromService,
  buildPageDataFromTopicHub,
} from "./builders";
import type { PageData } from "./types";

let cachedPages: PageData[] | null = null;

function buildAllPageData(): PageData[] {
  const pages: PageData[] = [];

  pages.push(buildHomePageData());

  const coreKeys = [
    "about",
    "office",
    "services",
    "blog",
    "reviews",
    "faq",
    "media",
    "contact",
    "location",
    "searchGuides",
  ] as const;

  for (const key of coreKeys) {
    pages.push(buildCorePageData(key));
  }

  pages.push(
    buildCorePageData("contact", {
      pathOverride: "/contact/inquiry",
      slugOverride: "contact-inquiry",
    }),
  );

  for (const diagnosis of allDiagnosisPages) {
    pages.push(buildPageDataFromDiagnosis(diagnosis));
  }

  for (const page of getAllLocalLandingPages()) {
    pages.push(buildPageDataFromLocalLanding(page));
  }

  for (const page of getAllSeoLandingPageData()) {
    pages.push(page);
  }

  for (const slug of getAllTopicHubSlugs()) {
    const hub = getTopicHubBySlug(slug);
    if (hub) {
      pages.push(buildPageDataFromTopicHub(hub));
    }
  }

  pages.push(buildSituationsHubPageData());

  for (const situation of getAllSituationPages()) {
    pages.push(buildPageDataFromSituation(situation));
  }

  pages.push(buildToolsHubPageData());

  for (const tool of getAllToolDefinitions()) {
    pages.push(buildPageDataFromTool(tool));
  }

  for (const service of allServiceDetails) {
    pages.push(buildPageDataFromService(service));
  }

  for (const slug of getContentSlugs("blog")) {
    const meta = getContentMeta("blog", slug);
    if (meta) pages.push(buildPageDataFromBlogMeta(meta));
  }

  for (const slug of getContentSlugs("cases")) {
    const meta = getContentMeta("cases", slug);
    if (meta) {
      pages.push(buildPageDataFromCaseMeta(meta));
    }
  }

  for (const slug of getContentSlugs("faq")) {
    const meta = getContentMeta("faq", slug);
    if (meta) pages.push(buildPageDataFromFaqMeta(meta));
  }

  for (const article of getAllPressArticles()) {
    pages.push(buildPageDataFromPress(article));
  }

  pages.push(buildCasesHubPageData());
  pages.push(buildCaseRegionsHubPageData());
  pages.push(buildCaseRegionsByAreaPageData());
  pages.push(buildCaseRegionsByServicePageData());
  for (const entry of getAllCaseRegionEntries()) {
    pages.push(buildCaseRegionPageData(entry));
  }

  pages.push(...buildAllNationwidePageData());
  pages.push(...buildAllPublishedNationwideCasePageData());
  pages.push(...buildAllPublishedGyeongnamPageData());
  pages.push(...buildAllPublishedSoutheastPageData());

  pages.push(buildBusanLegalMapHubPageData());

  pages.push(buildGlossaryHubPageData());
  pages.push(...buildAllGlossaryTermPageData());

  pages.push(...buildAllLectureHistoryPageData());

  for (const slug of getContentSlugs("cases")) {
    pages.push(
      buildLegacyRedirectPageData(
        slug,
        `/cases/${slug}`,
        `/services/cases/${slug}`,
        "사례 상세",
        "사례 상세 페이지로 이동합니다.",
      ),
    );
  }

  pages.push(
    buildLegacyRedirectPageData(
      "press",
      "/press",
      "/media#press",
      "언론·활동",
      "언론보도 목록은 언론·활동 페이지에서 확인하실 수 있습니다.",
    ),
  );

  for (const article of getAllPressArticles()) {
    pages.push(
      buildLegacyRedirectPageData(
        article.slug,
        `/press/${article.slug}`,
        `/media/${article.slug}`,
        article.title,
        "언론보도 상세 페이지로 이동합니다.",
      ),
    );
  }

  return pages;
}

/** 전체 등록 페이지 데이터 (lazy cache) */
export function getAllPageData(): PageData[] {
  if (!cachedPages) {
    cachedPages = buildAllPageData();
    validatePageDataRegistry(cachedPages);
  }
  return cachedPages;
}

export function getPageDataByPath(path: string): PageData | undefined {
  const key = normalizeRouteSlug(path);
  return getAllPageData().find(
    (page) => normalizeRouteSlug(page.path) === key,
  );
}

export function getPageDataBySlug(slug: string): PageData | undefined {
  const key = normalizeRouteSlug(slug);
  return getAllPageData().find(
    (page) => normalizeRouteSlug(page.slug) === key,
  );
}

export function listAllPagePaths(): string[] {
  return getAllPageData().map((page) => page.path);
}

export function printPageDataManifest(): void {
  const pages = getAllPageData();
  const byCategory = pages.reduce<Record<string, number>>((acc, page) => {
    acc[page.category] = (acc[page.category] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`[pageData] Total: ${pages.length} pages`);
  for (const [category, count] of Object.entries(byCategory).sort()) {
    console.log(`  ${category}: ${count}`);
  }
  console.log("");
  for (const path of listAllPagePaths()) {
    console.log(path);
  }
}

export type PageDataValidationError = {
  kind: "duplicate-path" | "duplicate-root-slug" | "missing-landing";
  message: string;
};

/** 중복 path·루트 slug 검증 — 실패 시 throw */
export function validatePageDataRegistry(pages: PageData[] = getAllPageData()): void {
  const pathOwners = new Map<string, string>();
  const rootSlugOwners = new Map<string, string>();

  for (const page of pages) {
    const normalizedPath = normalizeRouteSlug(page.path);

    if (pathOwners.has(normalizedPath)) {
      throw new Error(
        `[pageData] duplicate path: ${page.path} (slug: ${page.slug}, existing: ${pathOwners.get(normalizedPath)})`,
      );
    }
    pathOwners.set(normalizedPath, page.slug);

    const segments = normalizedPath.split("/").filter(Boolean);
    if (segments.length === 1) {
      const rootSlug = segments[0]!;
      if (rootSlugOwners.has(rootSlug)) {
        throw new Error(
          `[pageData] duplicate root slug: ${rootSlug} (${page.path} vs ${rootSlugOwners.get(rootSlug)})`,
        );
      }
      rootSlugOwners.set(rootSlug, page.path);
    }
  }

  for (const slug of getAllTopicHubSlugs()) {
    const landing = getLocalLandingBySlug(slug);
    if (landing) {
      throw new Error(
        `[pageData] topic hub slug collides with local landing: ${slug}`,
      );
    }
  }
}

/** 빌드·검증 스크립트용 요약 */
export function getPageDataSummary() {
  const pages = getAllPageData();
  return {
    total: pages.length,
    paths: pages.map((p) => p.path),
    byCategory: pages.reduce<Record<string, number>>((acc, page) => {
      acc[page.category] = (acc[page.category] ?? 0) + 1;
      return acc;
    }, {}),
  };
}
