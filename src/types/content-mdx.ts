export type ContentType = "blog" | "cases" | "faq" | "services";

export type ContentFrontmatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  slug: string;
  author: string;
  office: string;
  relatedServices?: string[];
  area?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type ContentMeta = ContentFrontmatter & {
  contentType: ContentType;
  href: string;
};
