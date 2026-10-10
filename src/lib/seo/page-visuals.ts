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

/**
 * 대표 visual이 없는 페이지(블로그·지역·FAQ 등)는 업무 분류(serviceSlug)로 캐러셀 분류를 추정한다.
 * 추정이 없으면 PAGE_VISUALS 앞 8개(서비스 허브 묶음)가 모든 페이지에 똑같이 나왔다.
 */
const CATEGORY_BY_SERVICE: readonly [RegExp, string][] = [
  [/inherit|renunciation|qualified|heir|estate|will|succession/, "inheritance"],
  [/jeonse|lease|deposit|tenant/, "lease"],
  [/rehabilitation|bankruptcy|debt|insolvency/, "rehabilitation"],
  [/corporate|company|director|head-office|capital|dissolution|purpose|startup|nonprofit|association|foundation/, "corporate"],
  [/real-estate|ownership|gift|mortgage|preservation|building|apartment|land|cancellation|registration/, "realestate"],
  [/lecture|education/, "lecture"],
];
const NEIGHBOR_CATEGORY: Record<string, string[]> = {
  inheritance: ["realestate"],
  lease: ["realestate"],
  rehabilitation: ["inheritance"],
  realestate: ["inheritance"],
  corporate: ["realestate"],
  lecture: ["lease"],
};

/** 업무 분류 값이 없는 페이지(지역 업무사례 등)는 경로의 업무명으로 추정한다 */
const CATEGORY_BY_PATH: readonly [RegExp, string][] = [
  [/상속|한정승인|유증|유언/, "inheritance"],
  [/회생|파산/, "rehabilitation"],
  [/전세|임차권|보증금/, "lease"],
  [/법인|임원|본점|정관|사단|재단|협동조합|회사/, "corporate"],
  [/등기|소유권|증여|근저당|매매|부동산/, "realestate"],
];
function categoryFromPath(url: string): string | undefined {
  let path = url;
  try {
    path = decodeURIComponent(url);
  } catch {
    // 이미 디코딩된 경로
  }
  return CATEGORY_BY_PATH.find(([re]) => re.test(path))?.[1];
}

function relatedVisualsByCategory(currentUrl: string, category: string, limit: number): PageVisual[] {
  const others = PAGE_VISUALS.filter((v) => v.url !== currentUrl);
  const order = [category, ...(NEIGHBOR_CATEGORY[category] ?? [])];
  const picked: PageVisual[] = [];
  for (const c of order) for (const v of others) if (v.category === c && !picked.includes(v)) picked.push(v);
  for (const v of others) if (!picked.includes(v)) picked.push(v);
  return picked.slice(0, limit);
}

export function getRelatedContentCarousel(
  currentUrl: string,
  limit = 8,
  hint?: { serviceSlug?: string },
): { heading: string; items: RelatedCardItem[] } | null {
  const current = getPageVisual(currentUrl);
  const hintedCategory = current
    ? undefined
    : (hint?.serviceSlug
        ? CATEGORY_BY_SERVICE.find(([re]) => re.test(hint.serviceSlug!))?.[1]
        : undefined) ?? categoryFromPath(currentUrl);
  const related = hintedCategory
    ? relatedVisualsByCategory(currentUrl, hintedCategory, limit)
    : getRelatedPageVisuals(currentUrl, limit);
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
