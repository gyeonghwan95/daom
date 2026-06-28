import { CORE_HUBS, CORE_HUB_SLUGS, getCoreHubBySlug } from "./registry";
import type { HubLinkInput, HubTheme } from "./types";

const SERVICE_HUB: Record<string, string> = {
  "inheritance-registration": "부산상속등기",
  "inheritance-renunciation": "부산상속포기",
  "qualified-acceptance": "부산한정승인",
  "corporate-registration": "부산법인등기",
  "company-establishment": "부산법인등기",
  "director-change": "부산법인등기",
  "real-estate-registration": "부산부동산등기",
  "ownership-transfer": "부산부동산등기",
  "personal-rehabilitation": "부산개인회생",
  bankruptcy: "부산개인회생",
  "ship-registration": "부산선박등기",
  "redevelopment-registration": "부산재개발등기",
  "reconstruction-registration": "부산재개발등기",
};

const REGION_LAWYER_HUB: Record<string, string> = {
  busan: "부산법무사",
  haeundae: "해운대법무사",
  centum: "센텀법무사",
  jaesong: "재송동법무사",
  banyeo: "반여동법무사",
};

const INTENT_HUB: Record<string, string> = {
  비용: "부산법무사비용",
  보수표: "부산법무사비용",
  필요서류: "부산상속등기",
  준비서류: "부산상속등기",
  기간: "부산상속등기",
  기한: "부산상속등기",
  과태료: "부산법인등기",
};

export function isCoreHubSlug(slug: string): boolean {
  return CORE_HUB_SLUGS.has(slug);
}

export function resolveParentHubSlug(input: HubLinkInput): string {
  if (isCoreHubSlug(input.slug)) {
    return input.slug;
  }

  const hub = CORE_HUBS.find((h) =>
    h.spokes.some((spoke) => spoke.href === input.path || spoke.href === `/${input.slug}`),
  );
  if (hub) return hub.slug;

  if (input.slug.includes("여성법무사")) return "부산여성법무사";
  if (input.slug.includes("선박") || input.slug.includes("해운") || input.slug.includes("물류")) {
    return "부산선박등기";
  }
  if (input.slug.includes("산업단지") || input.slug.includes("녹산") || input.slug.includes("명례")) {
    return "명례산업단지법인등기";
  }
  if (input.slug.includes("재개발") || input.slug.includes("재건축")) {
    return "부산재개발등기";
  }
  if (
    input.landingPageType === "court-registry" ||
    input.slug.includes("법원") ||
    input.slug.includes("등기소") ||
    input.slug.includes("등기국")
  ) {
    return "부산지방법원등기국";
  }
  if (input.category === "cost" || input.intentSuffix === "비용" || input.intentSuffix === "보수표") {
    return "부산법무사비용";
  }

  if (input.serviceSlug && SERVICE_HUB[input.serviceSlug]) {
    return SERVICE_HUB[input.serviceSlug]!;
  }

  if (input.intentSuffix && INTENT_HUB[input.intentSuffix]) {
    const serviceHub = input.serviceSlug ? SERVICE_HUB[input.serviceSlug] : undefined;
    if (serviceHub) return serviceHub;
    return INTENT_HUB[input.intentSuffix]!;
  }

  if (input.landingPageType === "region-hub" && input.regionKey) {
    return REGION_LAWYER_HUB[input.regionKey] ?? "부산법무사";
  }

  if (input.seoLandingType === "region-lawyer" && input.regionKey) {
    return REGION_LAWYER_HUB[input.regionKey] ?? "부산법무사";
  }

  if (input.seoLandingType === "region-service" && input.serviceSlug) {
    return SERVICE_HUB[input.serviceSlug] ?? "부산법무사";
  }

  return "부산법무사";
}

export function resolvePageTheme(input: HubLinkInput): HubTheme {
  if (isCoreHubSlug(input.slug)) {
    return getCoreHubBySlug(input.slug)?.theme ?? "general";
  }
  if (input.slug.includes("여성")) return "female-lawyer";
  if (input.category === "cost" || input.intentSuffix === "비용" || input.intentSuffix === "보수표") {
    return "cost";
  }
  if (input.intentSuffix === "필요서류" || input.intentSuffix === "준비서류") return "documents";
  if (input.intentSuffix === "기간" || input.intentSuffix === "기한" || input.intentSuffix === "과태료") {
    return "period";
  }
  if (input.landingPageType === "court-registry" || input.category === "court") return "court";
  if (input.landingPageType === "business-zone" || input.slug.includes("산업단지")) return "industrial";
  if (input.slug.includes("선박") || input.slug.includes("해운")) return "maritime";
  if (input.landingPageType === "region-hub" || input.seoLandingType === "region-lawyer") {
    return "region-lawyer";
  }
  if (input.landingPageType === "service-region" || input.seoLandingType === "region-service") {
    return "region-service";
  }
  if (input.serviceSlug === "inheritance-registration") return "inheritance";
  if (["corporate-registration", "company-establishment", "director-change"].includes(input.serviceSlug ?? "")) {
    return "corporate";
  }
  if (["real-estate-registration", "ownership-transfer"].includes(input.serviceSlug ?? "")) {
    return "real-estate";
  }
  if (["personal-rehabilitation", "bankruptcy"].includes(input.serviceSlug ?? "")) {
    return "rehab";
  }
  return "general";
}
