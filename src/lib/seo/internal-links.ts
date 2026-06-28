import { allServiceDetails } from "@/lib/services-data";
import { localLandingConfigs } from "@/lib/local-landing/config";
import { serviceLabels } from "@/lib/local-landing/districts";
import { getTopicHubConfig } from "@/lib/topic-hubs/config";
import { getTopicHubSlugForService } from "@/lib/topic-hubs/service-hub-map";
import type { LocalLandingPageType } from "@/types/local-landing";
import type { RelatedLink } from "@/types/content";

function localLandingTitle(config: (typeof localLandingConfigs)[number]): string {
  switch (config.pageType) {
    case "region-hub":
      return `${config.regionLabel} 법무사`;
    case "conversion":
    case "court-registry":
    case "business-zone":
    case "real-estate-dev":
      return config.slug;
    default:
      return `${config.regionLabel} ${serviceLabels[config.serviceSlug] ?? config.serviceSlug}`;
  }
}

/** 업무 상세 ↔ 홈·소개·문의 순환 링크 */
export const serviceHubLinks: RelatedLink[] = [
  { href: "/", label: "홈" },
  { href: "/about", label: "법무사 소개" },
  { href: "/services", label: "업무안내 전체" },
  { href: "/contact", label: "상담 문의" },
  { href: "/location", label: "오시는 길" },
];

export function getAllServiceLinks(): RelatedLink[] {
  return allServiceDetails.map((service) => ({
    href: `/services/${service.slug}`,
    label: service.title,
  }));
}

/** 현재 업무를 제외한 전체 업무 상호 링크 */
export function getServiceCrossLinks(excludeSlug: string): RelatedLink[] {
  return allServiceDetails
    .filter((service) => service.slug !== excludeSlug)
    .map((service) => ({
      href: `/services/${service.slug}`,
      label: service.title,
    }));
}

const coreServiceSlugs = [
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "company-establishment",
  "director-change",
  "real-estate-registration",
] as const;

/** 지역 랜딩 페이지용 핵심 6개 업무 상호 링크 (동일 지역 한글 URL) */
export function getLocalServiceCrossLinks(
  regionKey: string,
  excludeSlug: string,
): RelatedLink[] {
  return localLandingConfigs
    .filter(
      (config) =>
        config.regionKey === regionKey &&
        coreServiceSlugs.includes(
          config.serviceSlug as (typeof coreServiceSlugs)[number],
        ) &&
        config.slug !== excludeSlug,
    )
    .map((config) => ({
      href: `/${config.slug}`,
      label: localLandingTitle(config),
    }));
}

/** 업무 상세 페이지 → 해당 업무 지역 랜딩 링크 */
export function getLocalLandingLinksForService(
  serviceSlug: string,
): RelatedLink[] {
  return localLandingConfigs
    .filter((config) => config.serviceSlug === serviceSlug)
    .map((config) => ({
      href: `/${config.slug}`,
      label: localLandingTitle(config),
    }));
}

export function getLocalLandingLinksForRegion(
  regionLabel: string,
  excludeSlug: string,
): RelatedLink[] {
  return localLandingConfigs
    .filter(
      (config) =>
        config.regionLabel === regionLabel && config.slug !== excludeSlug,
    )
    .slice(0, 6)
    .map((config) => ({
      href: `/${config.slug}`,
      label: localLandingTitle(config),
    }));
}

export function getAllLocalLandingLinks(): RelatedLink[] {
  return localLandingConfigs.map((config) => ({
    href: `/${config.slug}`,
    label: localLandingTitle(config),
  }));
}

export function getAllTopicHubLinks(): RelatedLink[] {
  return [
    "상속",
    "법인등기",
    "부동산등기",
    "개인회생파산",
    "민사소송",
    "임대차전세",
    "공탁채권회수",
    "가족후견",
    "특수등기",
    "창업법무",
  ].map((slug) => {
    const hub = getTopicHubConfig(slug);
    return {
      href: `/${slug}`,
      label: hub?.title ?? slug,
    };
  });
}

export function getTopicHubLinkForService(
  serviceSlug: string,
): RelatedLink | undefined {
  const hubSlug = getTopicHubSlugForService(serviceSlug);
  if (!hubSlug) return undefined;
  const hub = getTopicHubConfig(hubSlug);
  if (!hub) return undefined;
  return {
    href: `/${hubSlug}`,
    label: `${hub.title} 보기`,
  };
}

export { getMainLandingHubLinks } from "@/lib/pageData/internal-links";

export {
  FAQ_HUB_GROUPS,
  HOME_HUB_SECTIONS,
  LOCATION_HUB_LINKS,
  SERVICE_HUB_SECTIONS,
  getAllCoreHubLinks,
} from "@/lib/hub/home-sections";
export { getCoreHubSpokes, getHubNavigationLinks, isCoreHubSlug } from "@/lib/hub";

export function getTopicHubLinksForLanding(
  serviceSlug: string,
): RelatedLink[] {
  const hubSlug = getTopicHubSlugForService(serviceSlug);
  if (!hubSlug) return [];
  const hub = getTopicHubConfig(hubSlug);
  if (!hub) return [];
  return [
    {
      href: `/${hubSlug}`,
      label: `${hub.h1} 종합 안내`,
    },
    ...hub.relatedHubSlugs.map((relatedSlug) => {
      const related = getTopicHubConfig(relatedSlug);
      return {
        href: `/${relatedSlug}`,
        label: related ? `${related.title} 보기` : relatedSlug,
      };
    }),
  ];
}

/** 지역 허브 페이지 링크 */
export function getRegionHubLinks(excludeSlug?: string): RelatedLink[] {
  return localLandingConfigs
    .filter((c) => c.pageType === "region-hub" && c.slug !== excludeSlug)
    .slice(0, 8)
    .map((config) => ({
      href: `/${config.slug}`,
      label: localLandingTitle(config),
    }));
}

/** 비용·서류 전환 페이지 링크 */
export function getConversionLandingLinks(excludeSlug?: string): RelatedLink[] {
  return localLandingConfigs
    .filter((c) => c.pageType === "conversion" && c.slug !== excludeSlug)
    .map((config) => ({
      href: `/${config.slug}`,
      label: localLandingTitle(config),
    }));
}

/** 법원·등기소 관련 페이지 링크 */
export function getCourtRegistryLinks(excludeSlug?: string): RelatedLink[] {
  return localLandingConfigs
    .filter((c) => c.pageType === "court-registry" && c.slug !== excludeSlug)
    .slice(0, 6)
    .map((config) => ({
      href: `/${config.slug}`,
      label: localLandingTitle(config),
    }));
}

export function getRelatedLinksByPageType(
  pageType: LocalLandingPageType,
  excludeSlug: string,
): RelatedLink[] {
  switch (pageType) {
    case "region-hub":
      return getLocalServiceCrossLinks(
        localLandingConfigs.find((c) => c.slug === excludeSlug)?.regionKey ?? "busan",
        excludeSlug,
      );
    case "conversion":
      return getConversionLandingLinks(excludeSlug).slice(0, 5);
    case "court-registry":
      return getCourtRegistryLinks(excludeSlug);
    case "business-zone":
    case "real-estate-dev":
      return getLocalLandingLinksForService(
        localLandingConfigs.find((c) => c.slug === excludeSlug)?.serviceSlug ?? "corporate-registration",
      ).slice(0, 6);
    default:
      return getLocalServiceCrossLinks(
        localLandingConfigs.find((c) => c.slug === excludeSlug)?.regionKey ?? "busan",
        excludeSlug,
      );
  }
}
