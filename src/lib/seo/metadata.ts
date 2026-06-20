import type { Metadata } from "next";
import { homeHero, homeSeoKeywords } from "@/lib/home-content";
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

export function getCanonicalUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return siteConfig.url;
  }
  return `${siteConfig.url}${normalized}`;
}

export function getAbsoluteImageUrl(path: string): string {
  return getAbsoluteAssetUrl(path);
}

/** seoTitle에 사무소명이 이미 있으면 중복 접미사 방지 */
export function resolveContentSeoTitle(
  title: string,
  seoTitle?: string,
): string {
  const raw = seoTitle ?? title;
  if (raw.includes(seoBrand.siteName)) {
    return raw;
  }
  return `${raw} | ${seoBrand.siteName}`;
}

export function createPageMetadata(input: PageSeoInput): Metadata {
  const canonical = getCanonicalUrl(input.path);
  const ogImage = getAbsoluteImageUrl(input.ogImage ?? DEFAULT_OG_IMAGE);
  const keywords = [
    ...(input.keywords ?? [
      ...seoBrand.targetKeywords.slice(0, 5),
      seoBrand.siteName,
      seoBrand.representative,
    ]),
  ];

  const openGraphType = input.openGraphType ?? "website";

  return {
    title: { absolute: input.title },
    description: input.description,
    keywords,
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
      : { index: true, follow: true },
  };
}

export function buildSeoTitle(
  primary: string,
  options?: { includeRepresentative?: boolean },
): string {
  const includeRep = options?.includeRepresentative ?? true;
  if (primary.includes(seoBrand.siteName)) {
    return primary;
  }
  if (includeRep) {
    return `${primary} | ${seoBrand.representative} | ${seoBrand.siteName}`;
  }
  return `${primary} | ${seoBrand.siteName}`;
}

export const homeMetadata = createPageMetadata({
  title: buildSeoTitle("부산 법무사 · 해운대·센텀 상속·등기 전문"),
  description: `${homeHero.headline.replace("\n", " ")} ${homeHero.sub}`,
  path: "/",
  keywords: [
    ...homeSeoKeywords,
    ...seoBrand.targetKeywords,
    seoBrand.siteName,
    seoBrand.representative,
  ],
});
