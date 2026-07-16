import { mainNavigation } from "@/lib/navigation";
import { getAllLectureSlugs } from "@/lib/lectures";
import { getIndexablePageData } from "@/lib/pageData/sitemap";
import type { PageData } from "@/lib/pageData/types";
import { collectAliasesForPath } from "./aliases";
import {
  SEARCH_CATEGORY_LABELS,
  resolveSearchContentType,
} from "./categories";
import { FEATURED_PATHS } from "./popular-links";
import type { SearchIndexItem } from "./types";

function extractRegions(page: PageData): string[] {
  const regions = new Set<string>();
  const source = `${page.path} ${page.title} ${page.h1} ${page.primaryKeywords.join(" ")}`;

  const patterns = [
    "부산",
    "해운대",
    "센텀",
    "재송",
    "반여",
    "수영",
    "연제",
    "동래",
    "부산진",
    "서면",
    "사상",
    "사하",
    "금정",
    "북구",
    "남구",
    "중구",
    "동구",
    "영도",
    "강서",
    "명지",
    "기장",
    "정관",
    "울산",
    "창원",
    "김해",
    "양산",
  ];

  for (const region of patterns) {
    if (source.includes(region)) regions.add(region);
  }

  return [...regions];
}

function computePriority(
  page: PageData,
  contentType: SearchIndexItem["contentType"],
): number {
  let priority = 40;

  if (FEATURED_PATHS.has(page.path)) priority += 40;
  if (page.path === "/") priority += 20;

  switch (contentType) {
    case "menu":
    case "service":
      priority += 25;
      break;
    case "lecture":
    case "lectureHistory":
    case "diagnosis":
    case "special":
      priority += 22;
      break;
    case "cost":
    case "document":
    case "situation":
      priority += 18;
      break;
    case "region":
      priority += page.path.split("/").length <= 2 ? 16 : 8;
      break;
    case "faq":
    case "case":
    case "tool":
    case "glossary":
      priority += 12;
      break;
    case "blog":
      priority += 4;
      break;
    default:
      priority += 6;
  }

  if (page.category === "pillar" || page.category === "core") {
    priority += 10;
  }

  return Math.min(priority, 100);
}

function truncateDescription(text: string, max = 120): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trim()}…`;
}

function keywordsFromPage(page: PageData): string[] {
  const keywords = new Set<string>();

  for (const keyword of page.primaryKeywords.slice(0, 12)) {
    const value = keyword.trim();
    if (value) keywords.add(value);
  }

  const slugWords = page.slug
    .replace(/[-_]/g, " ")
    .split(/(?=[A-Z])|[\s]+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2);

  for (const word of slugWords.slice(0, 6)) {
    keywords.add(word);
  }

  return [...keywords].slice(0, 16);
}

function pageToSearchItem(
  page: PageData,
  lectureSlugs: Set<string>,
): SearchIndexItem | null {
  if (!page.path || !page.title) return null;

  const contentType = resolveSearchContentType({
    path: page.path,
    slug: page.slug,
    category: page.category,
    title: page.title,
    lectureSlugs,
  });

  const aliases = collectAliasesForPath(page.path, page.slug);
  const description = truncateDescription(
    page.metaDescription || page.intro || page.h1,
  );

  return {
    id: page.path,
    title: page.h1 || page.title,
    description,
    href: page.path,
    category: contentType,
    categoryLabel: SEARCH_CATEGORY_LABELS[contentType],
    keywords: keywordsFromPage(page),
    aliases: aliases.length > 0 ? aliases : undefined,
    region: extractRegions(page),
    contentType,
    priority: computePriority(page, contentType),
    isFeatured: FEATURED_PATHS.has(page.path),
  };
}

function buildMenuItems(): SearchIndexItem[] {
  return mainNavigation.map((item, index) => ({
    id: `menu:${item.href}`,
    title: item.label,
    description: `${item.label} 메뉴로 이동합니다.`,
    href: item.href,
    category: "menu" as const,
    categoryLabel: SEARCH_CATEGORY_LABELS.menu,
    keywords: [item.label, "메뉴", "바로가기"],
    aliases: [item.label],
    contentType: "menu" as const,
    priority: 90 - index,
    isFeatured: true,
  }));
}

function mergeByHref(items: SearchIndexItem[]): SearchIndexItem[] {
  const map = new Map<string, SearchIndexItem>();

  for (const item of items) {
    const existing = map.get(item.href);
    if (!existing) {
      map.set(item.href, item);
      continue;
    }

    const keywords = new Set([
      ...existing.keywords,
      ...item.keywords,
    ]);
    const aliases = new Set([
      ...(existing.aliases ?? []),
      ...(item.aliases ?? []),
    ]);
    const region = new Set([
      ...(existing.region ?? []),
      ...(item.region ?? []),
    ]);

    const preferIncomingTitle =
      !existing.isFeatured &&
      ((item.priority ?? 0) > (existing.priority ?? 0) ||
        item.title.length < existing.title.length);

    map.set(item.href, {
      ...existing,
      title: preferIncomingTitle ? item.title : existing.title,
      description: existing.description || item.description,
      keywords: [...keywords].slice(0, 20),
      aliases: aliases.size > 0 ? [...aliases] : undefined,
      region: region.size > 0 ? [...region] : undefined,
      priority: Math.max(existing.priority ?? 0, item.priority ?? 0),
      isFeatured: Boolean(existing.isFeatured || item.isFeatured),
      category:
        existing.category === "menu" ? existing.category : item.category,
      categoryLabel:
        existing.category === "menu"
          ? existing.categoryLabel
          : item.categoryLabel,
      contentType:
        existing.contentType === "menu"
          ? existing.contentType
          : item.contentType,
    });
  }

  return [...map.values()].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0) || a.title.localeCompare(b.title, "ko"),
  );
}

/** PageData·메뉴에서 슬림 검색 인덱스 생성 */
export function buildSearchIndex(): SearchIndexItem[] {
  const lectureSlugs = new Set(getAllLectureSlugs());
  const pages = getIndexablePageData()
    .map((page) => pageToSearchItem(page, lectureSlugs))
    .filter((item): item is SearchIndexItem => item !== null);

  return mergeByHref([...buildMenuItems(), ...pages]);
}

export function getSearchIndexStats(items: SearchIndexItem[]) {
  const byCategory = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: items.length,
    featured: items.filter((item) => item.isFeatured).length,
    byCategory,
  };
}
