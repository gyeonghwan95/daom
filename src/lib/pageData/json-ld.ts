import { buildFaqPageSchema,
  buildLegalServiceSchema,
  buildLocalBusinessSchema,
  buildServicePageSchema,
} from "@/lib/seo/json-ld";
import { getConversionFaqsForPage } from "@/lib/service-conversion";
import type { PageData } from "./types";

export function buildJsonLdForPageData(page: PageData): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [
    buildLegalServiceSchema(),
    buildLocalBusinessSchema(),
    buildServicePageSchema(page.title, page.path),
  ];

  if (page.includeFaqSchema) {
    const conversionFaqs = getConversionFaqsForPage(page.slug, page.path);
    const allFaqs = [...page.faqs, ...conversionFaqs];
    if (allFaqs.length > 0) {
      schemas.push(buildFaqPageSchema(allFaqs));
    }
  }

  return schemas;
}
