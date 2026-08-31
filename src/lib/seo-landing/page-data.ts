import { getSeoEntityById } from "@/data/seo";
import { getLocalChampionOverlay } from "@/data/seo/local-champion-overlays";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData, ensureMinContent } from "@/lib/pageData/template-helpers";
import type { PageData, PageRelatedLink } from "@/lib/pageData/types";
import { buildStationSectionsForHost } from "@/lib/seo/station-sections";
import { getServiceImage } from "@/lib/site-images";
import { getLawyerSlugLabel, resolveServiceSiteSlug } from "./labels";
import { buildSeoLandingContent } from "./content";
import type { SeoLandingSpec } from "./types";

function metaTitleForSeoLanding(
  spec: SeoLandingSpec,
  overlay?: ReturnType<typeof getLocalChampionOverlay>,
): string {
  if (overlay?.metaTitle) return overlay.metaTitle;
  if (spec.slug === "등기소근처법무사") {
    return "등기소 근처 법무사 | 관할·위치 확인 - 다옴법무사사무소";
  }
  if (spec.slug === "기장법무사") {
    return "기장읍 생활권 법무사 | 기장 해안·주택 등기";
  }
  switch (spec.type) {
    case "institution-lawyer":
      return buildMetaTitle(
        `${spec.institutionShortName ?? spec.institutionName} 법무사 상담`,
      );
    case "institution-service":
      return buildMetaTitle(
        `${spec.institutionShortName ?? spec.institutionName} ${spec.serviceName} 절차`,
      );
    case "service-intent":
      return buildMetaTitle(`${spec.serviceName} ${spec.intentSuffix} 안내`);
    default:
      return buildMetaTitle(spec.h1);
  }
}

function metaDescriptionFor(
  spec: SeoLandingSpec,
  overlay?: ReturnType<typeof getLocalChampionOverlay>,
): string {
  if (overlay?.metaDescription) return overlay.metaDescription;
  const region = spec.regionLabel ?? "부산";
  const service = spec.serviceName ?? "법무사 업무";

  if (spec.slug === "기장법무사") {
    return buildMetaDescription(
      "기장읍 해안·주택 상속·매매 등기 상담. 군 전체는 기장군 법무사 안내, 정관·일광은 각 생활권 페이지에서 이어집니다.",
    );
  }

  switch (spec.type) {
    case "region-lawyer": {
      const regionEntity = spec.regionId ? getSeoEntityById(spec.regionId) : undefined;
      const localAngle = regionEntity?.description
        ? regionEntity.description.replace(/\s+/g, " ").slice(0, 42)
        : `${region} 생활권 상속·등기`;
      return buildMetaDescription(
        `${region} 법무사 상담. ${localAngle} 다옴법무사사무소는 해운대 센텀에서 직접 상담합니다.`,
      );
    }
    case "region-service":
      return buildMetaDescription(
        `${region} ${service} 절차·필요서류·비용·관할 등기소 안내. 해운대·센텀 다옴법무사사무소에서 상담 가능합니다.`,
      );
    case "service-intent":
      return buildMetaDescription(
        `${service} ${spec.intentSuffix} 정리. 사건별 준비 서류·기한·수임료 범위를 투명하게 설명드립니다.`,
      );
    case "institution-lawyer":
      return buildMetaDescription(
        `${spec.institutionName} 인근 법무사 상담. 접수 전 서류·관할·일정을 정리해 드립니다.`,
      );
    case "institution-service":
      return buildMetaDescription(
        `${spec.institutionShortName} ${service} 안내. 관할·제출 서류·접수 절차를 사건별로 설명합니다.`,
      );
    case "special":
      if (spec.slug === "등기소근처법무사") {
        return "등기소 근처 법무사 안내. 관할 등기소·전자등기·방문 필요 여부를 정리합니다. 등기업무 종류는 부산 등기 법무사 페이지에서 이어집니다.";
      }
      return buildMetaDescription(
        `${spec.title} 관련 절차·비용·서류 안내. 부산 전역 사건 상담, 전화·카카오톡 문의 가능합니다.`,
      );
    default:
      return buildMetaDescription(`${spec.title} 안내`);
  }
}

