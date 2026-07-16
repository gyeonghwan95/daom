import {
  compactSearchText,
  normalizeSearchText,
  tokenizeSearchQuery,
} from "./normalize";
import type { SearchCategoryFilter, SearchIndexItem, SearchResult } from "./types";
import { matchesSearchFilter } from "./categories";

function fieldBlob(item: SearchIndexItem): {
  title: string;
  titleCompact: string;
  aliases: string;
  aliasesCompact: string;
  keywords: string;
  keywordsCompact: string;
  description: string;
  descriptionCompact: string;
  category: string;
  region: string;
  regionCompact: string;
} {
  const aliases = (item.aliases ?? []).join(" ");
  const keywords = item.keywords.join(" ");
  const description = item.description ?? "";
  const region = (item.region ?? []).join(" ");

  return {
    title: normalizeSearchText(item.title),
    titleCompact: compactSearchText(item.title),
    aliases: normalizeSearchText(aliases),
    aliasesCompact: compactSearchText(aliases),
    keywords: normalizeSearchText(keywords),
    keywordsCompact: compactSearchText(keywords),
    description: normalizeSearchText(description),
    descriptionCompact: compactSearchText(description),
    category: normalizeSearchText(
      `${item.categoryLabel} ${item.category}`,
    ),
    region: normalizeSearchText(region),
    regionCompact: compactSearchText(region),
  };
}

function scoreTokenAgainstItem(
  token: string,
  compactToken: string,
  fields: ReturnType<typeof fieldBlob>,
): number {
  let score = 0;

  if (fields.title === token || fields.titleCompact === compactToken) {
    score += 120;
  } else if (
    fields.title.startsWith(token) ||
    fields.titleCompact.startsWith(compactToken)
  ) {
    score += 90;
  } else if (
    fields.title.includes(token) ||
    fields.titleCompact.includes(compactToken)
  ) {
    score += 70;
  }

  if (
    fields.aliases === token ||
    fields.aliasesCompact === compactToken ||
    fields.aliases.split(" ").includes(token)
  ) {
    score += 85;
  } else if (
    fields.aliases.includes(token) ||
    fields.aliasesCompact.includes(compactToken)
  ) {
    score += 55;
  }

  if (
    fields.keywords.includes(token) ||
    fields.keywordsCompact.includes(compactToken)
  ) {
    score += 40;
  }

  if (
    fields.description.includes(token) ||
    fields.descriptionCompact.includes(compactToken)
  ) {
    score += 18;
  }

  if (fields.category.includes(token)) {
    score += 12;
  }

  if (
    fields.region.includes(token) ||
    fields.regionCompact.includes(compactToken)
  ) {
    score += 28;
  }

  return score;
}

export function scoreSearchItem(
  item: SearchIndexItem,
  query: string,
): number {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return 0;

  const fields = fieldBlob(item);
  const compactQuery = compactSearchText(query);

  let score = 0;
  let matchedTokens = 0;

  for (const token of tokens) {
    const tokenScore = scoreTokenAgainstItem(
      token,
      compactSearchText(token),
      fields,
    );
    if (tokenScore > 0) {
      matchedTokens += 1;
      score += tokenScore;
    }
  }

  if (matchedTokens === 0) return 0;

  // 모든 토큰 일치 보너스
  if (matchedTokens === tokens.length) {
    score += 35 * tokens.length;
  } else {
    // 일부만 일치하면 감점
    score = Math.floor(score * (matchedTokens / tokens.length));
  }

  // 전체 쿼리 compact 일치
  if (
    fields.titleCompact === compactQuery ||
    fields.aliasesCompact.includes(compactQuery)
  ) {
    score += 50;
  }

  score += (item.priority ?? 0) * 0.35;
  if (item.isFeatured) score += 12;

  return score;
}

export type SearchSiteOptions = {
  limit?: number;
  filter?: SearchCategoryFilter;
};

export function searchSite(
  items: SearchIndexItem[],
  query: string,
  options: SearchSiteOptions = {},
): SearchResult[] {
  const limit = options.limit ?? 12;
  const filter = options.filter ?? "all";
  const normalized = normalizeSearchText(query);

  if (!normalized) return [];

  const results: SearchResult[] = [];

  for (const item of items) {
    if (!matchesSearchFilter(item.contentType, filter)) continue;
    const score = scoreSearchItem(item, normalized);
    if (score <= 0) continue;
    results.push({ ...item, score });
  }

  results.sort(
    (a, b) =>
      b.score - a.score ||
      (b.priority ?? 0) - (a.priority ?? 0) ||
      a.title.localeCompare(b.title, "ko"),
  );

  return results.slice(0, limit);
}

export function countSearchResults(
  items: SearchIndexItem[],
  query: string,
  filter: SearchCategoryFilter = "all",
): number {
  const normalized = normalizeSearchText(query);
  if (!normalized) return 0;

  let count = 0;
  for (const item of items) {
    if (!matchesSearchFilter(item.contentType, filter)) continue;
    if (scoreSearchItem(item, normalized) > 0) count += 1;
  }
  return count;
}
