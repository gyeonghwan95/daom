import "server-only";

import {
  categoriesMatch,
  normalizeTag,
  regionsMatch,
} from "./domains";
import {
  collectSourceDomains,
  collectSourceServiceSlugs,
} from "./catalog";
import type { ContentRelations } from "@/types/content-relations";
import type { LinkCatalogItem, LinkContentKind, RecommendationSource } from "./types";

type RelationField = keyof Pick<
  ContentRelations,
  | "relatedServices"
  | "relatedSituations"
  | "relatedFaqs"
  | "relatedCases"
  | "relatedTools"
  | "relatedGlossary"
  | "relatedDiagnosis"
  | "relatedBlogs"
>;

const EXPLICIT_SCORE = 120;
const REVERSE_SCORE = 90;
const TAG_SCORE = 22;
const CATEGORY_SCORE = 18;
const SERVICE_SCORE = 16;
const REGION_SCORE = 12;

function includesSlug(list: string[] | undefined, slug: string): boolean {
  if (!list?.length) return false;
  const key = slug.normalize("NFC");
  return list.some((item) => item.normalize("NFC") === key);
}

function relationKindField(kind: LinkContentKind): RelationField {
  switch (kind) {
    case "service":
      return "relatedServices";
    case "situation":
      return "relatedSituations";
    case "faq":
      return "relatedFaqs";
    case "case":
      return "relatedCases";
    case "tool":
      return "relatedTools";
    case "glossary":
      return "relatedGlossary";
    case "diagnosis":
      return "relatedDiagnosis";
    case "blog":
      return "relatedBlogs";
    default:
      return "relatedServices";
  }
}

function hasExplicitRelation(
  source: RecommendationSource,
  target: LinkCatalogItem,
): boolean {
  const field = relationKindField(target.kind);
  const list = source[field];
  return includesSlug(list, target.slug);
}

function hasReverseRelation(
  source: RecommendationSource,
  target: LinkCatalogItem,
): boolean {
  const field = relationKindField(source.kind);
  const list = target[field];
  return includesSlug(list, source.slug);
}

function countTagOverlap(
  sourceTags: string[] | undefined,
  targetTags: string[] | undefined,
): number {
  if (!sourceTags?.length || !targetTags?.length) return 0;
  const normalized = new Set(sourceTags.map(normalizeTag));
  return targetTags.reduce(
    (count, tag) => (normalized.has(normalizeTag(tag)) ? count + 1 : count),
    0,
  );
}

function sharesServiceDomain(
  source: RecommendationSource,
  target: LinkCatalogItem,
): boolean {
  const sourceSlugs = collectSourceServiceSlugs(source);
  const targetSlugs = collectSourceServiceSlugs(target);
  if (sourceSlugs.some((slug) => targetSlugs.includes(slug))) return true;

  const sourceDomains = collectSourceDomains(source);
  const targetDomains = collectSourceDomains(target);
  return sourceDomains.some((domain) => targetDomains.includes(domain));
}

export function scoreCatalogItem(
  source: RecommendationSource,
  target: LinkCatalogItem,
): number {
  if (source.path === target.href) return -1;
  if (source.kind === target.kind && source.slug === target.slug) return -1;

  let score = 0;

  if (hasExplicitRelation(source, target)) score += EXPLICIT_SCORE;
  if (hasReverseRelation(source, target)) score += REVERSE_SCORE;

  const tagOverlap = countTagOverlap(source.tags, target.tags);
  score += tagOverlap * TAG_SCORE;

  if (categoriesMatch(source.category, target.category)) {
    score += CATEGORY_SCORE;
  } else if (sharesServiceDomain(source, target)) {
    score += SERVICE_SCORE;
  }

  if (regionsMatch(source.region, target.region)) {
    score += REGION_SCORE;
  }

  return score;
}

export function rankCatalogItems(
  source: RecommendationSource,
  items: LinkCatalogItem[],
): Array<{ item: LinkCatalogItem; score: number }> {
  return items
    .map((item) => ({ item, score: scoreCatalogItem(source, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label, "ko"));
}
