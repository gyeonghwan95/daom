import { getAllDiagnosisSlugs } from "@/lib/diagnosis";
import { getAllLocalLandingSlugs } from "@/lib/local-landing";
import { NATIONWIDE_PAGE_SLUGS } from "@/lib/nationwide";
import { getAllSeoLandingSlugs } from "@/lib/seo-landing";
import { getAllTopicHubSlugs } from "@/lib/topic-hubs";
import { normalizeRouteSlug } from "@/lib/seo/slug";

/** 한글 랜딩·토픽 허브·SEO 자동 생성 slug */
export function getAllKoreanLandingSlugs(): string[] {
  const slugs = [
    ...getAllDiagnosisSlugs(),
    ...getAllLocalLandingSlugs(),
    ...getAllTopicHubSlugs(),
    ...getAllSeoLandingSlugs(),
    ...NATIONWIDE_PAGE_SLUGS,
    "강의이력",
    "업무사례",
  ];
  return [...new Set(slugs.map((slug) => normalizeRouteSlug(slug)))];
}
