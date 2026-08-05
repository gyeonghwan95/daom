import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PressArticleLayout } from "@/components/press/PressArticleLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageDataToMetadata } from "@/lib/pageData/metadata";
import { resolveMediaPageData } from "@/lib/pageData/resolvers";
import { buildNewsArticleSchema } from "@/lib/seo/json-ld";
import { normalizeRouteSlug } from "@/lib/seo/slug";
import {
  getPressArticle,
  getPressArticleSlugs,
} from "@/lib/press-articles";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPressArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveMediaPageData(normalizeRouteSlug(slug));
  if (!page) return {};
  return pageDataToMetadata(page);
}

export default async function MediaPressArticlePage({ params }: Props) {
  const { slug } = await params;
  const normalized = normalizeRouteSlug(slug);
  const page = resolveMediaPageData(normalized);
  const article = getPressArticle(normalized);
  if (!page || !article) notFound();

  return (
    <>
      <JsonLd data={buildNewsArticleSchema(article)} />
      <PressArticleLayout article={article} />
    </>
  );
}
