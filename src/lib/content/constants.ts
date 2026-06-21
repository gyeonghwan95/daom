export const CONTENT_DEFAULTS = {
  author: "안윤정 법무사",
  office: "다옴법무사사무소",
} as const;

export const CONTENT_BASE_PATH: Record<
  "blog" | "cases" | "faq" | "services",
  string
> = {
  blog: "/blog",
  cases: "/services/cases",
  faq: "/faq",
  services: "/services",
};
