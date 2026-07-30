import type { LocalLandingConfig } from "@/types/local-landing";
import { getAllBuildingSlugs } from "@/lib/building-intent/content";

export const buildingIntentLandingConfigs: LocalLandingConfig[] =
  getAllBuildingSlugs().map((slug) => ({
    slug,
    pageType: "building-intent" as const,
    keywordKey: slug,
    serviceSlug: "real-estate-registration",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대구", "센텀", "강서구", "사상구", "기장군", "부산진구"],
  }));
