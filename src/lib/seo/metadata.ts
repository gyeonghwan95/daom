import { resolveShareImage } from "@/lib/seo/share-image";
import { buildSeoTitle, titleContainsBrand } from "@/lib/seo/seo-title";

export { buildSeoTitle };
import { getPageOgThumbnail } from "@/data/seo/page-og-thumbnails";
import type { Metadata } from "next";
import { homeModifiedOn } from "@/lib/home-content";
import { sanitizePageKeywords } from "@/lib/seo/champion-query";
import { isNoIndexPath, resolveCanonicalPath } from "@/lib/seo/index-policy";
import { seoBrand } from "@/lib/seo/brand";
import { getAbsoluteAssetUrl } from "@/lib/seo/social";
import { siteImages } from "@/lib/site-images";
import { siteConfig } from "@/lib/site";

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

const DEFAULT_OG_IMAGE = siteImages.seo.defaultOg.src;

/**
 * 「부산 법무사」 PRIMARY = HOME `/`.
 * Exact-match를 앞자리에, H1(부산 법무사 안윤정)과 브랜드를 맞춰 고정한다.
 * (브랜드만 두면 exact query 신호가 약해짐 — 2026-08-20 복구)
 */
export const HOME_METADATA_TITLE = "부산 법무사 안윤정 | 다옴법무사사무소";

export const HOME_H1 = "부산 법무사 안윤정";

export const HOME_METADATA_DESCRIPTION =
  "부산 법무사 다옴법무사사무소(해운대 센텀)입니다. 안윤정 법무사가 상속등기·부동산등기·법인등기·개인회생을 직접 진행합니다. 법원 무료상담과 사무소 의뢰를 구분해 안내합니다.";

const INDEX_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  // 색인 페이지만: 큰 이미지 미리보기 허용(noindex 분기는 별도 값이라 영향 없음)
  "max-image-preview": "large",
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};


export function getCanonicalUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return siteConfig.url;
  }

  const segments = normalized.split("/").filter(Boolean);
  const encoded = segments.map((segment) => encodeURIComponent(segment)).join("/");
  return `${siteConfig.url}/${encoded}`;
}

export function getAbsoluteImageUrl(path: string): string {
  return getAbsoluteAssetUrl(path);
}


/** MDX 콘텐츠용 — seoTitle에 사무소명이 있으면 중복 접미사 방지 */
export function resolveContentSeoTitle(
  title: string,
  seoTitle?: string,
): string {
  const raw = (seoTitle ?? title).trim();
  if (titleContainsBrand(raw)) {
    return raw;
  }
  return `${raw} | ${seoBrand.siteName}`;
}

export function createPageMetadata(input: PageSeoInput): Metadata {
  const canonical = getCanonicalUrl(resolveCanonicalPath(input.path));
  // 실제 파일(또는 같은 사진의 1200px OG 파생본) 기준 URL·크기·형식 — 이중 인코딩 404·크기 불일치 방지(2026-10-11)
  // 페이지별 1:1 썸네일(npm run thumbnails:premium)이 있으면 어떤 템플릿이든 og:image를 그것으로 통일한다
  const pageThumb = getPageOgThumbnail(input.path);
  const share = resolveShareImage(
    pageThumb?.src ?? input.ogImage ?? DEFAULT_OG_IMAGE,
    pageThumb ? 1200 : (input.ogImageWidth ?? 1200),
    pageThumb ? 1200 : (input.ogImageHeight ?? 630),
  );
  const ogImage = share.url;
  const openGraphType = input.openGraphType ?? "website";
  const keywords = sanitizePageKeywords(input.path, input.keywords);
  const noIndex = Boolean(input.noIndex) || isNoIndexPath(input.path);

  return {
    title: { absolute: input.title },
    description: input.description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      // 404 템플릿이 canonical=/404 를 심으면 없는 URL이 200 /404 로 묶인다.
      ...(noIndex && input.path === "/404" ? {} : { canonical }),
      // metadata는 최상위 키 단위로 얕게 병합되어 layout의 alternates.types(RSS)가 사라지므로 여기서 함께 둔다.
      types: {
        "application/rss+xml": [{ url: "/rss.xml", title: "DAOM RSS" }],
      },
    },
    openGraph: {
      type: openGraphType,
      locale: "ko_KR",
      ...(noIndex && input.path === "/404" ? {} : { url: canonical }),
      siteName: seoBrand.siteName,
      title: input.title,
      description: input.description,
      images: [
        {
          url: ogImage,
          width: share.width,
          height: share.height,
          ...(share.type ? { type: share.type } : {}),
          alt:
            pageThumb?.alt ??
            input.ogImageAlt ??
            `${seoBrand.siteName} - ${seoBrand.representative}`,
        },
      ],
      ...(input.publishedTime || input.modifiedTime
        ? {
            ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
            modifiedTime: input.modifiedTime ?? input.publishedTime,
            ...(openGraphType === "article"
              ? { authors: input.authors ?? [seoBrand.representative] }
              : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : INDEX_ROBOTS,
  };
}

export const homeMetadata = createPageMetadata({
  title: HOME_METADATA_TITLE,
  description: HOME_METADATA_DESCRIPTION,
  path: "/",
  keywords: [
    "부산 법무사",
    "부산법무사",
    "부산 법무사 사무소",
    "부산 법인 법무사",
    seoBrand.siteName,
    seoBrand.representative,
    "상속등기",
    "부동산등기",
    "법인등기",
    "개인회생",
  ],
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: "부산 법무사 안윤정 · 다옴법무사사무소",
  modifiedTime: `${homeModifiedOn}T00:00:00+09:00`,
});
