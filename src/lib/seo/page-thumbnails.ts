/**
 * @deprecated Prefer `@/lib/seo/page-visuals` (SERP JPG + HTML overlay cards).
 * 하위 호환: page-visuals card/serp 경로를 우선 반환.
 */

import { getPageThumbnail } from "@/data/seo/page-thumbnails";
import { getPageVisual } from "@/data/seo/page-visuals";
import { encodePublicSrc } from "@/lib/encode-public-src";
import {
  getContentCarouselForUrls,
  getRelatedContentCarousel,
  type RelatedCardItem,
} from "@/lib/seo/page-visuals";

export type ThumbnailCardItem = RelatedCardItem;

export function toThumbnailCardItem(item: {
  url: string;
  pageTitle: string;
  output: string;
  alt: string;
  category?: string;
}): ThumbnailCardItem {
  const visual = getPageVisual(item.url);
  return {
    id: item.url,
    title: item.pageTitle,
    href: item.url,
    image: encodePublicSrc(visual?.cardImage ?? item.output),
    imageAlt: visual?.alt ?? item.alt,
    category: item.category,
    headline: visual?.cardHeadline,
    textPosition: visual?.textPosition,
    representativeImage: visual
      ? encodePublicSrc(visual.representativeImage)
      : undefined,
  };
}

export function resolvePageThumbnailSrc(url: string): string | undefined {
  const visual = getPageVisual(url);
  if (visual) return encodePublicSrc(visual.cardImage);
  const item = getPageThumbnail(url);
  return item ? encodePublicSrc(item.output) : undefined;
}

export function getRelatedThumbnailCarousel(currentUrl: string, limit = 8) {
  return getRelatedContentCarousel(currentUrl, limit);
}

export function getThumbnailCarouselForUrls(
  urls: string[],
  heading: string,
  excludeUrl?: string,
  limit = 8,
) {
  return getContentCarouselForUrls(urls, heading, excludeUrl, limit);
}

export function summarizePageThumbnails() {
  return { total: 0, note: "use summarizePageVisuals from page-visuals" };
}
