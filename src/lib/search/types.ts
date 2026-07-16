export type SearchContentType =
  | "menu"
  | "service"
  | "region"
  | "situation"
  | "diagnosis"
  | "faq"
  | "case"
  | "cost"
  | "document"
  | "glossary"
  | "tool"
  | "lecture"
  | "lectureHistory"
  | "agency"
  | "special"
  | "core"
  | "blog"
  | "other";

export type SearchCategoryFilter =
  | "all"
  | "service"
  | "region"
  | "diagnosis"
  | "faq"
  | "case"
  | "cost"
  | "lecture"
  | "tool"
  | "glossary"
  | "other";

export type SearchIndexItem = {
  id: string;
  title: string;
  description?: string;
  href: string;
  category: SearchContentType;
  categoryLabel: string;
  keywords: string[];
  aliases?: string[];
  region?: string[];
  serviceType?: string[];
  contentType: SearchContentType;
  priority?: number;
  isFeatured?: boolean;
};

export type SearchResult = SearchIndexItem & {
  score: number;
};

export type SearchPopularLink = {
  href: string;
  label: string;
  group: "service" | "region" | "lecture" | "menu";
};
