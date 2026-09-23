/**
 * 페이지별 visual manifest (Phase 1).
 * SERP 대표 = 무텍스트 1200 JPG
 * 카드 = 동일 구도 WebP + HTML headline overlay
 * URL / title / H1 / canonical 변경 없음.
 */

import {
  PAGE_THUMBNAILS,
  type PageThumbnailItem,
  type ThumbnailCopyType,
  type ThumbnailTemplate,
} from "@/data/seo/page-thumbnails";
import type { ThumbnailCategory } from "@/data/media/thumbnail-portraits";

export const VISUAL_DESIGN_VERSION = 1;

export type TextPosition =
  | "left"
  | "right"
  | "bottom"
  | "top"
  | "center-low"
  | "center-high";

export type PageVisual = {
  url: string;
  pageTitle: string;
  sourcePortrait: string;
  /** SERP / og / body / ItemList image — 글자 없음 */
  representativeImage: string;
  /** 사이트 캐러셀용 저용량 */
  cardImage: string;
  cardHeadline: string;
  copyType: ThumbnailCopyType;
  textPosition: TextPosition;
  alt: string;
  category: ThumbnailCategory;
  parentHub?: string;
  relatedGroup: string;
  carouselSectionTitle?: string;
  composition: ThumbnailTemplate;
  designVersion: number;
};

function templateToTextPosition(t: ThumbnailTemplate): TextPosition {
  switch (t) {
    case "EDITORIAL_LEFT":
    case "SOFT_SPLIT_LEFT":
      return "left";
    case "EDITORIAL_RIGHT":
    case "SOFT_SPLIT_RIGHT":
      return "right";
    case "CENTER_LOW":
      return "center-low";
    case "CENTER_HIGH":
      return "center-high";
    default:
      return "left";
  }
}

function fileBase(thumb: PageThumbnailItem): string {
  const name = thumb.output.split("/").pop() ?? "page.webp";
  return name.replace(/\.webp$/i, "");
}

function fromThumb(thumb: PageThumbnailItem): PageVisual {
  const base = fileBase(thumb);
  return {
    url: thumb.url,
    pageTitle: thumb.pageTitle,
    sourcePortrait: thumb.sourcePortrait,
    representativeImage: `/generated/serp/${thumb.category}/${base}.jpg`,
    cardImage: `/generated/cards/${thumb.category}/${base}.webp`,
    cardHeadline: thumb.headline,
    copyType: thumb.copyType,
    textPosition: templateToTextPosition(thumb.template),
    alt: thumb.alt.includes("안윤정")
      ? thumb.alt
      : `${thumb.pageTitle}를 안내하는 안윤정 법무사`,
    category: thumb.category,
    relatedGroup: thumb.category,
    carouselSectionTitle: thumb.carouselSectionTitle,
    composition: thumb.template,
    designVersion: VISUAL_DESIGN_VERSION,
  };
}

export const PAGE_VISUALS: PageVisual[] = PAGE_THUMBNAILS.map(fromThumb);

export function getPageVisual(url: string): PageVisual | undefined {
  return PAGE_VISUALS.find((v) => v.url === url);
}

export function getRelatedPageVisuals(
  currentUrl: string,
  limit = 8,
): PageVisual[] {
  const current = getPageVisual(currentUrl);
  const others = PAGE_VISUALS.filter((v) => v.url !== currentUrl);
  const same = current
    ? others.filter((v) => v.category === current.category)
    : [];
  const rest = others.filter((v) => !same.includes(v));
  return [...same, ...rest].slice(0, limit);
}
