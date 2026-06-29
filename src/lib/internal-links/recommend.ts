import "server-only";

import type { PageRelatedLink } from "@/lib/pageData/types";
import { getLinkCatalog } from "./catalog";
import { rankCatalogItems } from "./score";
import {
  MAX_LINKS_PER_GROUP,
  RECOMMENDATION_GROUP_ORDER,
  type LinkContentKind,
  type RecommendationGroupKey,
  type RecommendationGroups,
  type RecommendationSource,
} from "./types";

export { hasRecommendationGroups } from "./groups";
export { flattenRecommendationGroups } from "./groups";

const KIND_TO_GROUP: Record<LinkContentKind, RecommendationGroupKey> = {
  diagnosis: "diagnosis",
  case: "cases",
  faq: "faqs",
  glossary: "glossary",
  service: "services",
  blog: "blogs",
  situation: "situations",
  tool: "tools",
};

function toLink(item: { href: string; label: string }): PageRelatedLink {
  return { href: item.href, label: item.label };
}

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

export function recommendInternalLinks(
  source: RecommendationSource,
  options: { maxPerGroup?: number } = {},
): RecommendationGroups {
  const maxPerGroup = options.maxPerGroup ?? MAX_LINKS_PER_GROUP;
  const ranked = rankCatalogItems(source, getLinkCatalog());
  const groups: RecommendationGroups = {};

  for (const { item } of ranked) {
    const groupKey = KIND_TO_GROUP[item.kind];
    const current = groups[groupKey] ?? [];
    if (current.length >= maxPerGroup) continue;
    groups[groupKey] = [...current, toLink(item)];
  }

  for (const key of RECOMMENDATION_GROUP_ORDER) {
    const links = groups[key];
    if (!links?.length) {
      delete groups[key];
      continue;
    }
    groups[key] = dedupeLinks(links).slice(0, maxPerGroup);
  }

  return groups;
}
