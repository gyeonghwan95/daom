import { getRawDiagnosisBySlug } from "@/data/diagnosis-registry";
import { buildPageDataFromDiagnosis } from "@/lib/diagnosis/builder";
import { getLocalLandingBySlug } from "@/lib/local-landing";
import { getSeoLandingPageDataBySlug } from "@/lib/seo-landing";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { getTopicHubBySlug } from "@/lib/topic-hubs";
import { buildCaseRegionsHubPageData } from "@/lib/case-regions/builder";
import {
  buildLectureHistoryHubPageData,
  getLectureHistoryPageDataBySlug,
} from "@/lib/lectures/history-page-data";
import { getNationwidePageDataBySlug } from "@/lib/nationwide";
import {
  buildCorePageData,
  buildPageDataFromLocalLanding,
  buildPageDataFromTopicHub,
} from "./builders";
import { getPageDataByPath } from "./registry";
import { HUB_CHILD_LINKS } from "@/data/seo/hub-child-links";

/**
 * 상위 허브에 하위 상세 안내 링크를 붙인다. 내부 링크가 없던 색인 페이지를 맥락이 맞는 허브 한 곳에서만 연결한다
 * (목록: src/data/seo/hub-child-links.ts). 전역 푸터에는 넣지 않는다.
 */
function withHubChildLinks(
  page: ReturnType<typeof getPageDataByPath>,
): ReturnType<typeof getPageDataByPath> {
  const links = page ? HUB_CHILD_LINKS[page.path] : undefined;
  if (!page || !links?.length) return page;
  const existing = new Set(page.sections.flatMap((s) => (s.links ?? []).map((l) => l.href)));
  const fresh = links.filter((l) => !existing.has(l.href));
  if (!fresh.length) return page;
  return {
    ...page,
    sections: [
      ...page.sections,
      {
        id: "hub-child-links",
        title: "이어서 볼 수 있는 상세 안내",
        body: "같은 업무·지역에서 따로 정리한 안내입니다. 지금 상황에 가까운 항목을 골라 보세요.",
        links: fresh.map((l) => ({ href: l.href, label: l.label })),
      },
    ],
  };
}

export function resolveKoreanLandingPageData(
  slug: string,
): ReturnType<typeof getPageDataByPath> {
  return withHubChildLinks(resolveKoreanLandingPageDataBase(slug));
}

function resolveKoreanLandingPageDataBase(
  slug: string,
): ReturnType<typeof getPageDataByPath> {
  const normalized = normalizeRouteSlug(slug);

  if (normalized === "강의이력") {
    return buildLectureHistoryHubPageData();
  }

  if (normalized === "업무사례") {
    return buildCaseRegionsHubPageData();
  }

  if (normalized === "개인정보처리방침") {
    return buildCorePageData("privacy", { slugOverride: "개인정보처리방침" });
  }

  if (normalized === "이용약관") {
    return buildCorePageData("terms", { slugOverride: "이용약관" });
  }

  if (normalized === "공지사항") {
    return buildCorePageData("notices", { slugOverride: "공지사항" });
  }

  const nationwide = getNationwidePageDataBySlug(normalized);
  if (nationwide) {
    return nationwide;
  }

  const diagnosis = getRawDiagnosisBySlug(normalized);
  if (diagnosis) {
    return buildPageDataFromDiagnosis(diagnosis);
  }

  const hub = getTopicHubBySlug(normalized);
  if (hub) {
    return buildPageDataFromTopicHub(hub);
  }

  const landing = getLocalLandingBySlug(normalized);
  if (landing) {
    return buildPageDataFromLocalLanding(landing);
  }

  const seoLanding = getSeoLandingPageDataBySlug(normalized);
  if (seoLanding) {
    return seoLanding;
  }

  return undefined;
}

export function resolveLectureHistoryDetailPageData(slug: string) {
  return getLectureHistoryPageDataBySlug(normalizeRouteSlug(slug));
}

export function resolveServicePageData(slug: string) {
  return getPageDataByPath(`/services/${normalizeRouteSlug(slug)}`);
}

export function resolveBlogPageData(slug: string) {
  return getPageDataByPath(`/blog/${normalizeRouteSlug(slug)}`);
}

export function resolveCasePageData(slug: string) {
  return getPageDataByPath(`/services/cases/${normalizeRouteSlug(slug)}`);
}

export function resolveFaqPageData(slug: string) {
  return getPageDataByPath(`/faq/${normalizeRouteSlug(slug)}`);
}

export function resolveMediaPageData(slug: string) {
  return getPageDataByPath(`/media/${normalizeRouteSlug(slug)}`);
}

export function resolveExternalBlogPageData(postId: string) {
  return getPageDataByPath(`/blog/external/${normalizeRouteSlug(postId)}`);
}
