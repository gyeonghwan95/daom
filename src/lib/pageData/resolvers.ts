import { getRawDiagnosisBySlug } from "@/data/diagnosis-registry";
import { buildPageDataFromDiagnosis } from "@/lib/diagnosis/builder";
import { getLocalLandingBySlug } from "@/lib/local-landing";
import { getSeoLandingPageDataBySlug } from "@/lib/seo-landing";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import { getTopicHubBySlug } from "@/lib/topic-hubs";
import { getPageDataByPath } from "./registry";

export function resolveKoreanLandingPageData(
  slug: string,
): ReturnType<typeof getPageDataByPath> {
  const normalized = normalizeRouteSlug(slug);

  const diagnosis = getRawDiagnosisBySlug(normalized);
  if (diagnosis) {
    return buildPageDataFromDiagnosis(diagnosis);
  }

  const hub = getTopicHubBySlug(normalized);
  if (hub) {
    return getPageDataByPath(hub.path);
  }

  const landing = getLocalLandingBySlug(normalized);
  if (landing) {
    return getPageDataByPath(landing.path);
  }

  const seoLanding = getSeoLandingPageDataBySlug(normalized);
  if (seoLanding) {
    return seoLanding;
  }

  return undefined;
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
