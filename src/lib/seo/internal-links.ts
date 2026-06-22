import { allServiceDetails } from "@/lib/services-data";
import type { RelatedLink } from "@/types/content";

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
