/**
 * 네이버 이미지형 하위페이지 제안(캐러셀) 리졸버.
 * 화면 카드와 ItemList JSON-LD가 같은 순서·같은 이미지를 쓴다.
 */

import { getPageRelation } from "@/data/seo/page-relations";
import { getSerpHookImage } from "@/data/seo/serp-hook-images";
import { getSerpOwnedImage } from "@/data/seo/serp-carousel-images";
import {
  getExplicitSerpCarouselPack,
  HOME_SERP_CAROUSEL_URLS,
  INHERITANCE_SERP_CAROUSEL_URLS,
  isLectureLandingPath,
  LECTURE_SERP_CAROUSEL_URLS,
} from "@/data/seo/serp-carousel-packs";
import { getPageVisual } from "@/data/seo/page-visuals";
import {
  BUSAN_DISTRICT_HUBS,
  hubPathForRegionKey,
  isBusanDistrictHubPath,
} from "@/lib/geo/busan-district-hubs";
import { getLocalLandingConfig } from "@/lib/local-landing/config";
import { getLectureTargetOgImage } from "@/lib/lectures/target-specs";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { isNoIndexPath } from "@/lib/seo/index-policy";
import {
  getRelatedContentCarousel,
  resolveSerpImage,
  toRelatedCardItem,
  type RelatedCardItem,
} from "@/lib/seo/page-visuals";

const MIN_ITEMS = 4;
const MAX_ITEMS = 7;

export type SerpCarouselPack = {
  heading: string;
  description?: string;
  items: RelatedCardItem[];
};

