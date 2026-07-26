import type { LocalLandingConfig } from "@/types/local-landing";
import { getAllCounselSlugs } from "@/lib/counsel-intent/content";

export const counselIntentLandingConfigs: LocalLandingConfig[] =
  getAllCounselSlugs().map((slug) => ({
    slug,
    pageType: "counsel-intent" as const,
    keywordKey: slug,
    serviceSlug: "inheritance-registration",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대구", "센텀", "수영구", "연제구", "동래구"],
  }));
