export const staticRoutes = [
  "/",
  "/about",
  "/office",
  "/services",
  "/blog",
  "/reviews",
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
  pressSlugs: string[] = [],
  localLandingSlugs: string[] = [],
): string[] {
  return [
    ...staticRoutes,
    ...localLandingSlugs.map((slug) => `/${slug}`),
    ...serviceSlugs.map((slug) => `/services/${slug}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
    ...caseSlugs.map((slug) => `/services/cases/${slug}`),
    ...faqSlugs.map((slug) => `/faq/${slug}`),
    ...pressSlugs.map((slug) => `/media/${slug}`),
  ];
}
