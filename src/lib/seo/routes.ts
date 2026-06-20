export const staticRoutes = [
  "/",
  "/about",
  "/office",
  "/services",
  "/cases",
  "/blog",
  "/faq",
  "/media",
  "/contact",
  "/location",
] as const;

export function getAllSitePaths(
  serviceSlugs: string[],
  blogSlugs: string[] = [],
  caseSlugs: string[] = [],
  faqSlugs: string[] = [],
): string[] {
  return [
    ...staticRoutes,
    ...serviceSlugs.map((slug) => `/services/${slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
    ...caseSlugs.map((slug) => `/cases/${slug}`),
    ...faqSlugs.map((slug) => `/faq/${slug}`),
  ];
}
