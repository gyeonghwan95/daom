/**
 * 페이지 visual 리졸버 — SERP JPG / card WebP / 관련 캐러셀.
 */

import {
  getPageVisual,
  getRelatedPageVisuals,
  PAGE_VISUALS,
  type PageVisual,
  type TextPosition,
} from "@/data/seo/page-visuals";
import { getCarouselManifestItemByUrl } from "@/data/seo/carousel-image-manifest";
import { encodePublicSrc } from "@/lib/encode-public-src";
import type { SeoCarouselItem } from "@/lib/seo/carousel-images";

export type RelatedCardItem = SeoCarouselItem & {
  headline?: string;
  textPosition?: TextPosition;
  /** ItemList / schema용 1200 JPG */
  representativeImage?: string;
  /** 이미지에 제목이 이미 들어 있어 HTML overlay를 생략 */
  textBaked?: boolean;
};

/** 사이트 카드 전용 1:1 타이포 썸네일 — SERP/OG/ItemList에는 쓰지 않는다 */
function resolveHookThumbnail(url: string): string | undefined {
  const item = getCarouselManifestItemByUrl(url);
  if (
    !item ||
    item.layoutVariant !== "centered-hook" ||
    (item.status !== "approved" && item.status !== "applied")
  ) {
    return undefined;
  }
  return encodePublicSrc(item.outputPath);
}

export function resolveSerpImage(pageUrl: string):
  | { src: string; alt: string; width: number; height: number }
  | undefined {
  const v = getPageVisual(pageUrl);
  if (!v) return undefined;
  return {
    src: encodePublicSrc(v.representativeImage),
    alt: v.alt,
    width: 1200,
    height: 1200,
  };
}

export function toRelatedCardItem(v: PageVisual): RelatedCardItem {
  const hook = resolveHookThumbnail(v.url);
  return {
    id: v.url,
    title: v.pageTitle,
    href: v.url,
    image: hook ?? encodePublicSrc(v.cardImage),
    textBaked: Boolean(hook),
    imageAlt: v.alt,
    category: v.category,
    headline: v.cardHeadline,
    textPosition: v.textPosition,
    representativeImage: encodePublicSrc(v.representativeImage),
  };
}

export function getRelatedContentCarousel(
  currentUrl: string,
  limit = 8,
): { heading: string; items: RelatedCardItem[] } | null {
  const current = getPageVisual(currentUrl);
  const related = getRelatedPageVisuals(currentUrl, limit);
  if (related.length < 4) return null;
  return {
    heading:
      current?.carouselSectionTitle ??
      related.find((r) => r.carouselSectionTitle)?.carouselSectionTitle ??
      "함께 확인할 업무",
    items: related.map(toRelatedCardItem),
  };
}

export function getContentCarouselForUrls(
  urls: string[],
  heading: string,
  excludeUrl?: string,
  limit = 8,
): { heading: string; items: RelatedCardItem[] } | null {
  const seen = new Set<string>();
  const items: RelatedCardItem[] = [];
  for (const url of urls) {
    if (excludeUrl && url === excludeUrl) continue;
    if (seen.has(url)) continue;
    const v = getPageVisual(url);
    if (!v) continue;
    seen.add(url);
    items.push(toRelatedCardItem(v));
    if (items.length >= limit) break;
  }
  if (items.length < 4) return null;
  return { heading, items };
}

export function summarizePageVisuals() {
  return {
    total: PAGE_VISUALS.length,
    byCategory: PAGE_VISUALS.reduce<Record<string, number>>((acc, v) => {
      acc[v.category] = (acc[v.category] ?? 0) + 1;
      return acc;
    }, {}),
  };
}
