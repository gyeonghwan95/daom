import { allServiceDetails } from "@/lib/services-data";
import { localLandingConfigs } from "@/lib/local-landing/config";
import { serviceLabels } from "@/lib/local-landing/districts";
import type { RelatedLink } from "@/types/content";

function localLandingTitle(config: (typeof localLandingConfigs)[number]): string {
  return `${config.regionLabel} ${serviceLabels[config.serviceSlug] ?? config.serviceSlug}`;
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
