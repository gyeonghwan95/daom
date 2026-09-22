/**
 * 페이지 1:1 썸네일 리졸버 — page-thumbnails manifest 단일 출처.
 */

import {
  getPageThumbnail,
  getRelatedPageThumbnails,
  PAGE_THUMBNAILS,
  type PageThumbnailItem,
} from "@/data/seo/page-thumbnails";
import { encodePublicSrc } from "@/lib/encode-public-src";
import type { SeoCarouselItem } from "@/lib/seo/carousel-images";

export type ThumbnailCardItem = SeoCarouselItem & {
  categoryLabel?: string;
};

export function toThumbnailCardItem(
  item: PageThumbnailItem,
): ThumbnailCardItem {
  return {
    id: item.url,
    title: item.pageTitle,
    href: item.url,
    image: encodePublicSrc(item.output),
    imageAlt: item.alt,
    category: item.category,
    categoryLabel: item.category,
  };
}

export function resolvePageThumbnailSrc(
  url: string,
): string | undefined {
  const item = getPageThumbnail(url);
  return item ? encodePublicSrc(item.output) : undefined;
}

/** 현재 페이지 기준 관련 썸네일 캐러셀 (6~10) */
export function getRelatedThumbnailCarousel(
  currentUrl: string,
  limit = 8,
): { heading: string; items: ThumbnailCardItem[] } | null {
  const current = getPageThumbnail(currentUrl);
  const related = getRelatedPageThumbnails(currentUrl, limit);
  if (related.length < 4) return null;

  return {
    heading:
      current?.carouselSectionTitle ??
      related.find((r) => r.carouselSectionTitle)?.carouselSectionTitle ??
      "함께 확인할 업무",
    items: related.map(toThumbnailCardItem),
  };
}

/** URL 목록에 매핑되는 썸네일만 캐러셀로 (관련 링크 대체용) */
export function getThumbnailCarouselForUrls(
  urls: string[],
  heading: string,
  excludeUrl?: string,
  limit = 8,
): { heading: string; items: ThumbnailCardItem[] } | null {
  const seen = new Set<string>();
  const items: ThumbnailCardItem[] = [];
  for (const url of urls) {
    if (excludeUrl && url === excludeUrl) continue;
    if (seen.has(url)) continue;
    const thumb = getPageThumbnail(url);
    if (!thumb) continue;
    seen.add(url);
    items.push(toThumbnailCardItem(thumb));
    if (items.length >= limit) break;
  }
  if (items.length < 4) return null;
  return { heading, items };
}

export function summarizePageThumbnails() {
  return {
    total: PAGE_THUMBNAILS.length,
    byCategory: PAGE_THUMBNAILS.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + 1;
      return acc;
    }, {}),
  };
}
