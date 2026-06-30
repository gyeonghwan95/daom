import { localLandingConfigs } from "@/lib/local-landing/config";
import { serviceLabels } from "@/lib/local-landing/districts";
import { getTopicHubConfig } from "@/lib/topic-hubs/config";
import { getTopicHubSlugForService } from "@/lib/topic-hubs/service-hub-map";
import type { LocalLandingPageType } from "@/types/local-landing";
import type { RelatedLink } from "@/types/content";
import type { PageCategory, PageRelatedLink } from "./types";

const INHERITANCE_SERVICES = [
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
] as const;

const CORPORATE_SERVICES = [
  "corporate-registration",
  "company-establishment",
  "director-change",
] as const;

const REAL_ESTATE_SERVICES = [
  "real-estate-registration",
  "ownership-transfer",
] as const;

const REHAB_SERVICES = ["personal-rehabilitation", "bankruptcy"] as const;

function toPageLink(link: RelatedLink): PageRelatedLink {
  return { href: link.href, label: link.label };
}

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

function getClusterServiceSlugs(serviceSlug: string): string[] {
  if ((INHERITANCE_SERVICES as readonly string[]).includes(serviceSlug)) {
    return [...INHERITANCE_SERVICES];
  }
  if ((CORPORATE_SERVICES as readonly string[]).includes(serviceSlug)) {
    return [...CORPORATE_SERVICES];
  }
  if ((REAL_ESTATE_SERVICES as readonly string[]).includes(serviceSlug)) {
    return [...REAL_ESTATE_SERVICES];
  }
  if ((REHAB_SERVICES as readonly string[]).includes(serviceSlug)) {
    return [...REHAB_SERVICES];
  }
  return [serviceSlug];
}

function serviceDetailLinks(serviceSlug: string, excludePath?: string): PageRelatedLink[] {
  return getClusterServiceSlugs(serviceSlug)
    .filter((slug) => slug !== serviceSlug)
    .map((slug) => ({
      href: `/services/${slug}`,
      label: serviceLabels[slug] ?? slug,
    }))
    .filter((link) => link.href !== excludePath);
}

function localLandingsForService(
  serviceSlug: string,
  excludeSlug?: string,
  limit = 4,
): PageRelatedLink[] {
  return localLandingConfigs
    .filter(
      (c) =>
        c.serviceSlug === serviceSlug &&
        c.slug !== excludeSlug &&
        (c.pageType === "service-region" || !c.pageType),
    )
    .slice(0, limit)
    .map((c) => ({
      href: `/${c.slug}`,
      label: localLandingTitle(c),
    }));
}

function regionLandingsForRegion(
  regionKey: string,
  excludeSlug?: string,
  limit = 6,
): PageRelatedLink[] {
  return localLandingConfigs
    .filter(
      (c) =>
        c.regionKey === regionKey &&
        c.slug !== excludeSlug &&
        (c.pageType === "service-region" || !c.pageType),
    )
    .slice(0, limit)
    .map((c) => ({
      href: `/${c.slug}`,
      label: localLandingTitle(c),
    }));
}

function conversionLinksForService(
  serviceSlug: string,
  excludeSlug?: string,
): PageRelatedLink[] {
  return localLandingConfigs
    .filter(
      (c) =>
        c.pageType === "conversion" &&
        c.serviceSlug === serviceSlug &&
        c.slug !== excludeSlug,
    )
    .map((c) => ({
      href: `/${c.slug}`,
      label: localLandingTitle(c),
    }));
}

function courtLinksForService(
  serviceSlug: string,
  excludeSlug?: string,
): PageRelatedLink[] {
  return localLandingConfigs
    .filter(
      (c) =>
        c.pageType === "court-registry" &&
        c.serviceSlug === serviceSlug &&
        c.slug !== excludeSlug,
    )
    .slice(0, 4)
    .map((c) => ({
      href: `/${c.slug}`,
      label: localLandingTitle(c),
    }));
}

function topicHubLink(serviceSlug: string): PageRelatedLink | undefined {
  const hubSlug = getTopicHubSlugForService(serviceSlug);
  if (!hubSlug) return undefined;
  const hub = getTopicHubConfig(hubSlug);
  if (!hub) return undefined;
  return { href: `/${hubSlug}`, label: hub.title };
}

