import type { PageRelatedLink } from "@/lib/pageData/types";
import {
  RECOMMENDATION_GROUP_ORDER,
  type RecommendationGroups,
} from "./types";

function dedupeLinks(links: PageRelatedLink[]): PageRelatedLink[] {
  const seen = new Set<string>();
  const result: PageRelatedLink[] = [];
  for (const link of links) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    result.push(link);
  }
  return result;
}

export function hasRecommendationGroups(groups: RecommendationGroups): boolean {
  return RECOMMENDATION_GROUP_ORDER.some((key) => (groups[key]?.length ?? 0) > 0);
}

export function flattenRecommendationGroups(
  groups: RecommendationGroups,
): PageRelatedLink[] {
  const links: PageRelatedLink[] = [];
  for (const key of RECOMMENDATION_GROUP_ORDER) {
    const group = groups[key];
    if (group?.length) links.push(...group);
  }
  return dedupeLinks(links);
}
