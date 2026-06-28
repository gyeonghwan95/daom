import { getSeoEntityById } from "@/data/seo";
import { buildMetaDescription, buildMetaTitle } from "@/lib/pageData/seo";
import { createPageData, ensureMinContent } from "@/lib/pageData/template-helpers";
import type { PageData, PageRelatedLink } from "@/lib/pageData/types";
import { getServiceImage } from "@/lib/site-images";
import { getLawyerSlugLabel, resolveServiceSiteSlug } from "./labels";
import { buildSeoLandingContent } from "./content";
import type { SeoLandingSpec } from "./types";

function metaTitleForSeoLanding(spec: SeoLandingSpec): string {
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

function metaDescriptionFor(spec: SeoLandingSpec): string {
  const region = spec.regionLabel ?? "부산";
  const service = spec.serviceName ?? "법무사 업무";

  switch (spec.type) {
    case "region-lawyer":
      return buildMetaDescription(
        `${region} 상속등기·부동산등기·법인등기·개인회생 상담. 관할·서류·비용을 항목별로 안내합니다.`,
      );
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

  const page = createPageData({
    slug: spec.slug,
    path: spec.path,
    category: spec.category,
    title: spec.title,
    metaTitle: metaTitleForSeoLanding(spec),
    metaDescription: metaDescriptionFor(spec),
    h1: spec.h1,
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
    internalLinks: relatedLinksFor(spec),
    sections: content.sections,
    primaryKeywords: [...spec.keywords, "부산 법무사", "다옴법무사"],
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
