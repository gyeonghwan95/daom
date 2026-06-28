import type { Metadata } from "next";
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

export const HOME_METADATA_TITLE =
  "부산법무사 | 다옴법무사사무소 안윤정 법무사";

export const HOME_METADATA_DESCRIPTION =
  "부산 해운대·센텀 소재 다옴법무사사무소. 상속등기, 상속포기, 한정승인, 부동산등기, 법인설립등기, 임원변경등기 상담.";

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

  return {
    title: { absolute: input.title },
    description: input.description,
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
    "부산법무사",
    "부산 법무사",
    "해운대 법무사",
    "센텀 법무사",
    "부산 상속등기",
    "부산 부동산등기",
    "부산 법인등기",
    "부산 개인회생",
    seoBrand.siteName,
    seoBrand.representative,
  ],
  ogImage: DEFAULT_OG_IMAGE,
});
