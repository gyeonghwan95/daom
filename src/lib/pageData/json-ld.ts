import {
  buildFaqPageSchema,
  buildServicePageSchema,
  buildWebPageSchema,
  schemaIds,
} from "@/lib/seo/json-ld";
import { resolveCarouselOgImage } from "@/lib/seo/carousel-images";
import { resolveCanonicalPath } from "@/lib/seo/index-policy";
import type { PageData, PageFaqItem } from "./types";

export function mergeVisibleFaqs(
  ...groups: Array<readonly PageFaqItem[] | undefined>
): PageFaqItem[] {
  const seen = new Set<string>();
  const merged: PageFaqItem[] = [];
  for (const group of groups) {
    for (const faq of group ?? []) {
      if (seen.has(faq.question)) continue;
      seen.add(faq.question);
      merged.push(faq);
    }
  }
  return merged;
}

type JsonLdOptions = {
  /** 화면에 실제로 렌더되는 추가 FAQ (conversion post-faq 등) */
  extraFaqs?: readonly PageFaqItem[];
};

/**
 * 페이지 단위 JSON-LD.
 * LegalService·LocalBusiness는 루트 GlobalJsonLd에 있으므로 여기서 반복하지 않는다.
 * WebPage는 페이지 URL·speakable·significantLink(기존 URL)만 붙인다.
 * FAQPage는 화면에 보이는 질문만 넣는다.
 */
export function buildJsonLdForPageData(
  page: PageData,
  options: JsonLdOptions = {},
): Record<string, unknown>[] {
  const isExpertHub = page.slug === "부산법률전문가" || page.path === "/부산법률전문가";
  const canonicalPath = resolveCanonicalPath(page.path);
  const primaryImage =
    resolveCarouselOgImage(canonicalPath)?.src ?? page.ogImage;
  const schemas: Record<string, unknown>[] = [
    buildWebPageSchema({
      title: page.metaTitle,
      description: page.metaDescription,
      path: canonicalPath,
      h1: page.h1,
      image: primaryImage,
      aboutId: isExpertHub ? schemaIds.person : undefined,
    }),
  ];
  if (!isExpertHub && page.category !== "glossary") {
    schemas.push(
      buildServicePageSchema(page.serviceSchemaName ?? page.title, canonicalPath),
    );
  }

  // 화면에 보이는 FAQ가 5개 이상이면 페이지 고유 질문으로 보고 FAQPage를 내보낸다(3~4개짜리는 지역·글 템플릿 공통 질문이라 제외)
  // 빌더가 true/false를 명시했으면 그대로 따른다(용어사전처럼 일부러 끈 페이지 포함). 지정하지 않았을 때만 고유 FAQ 5개 이상이면 켠다
  if (page.includeFaqSchema ?? (page.faqs?.length ?? 0) >= 5) {
    const faqs = mergeVisibleFaqs(page.faqs, options.extraFaqs);
    if (faqs.length > 0) {
      schemas.push(buildFaqPageSchema(faqs, canonicalPath));
    }
  }

  return schemas;
}
