import type { LocalLandingConfig } from "@/types/local-landing";
import { getAllCorporateSlugs } from "@/lib/corporate-intent/content";

export const corporateIntentLandingConfigs: LocalLandingConfig[] =
  getAllCorporateSlugs().map((slug) => ({
    slug,
    pageType: "corporate-intent" as const,
    keywordKey: slug,
    serviceSlug:
      slug === "부산유상증자등기"
        ? "corporate-registration"
        : slug === "부산법인해산청산등기"
          ? "corporate-registration"
          : slug.includes("임원") || slug.includes("대표")
            ? "director-change"
            : slug === "법인변경등기"
              ? "corporate-registration"
              : "corporate-registration",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대구", "센텀", "수영구", "연제구", "동래구", "부산진구"],
  }));