/** 홈·services·blog·faq·location 등 허브 페이지용 주요 랜딩 링크 */
export function getMainLandingHubLinks(): RelatedLink[] {
  return [
    { href: "/부산법무사", label: "부산 법무사" },
    { href: "/해운대법무사", label: "해운대 법무사" },
    { href: "/센텀법무사", label: "센텀 법무사" },
    { href: "/부산여성법무사", label: "부산 여성 법무사" },
    { href: "/부산상속등기", label: "부산 상속등기" },
    { href: "/부산법인등기", label: "부산 법인등기" },
    { href: "/부산부동산등기", label: "부산 부동산등기" },
    { href: "/부산개인회생", label: "부산 개인회생" },
    { href: "/부산법무사비용", label: "부산 법무사 비용" },
    { href: "/부산지방법원등기국", label: "부산 법원·등기소 안내" },
    { href: "/명례산업단지법인등기", label: "부산 산업단지 법인등기" },
    { href: "/부산재개발등기", label: "부산 재개발·재건축 등기" },
    { href: "/부산선박등기", label: "부산 선박등기" },
    { href: "/상속", label: "상속 종합 허브" },
    { href: "/법인등기", label: "법인등기 종합 허브" },
  ];
}

export type ThematicLinkInput = {
  slug: string;
  path: string;
  category: PageCategory;
  serviceSlug?: string;
  landingPageType?: LocalLandingPageType;
  regionKey?: string;
};

/** 업무·지역·비용·법원 테마별 내부링크 */
export function getThematicInternalLinks(
  input: ThematicLinkInput,
): PageRelatedLink[] {
  const links: PageRelatedLink[] = [];
  const config = localLandingConfigs.find((c) => c.slug === input.slug);
  const serviceSlug = input.serviceSlug ?? config?.serviceSlug;
  const pageType = input.landingPageType ?? config?.pageType;
  const regionKey = input.regionKey ?? config?.regionKey;

  if (input.category === "service" && serviceSlug) {
    const hub = topicHubLink(serviceSlug);
    if (hub) links.push(hub);
    links.push(...serviceDetailLinks(serviceSlug, input.path));
    links.push(...localLandingsForService(serviceSlug, undefined, 4));
    links.push(...conversionLinksForService(serviceSlug).slice(0, 2));
    return links;
  }

  if (input.category === "pillar") {
    const hub = getTopicHubConfig(input.slug);
    if (hub) {
      links.push(
        ...hub.relatedHubSlugs.map((slug) => {
          const related = getTopicHubConfig(slug);
          return {
            href: `/${slug}`,
            label: related?.title ?? slug,
          };
        }),
      );
      if (serviceSlug) {
        links.push({
          href: `/services/${hub.primaryServiceSlug}`,
          label: `${serviceLabels[hub.primaryServiceSlug] ?? hub.primaryServiceSlug} 업무`,
        });
      }
    }
    return links;
  }

  if (serviceSlug) {
    const hub = topicHubLink(serviceSlug);
    if (hub) links.push(hub);

    links.push({
      href: `/services/${serviceSlug}`,
      label: `${serviceLabels[serviceSlug] ?? serviceSlug} 업무 상세`,
    });

    links.push(...serviceDetailLinks(serviceSlug, `/services/${serviceSlug}`));

    if (pageType === "region-hub" && regionKey) {
      links.push(...regionLandingsForRegion(regionKey, input.slug, 6));
    } else if (pageType === "conversion") {
      links.push(...conversionLinksForService(serviceSlug, input.slug));
      links.push(...localLandingsForService(serviceSlug, input.slug, 3));
    } else if (pageType === "court-registry") {
      links.push(...courtLinksForService(serviceSlug, input.slug));
      links.push(...localLandingsForService(serviceSlug, input.slug, 3));
    } else if (regionKey) {
      links.push(...regionLandingsForRegion(regionKey, input.slug, 4));
      links.push(...localLandingsForService(serviceSlug, input.slug, 3));
    }

    links.push(...conversionLinksForService(serviceSlug, input.slug).slice(0, 2));
  }

  if (input.category === "blog" || input.category === "case" || input.category === "faq") {
    links.push({ href: "/services", label: "업무안내" });
    links.push({ href: "/faq", label: "FAQ" });
    links.push({ href: "/blog", label: "블로그 안내" });
  }

  return links;
}

export { toPageLink };
