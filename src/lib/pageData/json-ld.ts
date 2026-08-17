import {
  buildFaqPageSchema,
  buildServicePageSchema,
  buildWebPageSchema,
} from "@/lib/seo/json-ld";
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
  const schemas: Record<string, unknown>[] = [
    buildWebPageSchema({
      title: page.metaTitle,
      description: page.metaDescription,
      path: page.path,
      h1: page.h1,
      image: page.ogImage,
    }),
    buildServicePageSchema(page.title, page.path),
  ];

  if (page.includeFaqSchema) {
    const faqs = mergeVisibleFaqs(page.faqs, options.extraFaqs);
    if (faqs.length > 0) {
      schemas.push(buildFaqPageSchema(faqs, page.path));
    }
  }

  return schemas;
}
