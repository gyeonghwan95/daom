import type { LocalLandingConfig } from "@/types/local-landing";
import { getAllBusinessSlugs } from "@/lib/business/content";

const serviceBySlug: Record<string, string> = {
  부산기업법률자문: "corporate-registration",
  부산기업채권관리: "corporate-registration",
  부산기업부동산등기: "real-estate-registration",
  기업업무문의: "corporate-registration",
};

export const businessLandingConfigs: LocalLandingConfig[] =
  getAllBusinessSlugs().map((slug) => ({
    slug,
    pageType: "business" as const,
    keywordKey: slug,
    serviceSlug: serviceBySlug[slug] ?? "corporate-registration",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대구", "센텀", "연제구", "수영구", "사상구", "강서구"],
  }));
