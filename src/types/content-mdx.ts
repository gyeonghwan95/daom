import type { ContentRelations } from "@/types/content-relations";

export type ContentType = "blog" | "cases" | "faq" | "services";

export type ContentFrontmatter = ContentRelations & {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  slug: string;
  author: string;
  office: string;
  area?: string;
  caseCategory?: string;
  situationTags?: string[];
  region?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** SEO 검색 의도 분류 (@/data/seo/types SearchIntentKind) */
  searchIntent?: string;
};

export type ContentMeta = ContentFrontmatter & {
  contentType: ContentType;
  href: string;
};