function normalizePath(raw: string): string {
  const path = raw.split("?")[0]?.trim() || "/";
  if (path === "") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function cardTitle(url: string): string {
  const owned = getSerpOwnedImage(url);
  if (owned) return owned.title;
  const visual = getPageVisual(url);
  if (visual) return visual.pageTitle;
  const district = BUSAN_DISTRICT_HUBS.find((hub) => hub.href === url);
  if (district) return district.label;
  return url.replace(/^\//, "").replace(/법무사$/, " 법무사");
}

/**
 * 제목이 이미 이미지 안에 들어간 1:1 썸네일인지(npm run thumbnails:premium 생성물).
 * 이런 이미지 위에는 카드 제목을 HTML로 다시 겹치지 않는다.
 */
function isTitledThumbnail(src: string): boolean {
  let p = src;
  try {
    p = decodeURIComponent(src);
  } catch {
    // 그대로 비교
  }
  if (/^\/image\/og\//.test(p)) return !/-4x3\.jpe?g$/i.test(p);
  return /^\/(images\/generated\/carousel|generated\/(serp|thumbnails)|image\/og-pages|image\/cards|resources\/og)\//.test(p);
}

function toCard(url: string): RelatedCardItem | null {
  if (isNoIndexPath(url)) return null;
  const visual = getPageVisual(url);
  if (visual) return toRelatedCardItem(visual);

  const hook = getSerpHookImage(url);
  const owned = getSerpOwnedImage(url);
  const lecture = getLectureTargetOgImage(url);
  const serp = resolveSerpImage(url);
  const src = hook?.src ?? owned?.src ?? lecture?.src ?? serp?.src;
  if (!src) return null;

  return {
    id: url,
    title: cardTitle(url),
    href: url,
    image: encodePublicSrc(src),
    imageAlt: hook?.alt ?? owned?.alt ?? lecture?.alt ?? serp?.alt ?? cardTitle(url),
    category: lecture ? "lecture" : "local",
    headline: owned?.headline ?? cardTitle(url),
    textPosition: "center-low",
    representativeImage: encodePublicSrc(src),
    textBaked: Boolean(hook) || isTitledThumbnail(src),
  };
}

function pushUrl(urls: string[], href: string, current: string) {
  const path = normalizePath(href);
  if (!path || path === current) return;
  if (isNoIndexPath(path)) return;
  if (urls.includes(path)) return;
  urls.push(path);
}

function districtRotation(current: string): string[] {
  const ordered = BUSAN_DISTRICT_HUBS.map((hub) => hub.href);
  const index = ordered.indexOf(current);
  if (index < 0) return [...HOME_SERP_CAROUSEL_URLS];
  return [...ordered.slice(index + 1), ...ordered.slice(0, index)];
}

const SPOKE_TO_GU: Record<string, string> = {
  "/정관법무사": "/기장군법무사",
  "/일광읍법무사": "/기장군법무사",
  "/기장읍법무사": "/기장군법무사",
  "/오시리아법무사": "/기장군법무사",
  "/명지법무사": "/강서구법무사",
  "/명지동법무사": "/강서구법무사",
  "/화명동법무사": "/북구법무사",
  "/덕천동법무사": "/북구법무사",
  "/구포동법무사": "/북구법무사",
  "/센텀법무사": "/해운대법무사",
  "/재송동법무사": "/해운대법무사",
  "/반여동법무사": "/해운대법무사",
  "/광안리법무사": "/수영구법무사",
  "/광안동법무사": "/수영구법무사",
  "/민락동법무사": "/수영구법무사",
  "/양정동법무사": "/부산진구법무사",
  "/장전동법무사": "/금정구법무사",
  "/중동법무사": "/해운대법무사",
  "/부전동법무사": "/부산진구법무사",
  "/온천동법무사": "/동래구법무사",
  "/문현동법무사": "/남구법무사",
  "/서면법무사": "/부산진구법무사",
  "/사상법무사": "/사상구법무사",
  "/기장법무사": "/기장군법무사",
  "/하단법무사": "/사하구법무사",
  "/우동법무사": "/해운대법무사",
  "/좌동법무사": "/해운대법무사",
  "/사직동법무사": "/동래구법무사",
  "/전포동법무사": "/부산진구법무사",
  "/부산역법무사": "/동구법무사",
  "/송정동법무사": "/해운대법무사",
  "/센텀시티역법무사": "/해운대법무사",
  "/서면역법무사": "/부산진구법무사",
  "/해운대역법무사": "/해운대법무사",
  "/광안역법무사": "/수영구법무사",
  "/사상역법무사": "/사상구법무사",
  "/명지역법무사": "/강서구법무사",
  "/연산역법무사": "/연제구법무사",
};

function parentDistrictHub(current: string): string | undefined {
  if (SPOKE_TO_GU[current]) return SPOKE_TO_GU[current];
  const slug = current.replace(/^\//, "");
  const config = getLocalLandingConfig(slug);
  if (!config) return undefined;
  const parent = hubPathForRegionKey(config.regionKey);
  if (parent && parent.href !== current && isBusanDistrictHubPath(parent.href)) {
    return parent.href;
  }
  return undefined;
}

function neighborhoodUrls(current: string): string[] {
  const slug = current.replace(/^\//, "");
  const config = getLocalLandingConfig(slug);
  const urls: string[] = [];
  const spokeGu = parentDistrictHub(current);
  if (spokeGu) pushUrl(urls, spokeGu, current);
  if (!config) return urls;
  const linked = (config.linkedNeighborhoodSlugs ?? []).map((item) => `/${item}`);
  for (const href of linked) pushUrl(urls, href, current);
  return urls;
}

function spokeCandidateUrls(current: string, nearby: string[]): string[] {
  const urls = [...nearby];
  const parentGu = parentDistrictHub(current);
  if (parentGu) {
    const parentConfig = getLocalLandingConfig(parentGu.replace(/^\//, ""));
    for (const slug of parentConfig?.linkedNeighborhoodSlugs ?? []) {
      pushUrl(urls, `/${slug}`, current);
    }
  }
  pushUrl(urls, "/부산공탁", current);
  if (parentGu) {
    for (const href of districtRotation(parentGu)) pushUrl(urls, href, current);
  }
  return urls;
}

function candidateUrls(current: string): { heading: string; description?: string; urls: string[] } {
  const explicit = getExplicitSerpCarouselPack(current);
  if (explicit) {
    return {
      heading: explicit.heading,
      description: explicit.description,
      urls: [...explicit.urls],
    };
  }

  if (isBusanDistrictHubPath(current)) {
    const urls: string[] = [];
    for (const href of neighborhoodUrls(current)) pushUrl(urls, href, current);
    pushUrl(urls, "/부산공탁", current);
    for (const href of districtRotation(current)) pushUrl(urls, href, current);
    return {
      heading: "다른 구·군·업무 안내",
      urls,
    };
  }

  const nearby = neighborhoodUrls(current);
  if (nearby.length > 0) {
    return {
      heading: "이 생활권에서 이어서 볼 안내",
      urls: spokeCandidateUrls(current, nearby),
    };
  }

  if (current.startsWith("/업무사례/")) {
    const relation = getPageRelation(current);
    const urls: string[] = [];
    if (relation?.parentHub) pushUrl(urls, relation.parentHub, current);
    for (const href of relation?.relatedPages ?? []) pushUrl(urls, href, current);
    for (const href of INHERITANCE_SERP_CAROUSEL_URLS) pushUrl(urls, href, current);
    return { heading: "상속등기와 이어지는 안내", urls };
  }

  if (isLectureLandingPath(current)) {
    const urls: string[] = [];
    for (const href of LECTURE_SERP_CAROUSEL_URLS) pushUrl(urls, href, current);
    return { heading: "주제별 강의·특강 안내", urls };
  }

  const relation = getPageRelation(current);
  if (relation?.relatedPages.length) {
    const urls: string[] = [];
    if (relation.parentHub) pushUrl(urls, relation.parentHub, current);
    for (const href of relation.relatedPages) pushUrl(urls, href, current);
    for (const href of HOME_SERP_CAROUSEL_URLS) pushUrl(urls, href, current);
    return { heading: "함께 확인할 안내", urls };
  }

  const visualFallback = getRelatedContentCarousel(current, MAX_ITEMS);
  return {
    heading: visualFallback?.heading ?? "함께 확인할 업무",
    urls: visualFallback?.items.map((item) => item.href) ?? [...HOME_SERP_CAROUSEL_URLS],
  };
}

function uniqueCards(urls: string[], current: string): RelatedCardItem[] {
  const seenUrls = new Set<string>([current]);
  const seenImages = new Set<string>();
  const items: RelatedCardItem[] = [];
  for (const url of urls) {
    const path = normalizePath(url);
    if (seenUrls.has(path)) continue;
    const card = toCard(path);
    if (!card) continue;
    const imageKey = card.representativeImage ?? card.image;
    if (seenImages.has(imageKey)) continue;
    seenUrls.add(path);
    seenImages.add(imageKey);
    items.push(card);
    if (items.length >= MAX_ITEMS) break;
  }
  return items;
}

export function getSerpCarouselPack(pageUrl: string): SerpCarouselPack | null {
  const current = normalizePath(pageUrl);
  if (isNoIndexPath(current)) return null;
  const candidate = candidateUrls(current);
  const items = uniqueCards(candidate.urls, current);
  if (items.length < MIN_ITEMS) return null;
  return {
    heading: candidate.heading,
    description: candidate.description,
    items,
  };
}
