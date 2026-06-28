import {
  buildFaqPageSchema,
  buildLegalServiceSchema,
  buildLocalBusinessSchema,
  buildServicePageSchema,
} from "@/lib/seo/json-ld";
import type { PageData } from "./types";

export function buildJsonLdForPageData(page: PageData): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [
    buildLegalServiceSchema(),
    buildLocalBusinessSchema(),
    buildServicePageSchema(page.title, page.path),
  ];

  if (page.includeFaqSchema && page.faqs.length > 0) {
    schemas.push(buildFaqPageSchema(page.faqs));
  }

  return schemas;
}