function relatedLinksFor(spec: SeoLandingSpec): PageRelatedLink[] {
  const links: PageRelatedLink[] = [];

  const siteSlug = resolveServiceSiteSlug(spec.serviceId ?? "");
  if (siteSlug) {
    links.push({
      href: `/services/${siteSlug}`,
      label: `${spec.serviceName ?? "업무"} 상세`,
    });
  }

  if (spec.regionId) {
    const region = getSeoEntityById(spec.regionId);
    if (region && region.type === "district") {
      const label = getLawyerSlugLabel(region);
      const lawyerSlug = `${label}법무사`;
      links.push({ href: `/${lawyerSlug}`, label: `${label} 법무사` });
    }
  }

  links.push(
    { href: "/services", label: "업무안내" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "상담 문의" },
  );

  return links;
}

function mapLandingPageType(spec: SeoLandingSpec) {
  if (spec.type === "region-lawyer" && spec.isHub) return "region-hub" as const;
  if (spec.type === "region-service") return "service-region" as const;
  if (spec.category === "cost") return "conversion" as const;
  if (spec.category === "court") return "court-registry" as const;
  if (spec.category === "businessDistrict") return "business-zone" as const;
  if (spec.category === "realEstate") return "real-estate-dev" as const;
  return "service-region" as const;
}

export function buildPageDataFromSeoLanding(spec: SeoLandingSpec): PageData {
  const content = buildSeoLandingContent(spec);
  const siteSlug = resolveServiceSiteSlug(spec.serviceId ?? "");
  const overlay = getLocalChampionOverlay(spec.regionId, spec.slug);
  const overlayMeta =
    overlay && overlay.slug === spec.slug ? overlay : undefined;
  const stationSections = buildStationSectionsForHost(spec.path);
  const sections = [
    ...stationSections.map((s) => ({
      title: s.title,
      body: s.body,
      items: s.items,
      links: s.links,
    })),
    ...content.sections,
  ];

  const internalLinks = relatedLinksFor(spec);
  if (overlay?.serviceLinks) {
    for (const link of overlay.serviceLinks) {
      if (!internalLinks.some((l) => l.href === link.href)) {
        internalLinks.unshift(link);
      }
    }
  }

  if (spec.slug === "등기소근처법무사") {
    if (!internalLinks.some((l) => l.href === "/부산등기법무사")) {
      internalLinks.unshift({
        href: "/부산등기법무사",
        label: "부산 등기 법무사 안내",
      });
    }
  }

  // exact 「부산 법무사」는 HOME(`/`)만 — thin SEO 랜딩 meta keywords에 도배하지 않음
  const primaryKeywords = [
    ...new Set(
      [...spec.keywords, "다옴법무사사무소"].filter(
        (k) => k !== "부산 법무사" && k !== "부산법무사",
      ),
    ),
  ].slice(0, 8);

  const page = createPageData({
    slug: spec.slug,
    path: spec.path,
    category: spec.category,
    title:
      spec.slug === "기장법무사"
        ? "기장읍 생활권 법무사"
        : spec.title,
    metaTitle: metaTitleForSeoLanding(spec, overlayMeta),
    metaDescription: metaDescriptionFor(spec, overlayMeta),
    h1:
      overlayMeta?.h1 ??
      (spec.slug === "등기소근처법무사"
        ? "등기소 근처 법무사를 찾을 때 먼저 확인할 것"
        : spec.slug === "기장법무사"
          ? "기장읍·기장 해안에서 법무사 상담이 필요할 때"
          : spec.h1),
    intro: content.intro,
    breadcrumbs: [
      { label: "홈", href: "/" },
      { label: spec.title },
    ],
    introParagraphs: content.introParagraphs,
    procedures: content.procedures,
    documents: content.documents,
    consultationPoints: content.consultationPoints,
    faqs: content.faqs,
    consultationExample: content.consultationExample,
    internalLinks,
    sections,
    primaryKeywords,
    ogImage: getServiceImage(siteSlug ?? "inheritance-registration").src,
    serviceSlug: siteSlug,
    landingPageType: mapLandingPageType(spec),
    regionKey: spec.regionKey,
    seoLandingType: spec.type,
    intentSuffix: spec.intentSuffix,
    includeFaqSchema: true,
  });

  return ensureMinContent(page, content.minContentLength);
}
