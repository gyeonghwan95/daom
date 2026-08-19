import type { Metadata } from "next";
import { sanitizePageKeywords } from "@/lib/seo/champion-query";
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
  noIndex?: boolean;
  openGraphType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

const DEFAULT_OG_IMAGE = siteImages.seo.defaultOg.src;

/** 「부산 법무사」 검색 대표는 홈(`/`). 제목은 브랜드·지역서비스·대표자만. */
export const HOME_METADATA_TITLE = "다옴법무사사무소 | 부산 법무사 안윤정";

export const HOME_H1 = "부산 법무사 안윤정";

export const HOME_METADATA_DESCRIPTION =
  "부산 해운대·센텀 다옴법무사사무소 안윤정 법무사가 상속등기·부동산등기·법인등기·개인회생·파산 등 필요한 절차와 준비서류를 직접 상담·안내합니다. 부산 전역 상담 가능.";

const INDEX_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

function titleContainsBrand(text: string): boolean {
  return (
    text.includes(seoBrand.siteName) || text.includes(seoBrand.representative)
  );
}

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

/** 페이지 제목에 브랜드 접미사를 한 번만 붙입니다. */
export function buildSeoTitle(
  primary: string,
  options?: { withRepresentative?: boolean },
): string {
  const trimmed = primary.trim();
  if (titleContainsBrand(trimmed)) {
    return trimmed;
  }

  const suffix = options?.withRepresentative
    ? `${seoBrand.siteName} ${seoBrand.representative}`
    : seoBrand.siteName;

  return `${trimmed} | ${suffix}`;
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
  const canonical = getCanonicalUrl(input.path);
  const ogImage = getAbsoluteImageUrl(input.ogImage ?? DEFAULT_OG_IMAGE);
  const openGraphType = input.openGraphType ?? "website";
  const keywords = sanitizePageKeywords(input.path, input.keywords);

  return {
    title: { absolute: input.title },
    description: input.description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      type: openGraphType,
      locale: "ko_KR",
      url: canonical,
      siteName: seoBrand.siteName,
      title: input.title,
      description: input.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${seoBrand.siteName} - ${seoBrand.representative}`,
        },
      ],
      ...(openGraphType === "article" && input.publishedTime
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime ?? input.publishedTime,
            authors: input.authors ?? [seoBrand.representative],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : INDEX_ROBOTS,
  };
}

export const homeMetadata = createPageMetadata({
  title: HOME_METADATA_TITLE,
  description: HOME_METADATA_DESCRIPTION,
  path: "/",
  keywords: [
    "부산 법무사",
    seoBrand.siteName,
    seoBrand.representative,
    "상속등기",
    "부동산등기",
    "법인등기",
    "개인회생",
  ],
  ogImage: DEFAULT_OG_IMAGE,
});
