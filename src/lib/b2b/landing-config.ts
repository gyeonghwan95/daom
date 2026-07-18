import type { LocalLandingConfig } from "@/types/local-landing";
import { B2B_PAGE_SLUGS } from "@/lib/b2b";

const serviceBySlug: Record<string, string> = {
  partners: "real-estate-registration",
  부산법무사복대리: "real-estate-registration",
  부산부동산협력법무사: "ownership-transfer",
  협업문의: "real-estate-registration",
  부산부동산등기복대리: "real-estate-registration",
  부산법인등기복대리: "corporate-registration",
  부산등기접수협업: "real-estate-registration",
  부산등기보정업무: "real-estate-registration",
  부산등기소현지업무: "real-estate-registration",
  부산원거리등기협업: "real-estate-registration",
  부산잔금등기협업: "ownership-transfer",
  부산건축사등기협업: "real-estate-registration",
  부산시행사등기: "real-estate-registration",
  부산건설사등기: "real-estate-registration",
  부산분양등기: "ownership-transfer",
  부산법인등기아웃소싱: "corporate-registration",
};

export const b2bLandingConfigs: LocalLandingConfig[] = B2B_PAGE_SLUGS.map(
  (slug) => ({
    slug,
    pageType: "b2b-collaboration" as const,
    keywordKey: slug,
    serviceSlug: serviceBySlug[slug] ?? "real-estate-registration",
    regionKey: "busan",
    regionLabel: "부산",
    neighborhoods: ["해운대구", "센텀", "수영구", "연제구"],
  }),
);
