import type { LocalLandingConfig } from "@/types/local-landing";
import { searchIntentSeeds } from "./search-intent/seeds";

/** 검색의도 SEO 랜딩 (기존 URL과 별도 slug만) */
export const searchIntentLandingConfigs: LocalLandingConfig[] =
  searchIntentSeeds.map((seed) => ({
    slug: seed.slug,
    pageType: "search-intent" as const,
    keywordKey: seed.slug,
    serviceSlug: seed.serviceSlug,
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대구", "센텀", "연제구"],
    relatedCaseSlug: seed.caseHref
      ?.replace(/^\/services\/cases\//, "")
      .replace(/^\//, ""),
  }));
