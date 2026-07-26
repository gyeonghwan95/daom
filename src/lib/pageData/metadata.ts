import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { resolveCarouselOgImage } from "@/lib/seo/carousel-images";
import type { PageData } from "./types";

export function pageDataToMetadata(page: PageData): Metadata {
  // 승인된 캐러셀 대표이미지가 있으면 우선 사용 (manifest 단일 출처)
  const carouselOg = resolveCarouselOgImage(page.path);

  return createPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    keywords: page.primaryKeywords,
    ogImage: carouselOg?.src ?? page.ogImage,
    openGraphType: page.openGraphType ?? "website",
  });
}
