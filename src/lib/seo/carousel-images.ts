/**
 * 캐러셀 대표이미지 리졸버 — carousel-image-manifest 단일 출처.
 * status가 approved|applied 인 항목만 metadata/캐러셀/ItemList로 나간다.
 */

import {
  CAROUSEL_HUBS,
  CAROUSEL_IMAGE_MANIFEST,
  getCarouselManifestItem,
  getCarouselManifestItemByUrl,
  type CarouselImageManifestItem,
} from "@/data/seo/carousel-image-manifest";
import { encodePublicSrc } from "@/lib/encode-public-src";

export type SeoCarouselItem = {
  id: string;
  title: string;
  description?: string;
  href: string;
  image: string;
  imageAlt: string;
  category?: string;
};

export function isCarouselImageReady(item: CarouselImageManifestItem): boolean {
  return item.status === "approved" || item.status === "applied";
}

/** 페이지 OG 이미지 (승인 전이면 undefined → 기존 기본 OG 유지) */
export function resolveCarouselOgImage(pageUrl: string):
  | { src: string; alt: string; width: number; height: number }
  | undefined {
  const item = getCarouselManifestItemByUrl(pageUrl);
  if (!item || !isCarouselImageReady(item) || !item.ogImageRequired) {
    return undefined;
  }
  return {
    src: encodePublicSrc(item.outputPath),
    alt: item.alt,
    width: item.width,
    height: item.height,
  };
}

/**
 * 허브 캐러셀 데이터.
 * 승인 항목 4개 미만이면 null (캐러셀·ItemList 모두 미노출).
 * 동일 URL·동일 이미지 중복은 제외한다.
 */
export function getApprovedCarouselHubData(hubUrl: string):
  | { heading: string; items: SeoCarouselItem[] }
  | null {
  const hub = CAROUSEL_HUBS.find((h) => h.hubUrl === hubUrl);
  if (!hub) return null;

  const seenUrls = new Set<string>();
  const seenImages = new Set<string>();
  const items: SeoCarouselItem[] = [];

  for (const id of hub.itemIds) {
    const m = getCarouselManifestItem(id);
    if (!m || !isCarouselImageReady(m) || !m.carouselCandidate) continue;
    if (seenUrls.has(m.pageUrl) || seenImages.has(m.outputPath)) continue;
    seenUrls.add(m.pageUrl);
    seenImages.add(m.outputPath);
    items.push({
      id: m.id,
      title: m.pageTitle,
      description: m.subheadline,
      href: m.pageUrl,
      image: encodePublicSrc(m.outputPath),
      imageAlt: m.alt,
      category: m.primaryKeyword,
    });
    if (items.length >= 7) break;
  }

  if (items.length < 4) return null;
  return { heading: hub.heading, items };
}

/** 검사용 집계 */
export function summarizeCarouselManifest() {
  const counts: Record<string, number> = {};
  for (const item of CAROUSEL_IMAGE_MANIFEST) {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
  }
  return {
    total: CAROUSEL_IMAGE_MANIFEST.length,
    byStatus: counts,
    ready: CAROUSEL_IMAGE_MANIFEST.filter(isCarouselImageReady).length,
  };
}
