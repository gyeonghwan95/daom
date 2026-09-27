import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { resolveCarouselOgImage } from "@/lib/seo/carousel-images";
import { getLectureTargetOgImage } from "@/lib/lectures/target-specs";
import type { PageData } from "./types";

export function pageDataToMetadata(page: PageData): Metadata {
  // 강의 target 페이지는 페이지별 실제 강의 사진, 그 외는 승인된 캐러셀 대표이미지 우선
  const carouselOg =
    getLectureTargetOgImage(page.path) ?? resolveCarouselOgImage(page.path);

  return createPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    keywords: page.primaryKeywords,
    ogImage: carouselOg?.src ?? page.ogImage,
    ogImageAlt: carouselOg?.alt,
    ogImageWidth: carouselOg?.width,
    ogImageHeight: carouselOg?.height,
    openGraphType: page.openGraphType ?? "website",
  });
}
