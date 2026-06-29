import { civilSeoIntentArticles } from "./civil";
import { corporateSeoIntentArticles } from "./corporate";
import { inheritanceSeoIntentArticles } from "./inheritance";
import { realEstateSeoIntentArticles } from "./real-estate";
import { rehabilitationSeoIntentArticles } from "./rehabilitation";
import type { SeoIntentArticle } from "./types";

export type { SeoIntentArticle, SeoIntentArticleSections } from "./types";
export { SEO_INTENT_ARTICLE_AUTHOR, SEO_INTENT_ARTICLE_OFFICE } from "./types";

export const SEO_INTENT_ARTICLE_GROUPS = {
  inheritance: inheritanceSeoIntentArticles,
  realEstate: realEstateSeoIntentArticles,
  corporate: corporateSeoIntentArticles,
  civil: civilSeoIntentArticles,
  rehabilitation: rehabilitationSeoIntentArticles,
} as const;

export const allSeoIntentArticles: SeoIntentArticle[] = [
  ...inheritanceSeoIntentArticles,
  ...realEstateSeoIntentArticles,
  ...corporateSeoIntentArticles,
  ...civilSeoIntentArticles,
  ...rehabilitationSeoIntentArticles,
];

export function getSeoIntentArticlesForGeneration(): SeoIntentArticle[] {
  return allSeoIntentArticles.filter((article) => !article.skipGeneration);
}

export function getSeoIntentArticleBySlug(
  slug: string,
): SeoIntentArticle | undefined {
  return allSeoIntentArticles.find((article) => article.slug === slug);
}
