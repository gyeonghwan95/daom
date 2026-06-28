import { getAllLocalLandingSlugs } from "@/lib/local-landing";
import { getAllSeoLandingSlugs } from "@/lib/seo-landing";
import { getAllTopicHubSlugs } from "@/lib/topic-hubs";
import { normalizeRouteSlug } from "@/lib/seo/slug";

/** 한글 랜딩·토픽 허브·SEO 자동 생성 slug */
export function getAllKoreanLandingSlugs(): string[] {
  const slugs = [
    ...getAllLocalLandingSlugs(),
    ...getAllTopicHubSlugs(),
    ...getAllSeoLandingSlugs(),
  ];
  return [...new Set(slugs.map((slug) => normalizeRouteSlug(slug)))];
}
