/**
 * 전체 PageData → page-inventory.json 생성
 * 기존 URL을 변경하지 않으며, 분석·우선순위만 산출한다.
 *
 * Usage: npx tsx scripts/generate-page-image-inventory.ts
 */

import { mkdirSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { getAllPageData } from "../src/lib/pageData/registry";
import { isIndexablePagePath } from "../src/lib/pageData/sitemap";
import { getCoverImageForPageData } from "../src/lib/pageData/cover-image";
import { getCanonicalUrl } from "../src/lib/seo/metadata";
import { mainNavigation, lectureNavGroups } from "../src/lib/navigation";
import { PAGE_IMAGE_MANIFEST } from "../src/data/seo/page-image-manifest";
import type {
  ImagePriority,
  PageInventoryItem,
  PageTypeTag,
  RecommendedImageAction,
} from "../src/data/seo/page-image-types";

const OUT_DIR = path.join(process.cwd(), "src", "generated");
const PUBLIC_IMAGE_DIR = path.join(process.cwd(), "public", "image");

const TIER1 = new Set([
  "/",
  "/contact",
  "/contact/inquiry",
  "/services",
  "/services/inheritance-registration",
  "/services/inheritance-renunciation",
  "/services/qualified-acceptance",
  "/services/real-estate-registration",
  "/services/corporate-registration",
  "/부산법무사",
  "/부산상속등기",
  "/해운대법무사",
  "/전국업무",
  "/전국상속등기",
  "/업무사례",
]);

function collectMenuUrls(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const add = (href: string, loc: string) => {
    const list = map.get(href) ?? [];
    if (!list.includes(loc)) list.push(loc);
    map.set(href, list);
  };
  for (const item of mainNavigation) {
    add(item.href, `header:${item.label}`);
    for (const g of item.groups ?? []) {
      for (const link of g.links) add(link.href, `header:${item.label}/${g.title}`);
    }
  }
  for (const g of lectureNavGroups) {
    for (const link of g.links) add(link.href, `header:강의·특강/${g.title}`);
  }
  return map;
}

function classifyPageType(url: string, category: string): PageTypeTag {
  if (url === "/") return "primary-hub";
  if (url === "/about") return "profile";
  if (url === "/office" || url === "/location") return "office-info";
  if (url === "/contact" || url.startsWith("/contact/")) return "contact";
  if (url === "/services") return "service-hub";
  if (url.startsWith("/services/cases/")) return "case-detail";
  if (url.startsWith("/services/")) return "service-detail";
  if (url === "/cases" || url === "/업무사례") return "case-list";
  if (url.startsWith("/업무사례/")) return "case-detail";
  if (url === "/situations") return "situation-hub";
  if (url.startsWith("/situations/")) return "situation-detail";
  if (url === "/faq" || url.startsWith("/faq/")) return "faq";
  if (url === "/자가진단" || category === "diagnosis") return "diagnosis";
  if (url === "/tools" || url.startsWith("/tools/")) return "calculator";
  if (url === "/glossary" || url.startsWith("/glossary/")) return "glossary";
  if (url === "/법률강의" || url === "/강의이력") return "lecture-hub";
  if (url.includes("강의") || url.includes("교육") || url.includes("특강") || url === "/강사소개")
    return "lecture-topic";
  if (url === "/협업문의" || url.startsWith("/협업") || category === "business")
    return "collaboration";
  if (url.includes("공공기관") || url.includes("보존등기")) return "public-institution";
  if (url.startsWith("/blog")) return "blog-link";
  if (url === "/search" || url === "/admin") return "utility";
  if (
    url.includes("부산") ||
    url.includes("해운대") ||
    url.includes("전국") ||
    category === "local" ||
    category === "realEstate"
  ) {
    if (url === "/부산법무사" || url === "/해운대법무사" || url === "/전국업무")
      return "region-hub";
    return "region-detail";
  }
  if (url === "/상담" || url.endsWith("상담")) return "primary-hub";
  return "other";
}

function scoreTraffic(url: string, indexed: boolean, inMenu: boolean): number {
  let s = indexed ? 40 : 5;
  if (TIER1.has(url)) s += 35;
  if (inMenu) s += 15;
  if (url.startsWith("/services/")) s += 10;
  if (url.includes("부산") || url.includes("해운대")) s += 8;
  if (url.startsWith("/blog") || url.startsWith("/glossary/")) s -= 10;
  return Math.max(0, Math.min(100, s));
}

function scoreConversion(url: string, pageType: PageTypeTag): number {
  let s = 20;
  if (pageType === "service-detail" || pageType === "contact") s += 40;
  if (pageType === "diagnosis" || pageType === "situation-detail") s += 30;
  if (pageType === "region-detail") s += 25;
  if (url.includes("상담") || url.includes("문의")) s += 20;
  if (pageType === "utility" || pageType === "blog-link") s -= 15;
  return Math.max(0, Math.min(100, s));
}

function scoreCarousel(pageType: PageTypeTag, url: string): number {
  if (pageType === "service-hub" || pageType === "lecture-hub") return 80;
  if (pageType === "service-detail" && url.startsWith("/services/")) return 70;
  if (pageType === "region-hub") return 50;
  return 10;
}

function priorityFromScores(
  traffic: number,
  conversion: number,
  carousel: number,
  dupCount: number,
  pageType: PageTypeTag,
  url: string,
): ImagePriority {
  if (pageType === "utility") return "none";
  if (url === "/search" || url === "/admin" || url.startsWith("/blog/external")) {
    return "none";
  }
  if (TIER1.has(url)) return "critical";
  if (traffic >= 70 && (conversion >= 50 || dupCount >= 8)) return "critical";
  if (traffic >= 55 && conversion >= 40) return "high";
  if (traffic >= 40) return "medium";
  if (
    pageType === "faq" ||
    pageType === "glossary" ||
    pageType === "calculator"
  ) {
    return "low";
  }
  void carousel;
  return "low";
}

function actionFor(
  priority: ImagePriority,
  dupCount: number,
  pageType: PageTypeTag,
): RecommendedImageAction {
  if (priority === "none" || pageType === "utility") return "no-image-needed";
  if (priority === "critical" || priority === "high") return "create-image";
  if (priority === "medium" && dupCount >= 100) return "replace-image";
  if (priority === "medium") return "reuse-existing";
  if (dupCount >= 100) return "replace-image";
  return "keep-current";
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const menuMap = collectMenuUrls();
  const pages = getAllPageData();

  const ogUsage = new Map<string, number>();
  const covers = new Map<string, string>();
  for (const page of pages) {
    try {
      const cover = getCoverImageForPageData(page);
      const key = decodeURIComponent(cover.src);
      covers.set(page.path, key);
      ogUsage.set(key, (ogUsage.get(key) ?? 0) + 1);
    } catch {
      covers.set(page.path, "(error)");
    }
  }

  const inventory: PageInventoryItem[] = pages.map((page) => {
    const url = page.path;
    const pageType = classifyPageType(url, page.category);
    const indexed = isIndexablePagePath(url);
    const menuLocation = menuMap.get(url);
    const currentOgImage = covers.get(url);
    const imageDuplicateCount = currentOgImage
      ? ogUsage.get(currentOgImage) ?? 0
      : 0;
    const trafficPriority = scoreTraffic(url, indexed, Boolean(menuLocation));
    const conversionPriority = scoreConversion(url, pageType);
    const carouselPotential = scoreCarousel(pageType, url);
    let imagePriority = priorityFromScores(
      trafficPriority,
      conversionPriority,
      carouselPotential,
      imageDuplicateCount,
      pageType,
      url,
    );
    if (url === "/search" || url === "/admin" || url.startsWith("/blog/external"))
      imagePriority = "none";

    return {
      url,
      title: page.h1 || page.title,
      pageType,
      primaryKeyword: page.primaryKeywords?.[0],
      secondaryKeywords: page.primaryKeywords?.slice(1, 4),
      menuLocation,
      isIndexed: indexed,
      isInSitemap: indexed,
      canonical: getCanonicalUrl(url),
      currentOgImage,
      currentBodyImage: currentOgImage,
      imageDuplicateCount,
      trafficPriority,
      conversionPriority,
      carouselPotential,
      imagePriority,
      recommendedAction: actionFor(imagePriority, imageDuplicateCount, pageType),
    };
  });

  const byPriority: Record<string, number> = {};
  const byAction: Record<string, number> = {};
  for (const item of inventory) {
    byPriority[item.imagePriority] = (byPriority[item.imagePriority] ?? 0) + 1;
    byAction[item.recommendedAction] =
      (byAction[item.recommendedAction] ?? 0) + 1;
  }

  const topDup = [...ogUsage.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([src, count]) => ({ src, count }));

  const publicImages = existsSync(PUBLIC_IMAGE_DIR)
    ? readdirSync(PUBLIC_IMAGE_DIR).filter((f) => !f.startsWith("."))
    : [];

  const summary = {
    generatedAt: new Date().toISOString(),
    totalPages: inventory.length,
    indexablePages: inventory.filter((i) => i.isIndexed).length,
    menuLinkedPages: inventory.filter((i) => (i.menuLocation?.length ?? 0) > 0)
      .length,
    publicImageCount: publicImages.length,
    ogImageMissing: inventory.filter((i) => !i.currentOgImage).length,
    byPriority,
    byAction,
    topDuplicateImages: topDup,
    manifestWave1Count: PAGE_IMAGE_MANIFEST.length,
    criticalSample: inventory
      .filter((i) => i.imagePriority === "critical")
      .slice(0, 40)
      .map((i) => ({
        url: i.url,
        title: i.title,
        dup: i.imageDuplicateCount,
        og: i.currentOgImage,
        action: i.recommendedAction,
      })),
  };

  writeFileSync(
    path.join(OUT_DIR, "page-inventory-summary.json"),
    JSON.stringify(summary, null, 2),
    "utf8",
  );
  writeFileSync(
    path.join(OUT_DIR, "page-inventory.json"),
    JSON.stringify(inventory),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        totalPages: summary.totalPages,
        indexable: summary.indexablePages,
        byPriority: summary.byPriority,
        topDup: summary.topDuplicateImages.slice(0, 8),
        wave1: summary.manifestWave1Count,
      },
      null,
      2,
    ),
  );
}

main();
