import type { LocalLandingConfig } from "@/types/local-landing";
import { CONSULT_LANDINGS } from "@/lib/consult-wizard/landings";

export const consultLandingConfigs: LocalLandingConfig[] = CONSULT_LANDINGS.map(
  (page) => ({
    slug: page.slug,
    pageType: "consult-landing" as const,
    keywordKey: page.slug,
    serviceSlug: page.serviceSlug,
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대구", "센텀"],
  }),
);
